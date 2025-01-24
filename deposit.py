from pydantic import BaseModel

class Deposit(BaseModel):
    amount: float
    iban_dest: str