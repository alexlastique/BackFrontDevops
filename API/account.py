from pydantic import BaseModel

class Account_add(BaseModel):
    name: str

class Account_delete(BaseModel):
    iban: str
    password: str