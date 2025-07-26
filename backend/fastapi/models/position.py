from decimal import Decimal
from sqlmodel import Relationship, SQLModel, Field, DateTime, Column
from typing import TYPE_CHECKING, Optional
import uuid
import datetime

# This file defines the models for positions used in the application.


class Position(SQLModel):
    quantity: Decimal = Field(max_digits=32, decimal_places=18, default=0)  # Quantity of the position
    average_cost: Decimal = Field(max_digits=15, decimal_places=2, default=0)  # Average cost of the position
    amount: Decimal = Field(max_digits=15, decimal_places=2, default=0)  # Amount of the position


class PositionExtended(Position):
    daily_price_delta: Decimal = Field(max_digits=15, decimal_places=2, default=0)  # Daily price delta of the position
    weekly_price_delta: Decimal = Field(max_digits=15, decimal_places=2, default=0)  # Weekly price delta of the position
    monthly_price_delta: Decimal = Field(max_digits=15, decimal_places=2, default=0)  # Monthly price delta of the position
    progress_percentage: Decimal = Field(max_digits=15, decimal_places=2, default=0)  # Progress percentage of the position
    total_cost: Decimal = Field(max_digits=15, decimal_places=2, default=0)  # Total cost of the position
    unrealized_gain: Decimal = Field(max_digits=15, decimal_places=2, default=0)  # Unrealized gain of the position
    unrealized_gain_percentage: Decimal = Field(max_digits=15, decimal_places=2, default=0)  # Unrealized gain percentage of the position
    capital_gain: Decimal = Field(max_digits=15, decimal_places=2, default=0)  # Capital gain of the position


class PositionCreate(PositionExtended):
    pass


class app_Position(PositionExtended, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # Unique identifier for the contract
    created_at: datetime.datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False))  # Creation timestamp
    updated_at: datetime.datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False))  # Update timestamp

    wallet: Optional["app_Wallet"] = Relationship(back_populates="positions")  # Relationship to the wallet
    wallet_id: uuid.UUID = Field(foreign_key="app_wallet.id")  # Foreign key to the wallet

    contract: Optional["app_Contract"] = Relationship(back_populates="positions")  # Relationship to the contract
    contract_id: uuid.UUID = Field(foreign_key="app_contract.id")  # Foreign key to the contract

    transactions: list["app_Transaction"] = Relationship(back_populates="position")  # Relationship to the transactions


class PositionExtendedPublic(PositionExtended):
    id: uuid.UUID  # Unique identifier for the position


class PositionPublic(Position):
    id: uuid.UUID  # Unique identifier for the position


class PositionUpdate(SQLModel):
    quantity: float | None = None  # Quantity of the position
    average_cost: float | None = None  # Average cost of the position
    amount: float | None = None  # Amount of the position


class PositionPublicWithWalletAndContract(PositionPublic):
    wallet: Optional["WalletPublic"] = None  # Wallet information associated with the position
    contract: Optional["ContractPublic"] = None  # Contract information associated with the position


class PositionExtendedPublicWithWalletAndContract(PositionExtendedPublic):
    wallet: Optional["WalletPublic"] = None  # Wallet information associated with the position
    contract: Optional["ContractPublic"] = None  # Contract information associated with the position


class PositionsExtendedPublic(SQLModel):
    data: list[PositionExtendedPublic]  # List of positions
    count: int  # Total count of positions


class PositionsPublic(SQLModel):
    data: list[PositionPublicWithWalletAndContract]  # List of positions
    count: int  # Total count of positions


# This is a workaround to avoid circular imports
if TYPE_CHECKING:
    from models.contract import app_Contract, ContractPublic
    from models.wallet import app_Wallet, WalletPublic
    from models.transaction import app_Transaction

from models.wallet import WalletPublic
from models.contract import ContractPublic

PositionPublicWithWalletAndContract.model_rebuild()  # Rebuild the model to ensure relationships are set up correctly
PositionExtendedPublicWithWalletAndContract.model_rebuild()  # Rebuild the model to ensure relationships are set up correctly
