import asyncio
from datetime import datetime, time, timedelta
import hashlib, jwt
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, create_engine, SQLModel, Field, select, or_, join
from pydantic import BaseModel
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pathlib import Path
from user import User
from compte import Compte
from transaction import Transaction
from beneficiary import Beneficiary
import logging
from register import Register
from deposit import Deposit
from send_money import SendMoney
from cancel import Cancel
from account import *
from beneficiary_add import Beneficiary_add
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

sqlite_file_name = "API/database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    database = Path("../API/database.db")
    if not database.is_file():
        SQLModel.metadata.create_all(engine)

secret_key = "very_secret_key"
algorithm = "HS256"

bearer_scheme = HTTPBearer()

def get_user(authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    return jwt.decode(authorization.credentials, secret_key, algorithms=[algorithm])

def generate_token(user: User):
    id = {"id": user.id, "email": user.email}
    return jwt.encode(id, secret_key, algorithm=algorithm)

def get_session():
    with Session(engine) as session:
        yield session

def first_compte(nom: str, userId : int, session = Depends(get_session)):
    iban = f"FR{hashlib.sha256(str((datetime.now() + timedelta(days=365)).strftime('%Y%m%d%H%M%S') + nom).encode()).hexdigest()[:20]}"
    compte = Compte(nom=nom, iban=iban, solde=100, userId=userId)
    session.add(compte)
    session.commit()
    session.refresh(compte)
    

    transaction = Transaction(compte_sender_id= 0, compte_receiver_id=compte.iban, montant=100, state="Valide")
    session.add(transaction)
    session.commit()
    session.refresh(transaction)

async def validate_transfers(): 
    while True:
        with Session(engine) as session:
            query = select(Transaction).where(Transaction.state == "En attente", Transaction.date < datetime.now() - timedelta(minutes=5))
            transactions = session.exec(query).all()

            for t in transactions:
                t.state = "Valide"
                session.add(t)
                session.commit()
                session.refresh(t)

                receiver_query = select(Compte).where(Compte.iban == t.compte_receiver_id)
                receiver = session.exec(receiver_query).first()
                if receiver:
                    receiver.solde += t.montant
                    session.add(receiver)
                    session.commit()

        await asyncio.sleep(300)

@app.post("/account_add/")
def create_compte(account: Account_add, session = Depends(get_session), user=Depends(get_user)):
    if account.name == "ComptePrincipal":
        return {"message": "Nom de compte invalide"}
    iban = f"FR{hashlib.sha256(str((datetime.now() + timedelta(days=365)).strftime('%Y%m%d%H%M%S') + account.name).encode()).hexdigest()[:20]}"
    compte = Compte(nom=account.name , iban=iban , userId=user["id"])
    session.add(compte)
    session.commit()
    session.refresh(compte)
    return compte

@app.post("/account_close/")
def delete_compte(account: Account_delete, session = Depends(get_session), user=Depends(get_user)):
    query = select(Compte).where(Compte.iban == account.iban, Compte.status == True)
    compte = session.exec(query).first()
    if compte.nom == "ComptePrincipal":
        return {"Error": "Vous ne pouvez pas clôturer le compte principal"}
    if not compte:
        return {"Error": "Le compte n'existe pas"}
    if compte.userId != user["id"]:
        return {"Error": "Vous ne pouvez pas clôturer un compte qui ne vous appartient pas"}

    query = select(Transaction).where(or_(Transaction.compte_sender_id == account.iban,Transaction.compte_receiver_id == account.iban), Transaction.state == "En attente")
    result = session.exec(query).all()
    if not result and result != []:
        return {"Error": "Vous ne pouvez pas clôturer un compte qui a des transactions en cours"}

    compte.status = False
    session.commit()
    session.refresh(compte)

    solde = compte.solde
    compte.solde = 0
    query = select(Compte).where(Compte.nom == "ComptePrincipal", Compte.userId == user["id"])
    comptePrincipal = session.exec(query).first()
    comptePrincipal.solde += solde
    session.commit()
    session.refresh(comptePrincipal)

    return {"message": "Compte clos avec succès"}

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    asyncio.create_task(validate_transfers())

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API BackFrontDevops"}

@app.get("/users/")
def read_users(session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users

@app.post("/register")
async def register(register: Register, session=Depends(get_session)):
  try:
    query = select(User).where(User.email == register.email)
    users = session.exec(query).all()

    if users:
        return {"error": "L'email est déjà utilisé"}
    
    if not register.mdp:
        return {"error": "Le mot de passe est requis"}
    
    mdp_hash = hashlib.sha256(register.mdp.encode()).hexdigest()
    user = User(email=register.email, mdp=mdp_hash)
    session.add(user)
    session.commit()
    session.refresh(user)
    
    token = generate_token(user)
    first_compte("ComptePrincipal", user.id, session)
    return {"token": token}
  
    
  except Exception as e:
    print(f"Erreur serveur lors de l'inscription : {e}")
    session.rollback()
    raise HTTPException(status_code=500, detail="Erreur interne du serveur")

@app.post("/login")
def login(user: User, session=Depends(get_session)):
    query = select(User).where(User.email == user.email, User.mdp == hashlib.sha256(user.mdp.encode()).hexdigest())
    user = session.exec(query).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email ou mdp incorrect")

    return {"token": generate_token(user)}

@app.get("/me")
def me(user=Depends(get_user), session=Depends(get_session)):
    query = select(Compte).where(Compte.userId == user["id"])
    compte = session.exec(query).all()
    return {"user": user, "Nombre de compte": len(compte)}

@app.post("/deposit")
async def deposit(deposit: Deposit, session=Depends(get_session), user=Depends(get_user)):
    if deposit.amount<=0:
        return {"message": "Le montant doit être supérieur à zéro"}
    
    query = select(Compte.iban).where(Compte.userId == user["id"], Compte.status == True)
    listIban = session.exec(query).all()

    if deposit.iban_dest not in listIban:
        return {"message": "Compte introuvable"}
    
    query = select(Compte).where(Compte.iban == deposit.iban_dest)
    compte = session.exec(query).first()
    compte.solde += deposit.amount
    session.commit()
    session.refresh(compte)

    transaction = Transaction(compte_sender_id= 0, compte_receiver_id=deposit.iban_dest, montant=deposit.amount, state="Valide")
    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    return {"message": f"Dépot de {deposit.amount} euros réussi. Il vous reste {compte.solde}."}

@app.post("/send_money")
async def send_money(sendmoney: SendMoney, user=Depends(get_user), session=Depends(get_session)):
    query = select(Compte.iban).where(Compte.status == True)
    listIban = session.exec(query).all()
    if sendmoney.iban_dest not in listIban:
        return {"message": "Le compte cible est inaccessible"}
    query = select(Compte.iban).where(Compte.userId == user["id"], Compte.status == True)
    listIban = session.exec(query).all()
    if sendmoney.iban_orig not in listIban:
        return {"message": "Ceci n'est pas votre compte"}
    query = select(Compte).where(Compte.iban == sendmoney.iban_orig)
    compte = session.exec(query).first()
    if sendmoney.amount<=0:
        return {"message": "Le montant doit être supérieur à zéro"}
    if sendmoney.iban_dest==compte.iban:
        return {"message": "Vous ne pouvez pas transférer de l'argent à votre propre compte"}
    if sendmoney.amount>compte.solde:
        return {"message": "Le montant transféré dépasse le solde du compte"}
    compte.solde -= sendmoney.amount
    session.commit()
    session.refresh(compte)

    transaction = Transaction(compte_sender_id=compte.iban, compte_receiver_id=sendmoney.iban_dest, montant=sendmoney.amount)
    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    return {"message": f"Transfert de {sendmoney.amount} euros vers {sendmoney.iban_dest} réussi. Il vous reste {compte.solde}."}

@app.post("/cancel_transaction")
async def cancel_transaction(cancel: Cancel, session=Depends(get_session), user=Depends(get_user)):

    query = (
    select(Transaction)
    .join(Compte, Compte.iban == Transaction.compte_sender_id)
    .where(
        Transaction.id == cancel.id,
        Transaction.state == "En attente",
        Compte.userId == user["id"]
        )
    )

    transaction = session.exec(query).first()
    if datetime.now().timestamp() - transaction.date.timestamp() > 60 :
        return {"message": "Vous ne pouvez annuler une transaction car le délai est dépassé"}
    
    if transaction is None:
        return {"message": f"L'anulation de la transaction {cancel.id} n'est pas possible"}


    query = select(Transaction.montant).where(Transaction.id == cancel.id)
    amount_to_give_back = session.exec(query).first()

    query = select(Compte).where(Compte.iban == transaction.compte_sender_id)
    compte = session.exec(query).first()
    compte.solde += amount_to_give_back
    session.commit()
    session.refresh(compte)


    transaction.state = "Annule"
    session.commit()
    session.refresh(transaction)
    return {"message": "Transaction annulée avec succès"}

@app.get("/comptes")
async def get_comptes_by_user( user=Depends(get_user), session=Depends(get_session)):
    query = select(Compte.nom, Compte.iban, Compte.solde, Compte.dateCreation).where(Compte.userId == user["id"], Compte.status == True).order_by(Compte.dateCreation.desc())
    comptes = session.exec(query).all()
    comptes = [tuple(row) for row in comptes]
    return comptes

@app.get("/compte/{iban}")
async def get_compte(iban: str, user=Depends(get_user), session=Depends(get_session)):
    query = select(Compte.iban).where(Compte.userId == user["id"], Compte.status == True)
    listIban = session.exec(query).all()
    if iban not in listIban:
        return {"message": "Compte introuvable"}
    query = select(Compte).where(Compte.iban == iban)
    compte = session.exec(query).first()
    query = select(Transaction).where(Transaction.state == "En attente")
    transactions_on_going = session.exec(query).all()
    query = select(Transaction).where(Transaction.state != "En attente")
    transactions_historique = session.exec(query).all()
    
    return {
        "name": compte.nom,
        "date_creation": compte.dateCreation,
        "iban": compte.iban,
        "user": compte.userId,
        "solde": compte.solde,
        "transactions_on_going": transactions_on_going,
        "transactions_historique": transactions_historique
        }

@app.get("/transactions/{compte_iban}")
async def get_transactions(compte_iban: str, session=Depends(get_session)):
    query = select(Transaction.compte_sender_id, Transaction.compte_receiver_id, Transaction.montant, Transaction.date, Transaction.state).where(or_(Transaction.compte_sender_id == compte_iban, Transaction.compte_receiver_id == compte_iban)).order_by(Transaction.date.desc())
    transactions = session.exec(query).all()
    transactions = [tuple(row) for row in transactions]
    return transactions

@app.get("/transaction/{compte_id}")
async def get_transaction(compte_id: int, user=Depends(get_user), session=Depends(get_session)):
    query = select(Transaction).where(Transaction.id == compte_id)
    transactions = session.exec(query).first()
    if transactions == None:
        raise HTTPException(status_code=404, detail="Transaction introuvable")
    
    query = select(Compte.userId).where(or_(Compte.iban == transactions.compte_sender_id, Compte.iban == transactions.compte_receiver_id))
    user_id = session.exec(query).all()
    if user["id"] not in user_id:
        raise HTTPException(status_code=403, detail="Accès refusé")
    return transactions

@app.post("/beneficiary_add/")
def create_beneficiary(beneficiary_add: Beneficiary_add, session = Depends(get_session), user=Depends(get_user)):
    query = select(Compte.iban).where(Compte.userId == user["id"], Compte.status == True)
    listIban = session.exec(query).all()
    if beneficiary_add.iban in listIban:
        return {"message": "Compte apartient à l'utilisateur"}
    query = select(Beneficiary).where(Beneficiary.iban == beneficiary_add.iban, Beneficiary.iduser == user["id"])
    beneficiary = session.exec(query).first()
    if beneficiary:
        return {"message": "Le bénéficiaire existe déjà"}
    query = select(Compte).where(Compte.iban == beneficiary_add.iban)
    compte = session.exec(query).first()
    if compte is None:
        return {"message": "Compte introuvable"}
    beneficiary = Beneficiary(iban=beneficiary_add.iban, nom=beneficiary_add.nom, iduser=user["id"])
    session.add(beneficiary)
    session.commit()
    session.refresh(beneficiary)
    return beneficiary

@app.get("/beneficiaries/")
def read_beneficiaries(session = Depends(get_session), user=Depends(get_user)):
    query = select(Beneficiary).where(Beneficiary.iduser == user["id"])
    beneficiaries = session.exec(query).all()
    return beneficiaries