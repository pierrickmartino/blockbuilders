from decimal import Decimal
from sqlmodel import Relationship, SQLModel, Field
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
    price: Decimal = Field(max_digits=24, decimal_places=8, default=0)  # Current price of the contract
    category: str = Field(max_length=20, default="standard")  # Category of the contract
    blockchain_id: uuid.UUID = Field(foreign_key="app_blockchain.id")  # Foreign key to the blockchain


class ContractExtended(Contract):
    previous_day_price: Decimal = Field(max_digits=15, decimal_places=8, default=0)  # Price of the contract 24 hours ago
    previous_week_price: Decimal = Field(max_digits=15, decimal_places=8, default=0)  # Price of the contract 7 days ago
    previous_month_price: Decimal = Field(max_digits=15, decimal_places=8, default=0)  # Price of the contract 30 days ago
    previous_day: datetime.datetime = Field(default=datetime.datetime.now)  # Timestamp of the previous day's price
    previous_week: datetime.datetime = Field(default=datetime.datetime.now)  # Timestamp of the previous week's price
    previous_month: datetime.datetime = Field(default=datetime.datetime.now)  # Timestamp of the previous month's price
    supply_issued: Decimal = Field(max_digits=24, decimal_places=6, default=0)  # Supply issued of the contract
    supply_total: Decimal = Field(max_digits=24, decimal_places=6, default=0)  # Total supply of the contract
    supply_locked: Decimal = Field(max_digits=24, decimal_places=6, default=0)  # Supply locked of the contract
    supply_circulating: Decimal = Field(max_digits=24, decimal_places=6, default=0)  # Supply circulating of the contract
    supply_staked: Decimal = Field(max_digits=24, decimal_places=6, default=0)  # Supply staked of the contract
    supply_burnt: Decimal = Field(max_digits=24, decimal_places=6, default=0)  # Supply burnt of the contract
    market_cap: Decimal = Field(max_digits=24, decimal_places=6, default=0)  # Market cap of the contract
    description: str | None = Field(default=None)  # Description of the contract


class ContractCreate(ContractExtended):
    pass


class app_Contract(ContractExtended, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # Unique identifier for the contract
    blockchain: Optional["app_Blockchain"] = Relationship(back_populates="contracts")  # Relationship to the blockchain
    counterpart_transactions: list["app_Transaction"] = Relationship(back_populates="against_contract")  # Relationship to the transactions
    positions: list["app_Position"] = Relationship(back_populates="contract")  # Relationship to the positions


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
    category: str | None = None  # Category of the contract
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
    from models.transaction import app_Transaction
    from models.position import app_Position

from models.blockchain import BlockchainPublic, BlockchainPublic

ContractPublicWithBlockchain.model_rebuild()
ContractExtendedPublicWithBlockchain.model_rebuild()
