from sqlmodel import Numeric, Relationship, SQLModel, Field, DateTime, Column
from typing import TYPE_CHECKING, Optional
import uuid
import datetime

# This file defines the models for contracts used in the application.


class Contract(SQLModel):
    name: str = Field(max_length=255, unique=True)  # Name of the contract
    symbol: str = Field(max_length=50)  # Symbol of the contract
    relative_symbol: str = Field(max_length=50, default="")  # Symbol of the contract
    address: str = Field(max_length=255)  # Unique address of the contract
    logo_uri: str = Field(max_length=255, default="")  # Logo URI of the contract
    decimals: int = Field(default=0)  # Decimals used to calculate quantity of the contract
    price: float = Field(default=0.0, sa_column=Column(Numeric(15, 8), nullable=False))  # Current price of the contract
    category: str = Field(max_length=20, default="standard")  # Category of the contract
    blockchain_id: uuid.UUID = Field(foreign_key="app_blockchain.id")  # Foreign key to the blockchain


class ContractExtended(Contract):
    previous_day_price: float = Field(default=0.0, sa_column=Column(Numeric(15, 8), nullable=False))  # Price of the contract 24 hours ago
    previous_week_price: float = Field(default=0.0, sa_column=Column(Numeric(15, 8), nullable=False))  # Price of the contract 7 days ago
    previous_month_price: float = Field(default=0.0, sa_column=Column(Numeric(15, 8), nullable=False))  # Price of the contract 30 days ago
    previous_day: datetime.datetime = Field(default=datetime.datetime.now)  # Timestamp of the previous day's price
    previous_week: datetime.datetime = Field(default=datetime.datetime.now)  # Timestamp of the previous week's price
    previous_month: datetime.datetime = Field(default=datetime.datetime.now)  # Timestamp of the previous month's price
    supply_issued: float = Field(default=0.0, sa_column=Column(Numeric(24, 6), nullable=False))  # Supply issued of the contract
    supply_total: float = Field(default=0.0, sa_column=Column(Numeric(24, 6), nullable=False))  # Total supply of the contract
    supply_locked: float = Field(default=0.0, sa_column=Column(Numeric(24, 6), nullable=False))  # Supply locked of the contract
    supply_circulating: float = Field(default=0.0, sa_column=Column(Numeric(24, 6), nullable=False))  # Supply circulating of the contract
    supply_staked: float = Field(default=0.0, sa_column=Column(Numeric(24, 6), nullable=False))  # Supply staked of the contract
    supply_burnt: float = Field(default=0.0, sa_column=Column(Numeric(24, 6), nullable=False))  # Supply burnt of the contract
    market_cap: float = Field(default=0.0, sa_column=Column(Numeric(24, 6), nullable=False))  # Market cap of the contract
    description: str | None = Field(default=None)  # Description of the contract


class ContractCreate(ContractExtended):
    pass


class app_Contract(ContractExtended, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # Unique identifier for the contract
    blockchain: Optional["app_Blockchain"] = Relationship(back_populates="contracts")  # Relationship to the blockchain


class ContractExtendedPublic(ContractExtended):
    id: uuid.UUID  # Unique identifier for the contract


class ContractPublic(Contract):
    id: uuid.UUID  # Unique identifier for the contract


class ContractUpdate(SQLModel):
    name: str | None = None  # Name of the contract
    symbol: str | None = None  # Symbol of the contract
    relative_symbol: str | None = None  # Relative symbol of the contract
    address: str | None = None  # Unique address of the contract
    logo_uri: str | None = None  # Logo URI of the contract
    decimals: int | None = None  # Decimals used to calculate quantity of the contract
    price: float | None = None  # Current price of the contract
    previous_day_price: float | None = None  # Price of the contract 24 hours ago
    previous_week_price: float | None = None  # Price of the contract 7 days ago
    previous_month_price: float | None = None  # Price of the contract 30 days ago
    category: str | None = None  # Category of the contract
    market_cap: float | None = None  # Market cap of the contract
    description: str | None = None  # Description of the contract
    supply_issued: float | None = None  # Supply issued of the contract
    supply_total: float | None = None  # Total supply of the contract
    supply_locked: float | None = None  # Supply locked
    supply_circulating: float | None = None  # Supply circulating of the contract
    supply_staked: float | None = None  # Supply staked of the contract
    supply_burnt: float | None = None  # Supply burnt of the contract
    blockchain_id: uuid.UUID | None = None  # Foreign key to the blockchain


class ContractPublicWithBlockchain(ContractPublic):
    blockchain: Optional["BlockchainPublic"] = None  # Blockchain information associated with the contract

class ContractExtendedPublicWithBlockchain(ContractExtendedPublic):
    blockchain: Optional["BlockchainPublic"] = None  # Blockchain information associated with the contract

class ContractsExtendedPublic(SQLModel):
    data: list[ContractExtendedPublic]  # List of contracts
    count: int  # Total count of contracts


class ContractsPublic(SQLModel):
    data: list[ContractPublicWithBlockchain]  # List of contracts
    count: int  # Total count of contracts


# This is a workaround to avoid circular imports
if TYPE_CHECKING:
    from models.blockchain import BlockchainPublic, app_Blockchain, BlockchainPublic

from models.blockchain import BlockchainPublic, BlockchainPublic

ContractPublicWithBlockchain.model_rebuild()
ContractExtendedPublicWithBlockchain.model_rebuild()
