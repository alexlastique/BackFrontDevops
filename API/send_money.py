from pydantic import BaseModel

class SendMoney(BaseModel):
    amount: float
    iban_dest: str
    iban_orig: str