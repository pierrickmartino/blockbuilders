from sqlmodel import Numeric, Relationship, SQLModel, Field, DateTime, Column
from typing import TYPE_CHECKING, Optional
import uuid
import datetime

# This file defines the models for fiat currencies used in the application.


class FiatBase(SQLModel):
    name: str = Field(max_length=255, unique=True)  # Name of the fiat currency
    symbol: str = Field(max_length=50, unique=True)  # Symbol for the fiat currency
    short_symbol: str = Field(max_length=3, default="")  # Short symbol for the fiat currency
    exchange_rate: float = Field(default=1.0, sa_column=Column(Numeric(15, 8), nullable=False))  # Exchange rate against USD


class FiatCreate(FiatBase):
    pass


class app_Fiat(FiatBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # Unique identifier for the fiat currency
    counterpart_fiats: list["app_Transaction"] = Relationship(back_populates="against_fiat")  # Relationship to the transactions


class FiatPublic(FiatBase):
    id: uuid.UUID  # Unique identifier for the fiat currency


class FiatUpdate(SQLModel):
    name: str | None = None  # Name of the fiat currency
    symbol: str | None = None  # Symbol for the fiat currency
    short_symbol: str | None = None  # Short symbol for the fiat currency
    exchange_rate: float | None = None  # Exchange rate against USD


class FiatsPublic(SQLModel):
    data: list[FiatPublic]  # List of fiat currencies
    count: int  # Total count of fiat currencies

# This is a workaround to avoid circular imports
if TYPE_CHECKING:
    from models.transaction import app_Transaction