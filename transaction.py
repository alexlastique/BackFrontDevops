from sqlmodel import SQLModel, Field
from datetime import datetime

class Transaction(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    compte_sender_id: str = Field(default=None, foreign_key="compte.iban")
    compte_receiver_id: str = Field(foreign_key="compte.iban")
    montant: float
    date: datetime = Field(default_factory=lambda: datetime.now())
    state: str = Field(default="En attente")