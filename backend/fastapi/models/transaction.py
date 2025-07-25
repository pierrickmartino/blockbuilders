from sqlmodel import Numeric, Relationship, SQLModel, Field, DateTime, Column
from typing import TYPE_CHECKING, Optional
import uuid
import datetime

# This file defines the models for transactions used in the application.


class Transaction(SQLModel):
    type: str = Field(max_length=3, nullable=False)  # Type of the transaction (IN or OUT)
    quantity: float = Field(default=0.0, sa_column=Column(Numeric(32, 18), nullable=False))  # Quantity of the transaction
    date: datetime.datetime = Field(default=datetime.datetime.now, sa_column=Column(DateTime, nullable=False))  # Date of the transaction
    comment: str = Field(default="", nullable=True)  # Comment about the transaction
    hash: str = Field(max_length=255, default="", nullable=False)  # Hash of the transaction
    price: float = Field(default=0.0, sa_column=Column(Numeric(24, 8), nullable=False))  # Price of the transaction
    running_quantity: float = Field(default=0.0, sa_column=Column(Numeric(32, 18), nullable=False))  # Running quantity of the transaction
    buy_quantity: float = Field(default=0.0, sa_column=Column(Numeric(32, 18), nullable=False))  # Buy quantity of the transaction
    sell_quantity: float = Field(default=0.0, sa_column=Column(Numeric(32, 18), nullable=False))  # Sell quantity of the transaction
    cost: float = Field(default=0.0, sa_column=Column(Numeric(15, 2), nullable=False))  # Cost of the transaction
    total_cost: float = Field(default=0.0, sa_column=Column(Numeric(15, 2), nullable=False))  # Total cost of the transaction
    average_cost: float = Field(default=0.0, sa_column=Column(Numeric(15, 2), nullable=False))  # Average cost of the transaction
    capital_gain: float = Field(default=0.0, sa_column=Column(Numeric(15, 2), nullable=False))  # Capital gain of the transaction
    running_capital_gain: float = Field(
        default=0.0, sa_column=Column(Numeric(15, 2), nullable=False)
    )  # Running capital gain of the transaction
    status: str = Field(max_length=20, nullable=True)
    status_value: float = Field(default=0.0, sa_column=Column(Numeric(24, 8), nullable=True))


class TransactionExtended(Transaction):
    price_contract_based: float = Field(
        default=0.0, sa_column=Column(Numeric(24, 8), nullable=False)
    )  # Price of the transaction in contract units
    price_fiat_based: float = Field(default=0.0, sa_column=Column(Numeric(24, 8), nullable=False))  # Price of the transaction in fiat units
    cost_contract_based: float = Field(
        default=0.0, sa_column=Column(Numeric(15, 2), nullable=False)
    )  # Cost of the transaction in contract units
    cost_fiat_based: float = Field(default=0.0, sa_column=Column(Numeric(15, 2), nullable=False))  # Cost of the transaction in fiat units
    total_cost_contract_based: float = Field(
        default=0.0, sa_column=Column(Numeric(15, 2), nullable=False)
    )  # Total cost of the transaction in contract units
    total_cost_fiat_based: float = Field(
        default=0.0, sa_column=Column(Numeric(15, 2), nullable=False)
    )  # Total cost of the transaction in fiat units
    average_cost_contract_based: float = Field(
        default=0.0, sa_column=Column(Numeric(15, 2), nullable=False)
    )  # Average cost of the transaction in contract units
    average_cost_fiat_based: float = Field(
        default=0.0, sa_column=Column(Numeric(15, 2), nullable=False)
    )  # Average cost of the transaction in fiat units


class TransactionCreate(TransactionExtended):
    pass


class app_Transaction(TransactionExtended, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # Unique identifier for the contract
    created_at: datetime.datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False))  # Creation timestamp
    updated_at: datetime.datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False))  # Update timestamp

    position_id: uuid.UUID = Field(foreign_key="app_position.id")  # Foreign key to the position
    position: Optional["app_Position"] = Relationship(back_populates="transactions")  # Relationship to the position

    against_contract_id: uuid.UUID = Field(default=None, foreign_key="app_contract.id")  # Foreign key to the contract
    against_contract: Optional["app_Contract"] = Relationship(back_populates="counterpart_transactions")  # Relationship to the contract

    against_fiat_id: uuid.UUID = Field(default=None, foreign_key="app_fiat.id")  # Foreign key to the fiat currency
    against_fiat: Optional["app_Fiat"] = Relationship(back_populates="counterpart_fiats")  # Relationship to the fiat currency


class TransactionExtendedPublic(TransactionExtended):
    id: uuid.UUID  # Unique identifier for the transaction


class TransactionPublic(Transaction):
    id: uuid.UUID  # Unique identifier for the transaction


class TransactionUpdate(SQLModel):
    type: str | None = None  # Type of the transaction (IN or OUT)
    quantity: float | None = None  # Quantity of the transaction
    date: datetime.datetime | None = None  # Date of the transaction
    comment: str | None = None  # Comment about the transaction
    hash: str | None = None  # Hash of the transaction
    price: float | None = None  # Price of the transaction
    running_quantity: float | None = None  # Running quantity of the transaction
    buy_quantity: float | None = None  # Buy quantity of the transaction
    sell_quantity: float | None = None  # Sell quantity of the transaction
    cost: float | None = None  # Cost of the transaction
    total_cost: float | None = None  # Total cost of the transaction
    average_cost: float | None = None  # Average cost of the transaction
    capital_gain: float | None = None  # Capital gain of the transaction
    running_capital_gain: float | None = None  # Running capital gain of the transaction
    status: str | None = None  # Status of the transaction
    status_value: float | None = None  # Status value of the transaction


class TransactionPublicWithPositionAndContractAndFiat(TransactionPublic):
    position: Optional["PositionPublic"] = None  # Position information associated with the transaction
    against_contract: Optional["ContractPublic"] = None  # Contract information associated with the transaction
    against_fiat: Optional["FiatPublic"] = None  # Fiat currency information associated with the transaction


class TransactionExtendedPublicWithPositionAndContractAndFiat(TransactionExtendedPublic):
    position: Optional["PositionPublic"] = None  # Position information associated with the transaction
    against_contract: Optional["ContractPublic"] = None  # Contract information associated with the transaction
    against_fiat: Optional["FiatPublic"] = None  # Fiat currency information associated with the transaction


class TransactionsExtendedPublic(SQLModel):
    data: list[TransactionExtendedPublic]  # List of transactions
    count: int  # Total count of transactions


class TransactionsPublic(SQLModel):
    data: list[TransactionPublicWithPositionAndContractAndFiat]  # List of transactions
    count: int  # Total count of transactions


# This is a workaround to avoid circular imports
if TYPE_CHECKING:
    from models.contract import app_Contract, ContractPublic
    from models.fiat import app_Fiat, FiatPublic
    from models.position import app_Position, PositionPublic

from models.contract import ContractPublic
from models.fiat import FiatPublic
from models.position import PositionPublic

TransactionPublicWithPositionAndContractAndFiat.model_rebuild()  # Rebuild the model to ensure relationships are set up correctly
TransactionExtendedPublicWithPositionAndContractAndFiat.model_rebuild()  # Rebuild the model to ensure relationships are set up correctly
