from sqlmodel import SQLModel, Field
from datetime import datetime

class Beneficiary(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    iban: str
    nom: str
    iduser: int = Field(foreign_key="user.id")
    dateCreation: datetime = Field(default_factory=lambda: datetime.now())