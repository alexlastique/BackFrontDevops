from sqlmodel import SQLModel, Field
from datetime import datetime

class Compte(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    nom: str
    iban: str
    solde: float = Field(default=0.0)
    dateCreation: datetime = Field(default_factory=lambda: datetime.now())
    userId: int = Field(foreign_key="user.id")
    status: bool = Field(default=True)