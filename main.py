from fastapi import FastAPI

app = FastAPI()

soldeCompte = 90000
@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API BackFrontDevops"}

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
