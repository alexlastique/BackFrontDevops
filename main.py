from datetime import datetime, timedelta
import hashlib, jwt
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, create_engine, SQLModel, Field, select, or_, join
from pydantic import BaseModel
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pathlib import Path
from user import User
from compte import Compte
from transaction import Transaction
import logging

app = FastAPI()

logging.basicConfig(level=logging.INFO)

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    database = Path("../database.db")
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

@app.post("/account_add/")
def create_compte(body: Compte, session = Depends(get_session), user=Depends(get_user)):
    compte = Compte(nom=body.nom , iban=body.iban , userId=user["id"])
    session.add(compte)
    session.commit()
    session.refresh(compte)
    return compte

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

soldeCompte = 90000
@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API BackFrontDevops"}

@app.get("/users/")
def read_users(session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users

@app.post("/register")
async def register(email: str, mdp: str, session=Depends(get_session)):
    query = select(User).where(User.email == email)
    users = session.exec(query).all()
    if users:
        return {"message": "L'email est déjà utilisé"}
    if not mdp:
        return {"message": "Le mot de passe est requis"}
    
    mdp_hash = hashlib.sha256(mdp.encode()).hexdigest()
    user = User(email=email, mdp=mdp_hash)
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"message": "Utilisateur créé avec succès"}

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
async def deposit(amount: float, iban_dest : str, session=Depends(get_session), user=Depends(get_user)):
    if amount<=0:
        return {"message": "Le montant doit être supérieur à zéro"}
    
    query = select(Compte.iban).where(Compte.userId == user["id"])
    listIban = session.exec(query).all()

    if iban_dest not in listIban:
        return {"message": "Compte introuvable"}
    
    query = select(Compte).where(Compte.iban == iban_dest)
    compte = session.exec(query).first()
    compte.solde += amount
    session.commit()
    session.refresh(compte)

    transaction = Transaction(compte_sender_id= 0, compte_receiver_id=iban_dest, montant=amount, state="Valide")
    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    return {"message": f"Dépot de {amount} euros réussi. Il vous reste {compte.solde}."}

@app.post("/send_money")
async def send_money(amount: float, compte_dest: str, iban: str, user=Depends(get_user), session=Depends(get_session)):
    query = select(Compte.iban)
    listIban = session.exec(query).all()
    if compte_dest not in listIban:
        return {"message": "Le compte cible est inaccessible"}
    query = select(Compte.iban).where(Compte.userId == user["id"])
    listIban = session.exec(query).all()
    if iban not in listIban:
        return {"message": "Ceci n'est pas votre compte"}
    query = select(Compte).where(Compte.iban == iban)
    compte = session.exec(query).first()
    if amount<=0:
        return {"message": "Le montant doit être supérieur à zéro"}
    if compte_dest==compte.iban:
        return {"message": "Vous ne pouvez pas transférer de l'argent à votre propre compte"}
    if amount>compte.solde:
        return {"message": "Le montant transféré dépasse le solde du compte"}
    compte.solde -= amount
    session.commit()
    session.refresh(compte)

    transaction = Transaction(compte_sender_id=compte.iban, compte_receiver_id=compte_dest, montant=amount)
    session.add(transaction)
    session.commit()
    session.refresh(transaction)

    return {"message": f"Transfert de {amount} euros vers {compte_dest} réussi. Il vous reste {compte.solde}."}

@app.post("/cancel_transaction")
async def cancel_transaction(id: int, iban: str, session=Depends(get_session), user=Depends(get_user)):

    query = (
    select(Transaction)
    .join(Compte, Compte.iban == Transaction.compte_sender_id)
    .where(
        Transaction.id == id,
        Transaction.state == "En attente",
        Compte.userId == user["id"]
        )
    )

    transaction = session.exec(query).first()
    if datetime.now().timestamp() - transaction.date.timestamp() > 60 :
        return {"message": f"Vous ne pouvez annuler une transaction car dépassement du délai : cela a pris {datetime.now().timestamp() - transaction.date.timestamp()}"}
    
    if transaction is None:
        return {"message": f"La transaction avec l'id {id} n est pas la mienne ou n est pas en attente"}


    query = select(Transaction.montant).where(Transaction.id == id)
    amount_to_give_back = session.exec(query).first()

    query = select(Compte).where(Compte.iban == iban)
    compte = session.exec(query).first()
    compte.solde += amount_to_give_back
    session.commit()
    session.refresh(compte)


    transaction.state = "Annulée"
    session.commit()
    session.refresh(transaction)
    return {"message": "Transaction annulée avec succès"}

@app.get("/comptes")
async def get_comptes_by_user( user=Depends(get_user), session=Depends(get_session)):
    query = select(Compte.nom, Compte.iban, Compte.solde, Compte.dateCreation).where(Compte.userId == user["id"]).order_by(Compte.dateCreation.desc())
    comptes = session.exec(query).all()
    comptes = [tuple(row) for row in comptes]
    return comptes

@app.get("/compte/{iban}")
async def get_compte(iban: str, user=Depends(get_user), session=Depends(get_session)):
    query = select(Compte.iban).where(Compte.userId == user["id"])
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