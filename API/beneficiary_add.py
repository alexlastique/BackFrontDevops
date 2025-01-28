from pydantic import BaseModel

class Beneficiary_add(BaseModel):
    nom: str
    iban: str