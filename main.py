import hashlib
from fastapi import FastAPI, Depends
from sqlmodel import Session, create_engine, SQLModel, Field, select
from pydantic import BaseModel
from pathlib import Path
from user import User
from compte import Compte
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


def get_session():
    with Session(engine) as session:
        yield session

@app.post("/users_add/")
def create_user(body: User, session = Depends(get_session)) -> User:
    user = User(email=body.email, mdp=body.mdp)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.post("/account_add/")
def create_compte(body: Compte, session = Depends(get_session)) -> Compte:
    compte = Compte(nom=body.nom , iban=body.iban , userId=body.userId)
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







@app.post("/send_money")
async def send_money(amount: float, compte: str):
    global soldeCompte
    if amount<=0:
        return {"message": "Le montant doit être supérieur à zéro"}
    if compte=="backfrontdevops":
        return {"message": "Vous ne pouvez pas transférer de l'argent à votre propre compte"}
    if amount>soldeCompte:
        return {"message": "Le montant transféré dépasse le solde du compte"}
    if compte not in ["test"]:
        return {"message": "Le compte cible est inaccessible"}
    soldeCompte -= amount
    return {"message": f"Transfert de {amount} euros vers {compte} réussi. Il vous reste {soldeCompte}."}

@app.get("/compte/{id}")
async def get_compte(id: str):
    if id not in ["FR78945612307894561230"]:
        return {"message": "Compte introuvable"}
    global soldeCompte
    name = "compte_principale"
    date = "2022-01-01"
    user = "John Doe"
    transactions_on_going = []
    transactions_historique = [
        {"date": "2022-01-01", "montant": 5000, "type": "Débit"},
        {"date": "2022-01-02", "montant": 2000, "type": "Débit"},
        {"date": "2022-01-03", "montant": 300, "type": "Débit"},
        {"date": "2022-01-04", "montant": 1000, "type": "Crédit"}
    ]
    
    return {
        "name": name,
        "date_creation": date,
        "id": id,
        "user": user,
        "solde": soldeCompte,
        "transactions_on_going": transactions_on_going,
        "transactions_historique": transactions_historique
        }
