from decimal import Decimal
from sqlmodel import Relationship, SQLModel, Field, DateTime, Column
from typing import TYPE_CHECKING, Optional
import uuid
import datetime

# This file defines the models for wallets used in the application.


class WalletBase(SQLModel):
    address: str = Field(max_length=255, unique=True)  # Address of the wallet
    name: str = Field(max_length=255, unique=True)  # Name of the wallet
    description: str | None = Field(default=None, max_length=500)  # Description of the wallet
    balance: Decimal = Field(max_digits=15, decimal_places=2, default=0)  # Balance of the wallet
    capital_gain: Decimal = Field(max_digits=15, decimal_places=2, default=0)  # Capital gain of the wallet
    unrealized_gain: Decimal = Field(max_digits=15, decimal_places=2, default=0)  # Unrealized gain of the wallet
    progress_percentage: Decimal = Field(max_digits=15, decimal_places=2, default=0)  # Progress percentage of the wallet

class WalletCreate(WalletBase):
    pass


class app_Wallet(WalletBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # Unique identifier for the wallet
    created_at: datetime.datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False))  # Creation timestamp
    updated_at: datetime.datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False))  # Update timestamp

    user_id: uuid.UUID = Field(foreign_key="app_user.id")  # ID of the user who owns the wallet
    user: Optional["app_User"] = Relationship(back_populates="wallets")  # Relationship to the user who owns the wallet

    positions: list["app_Position"] = Relationship(back_populates="wallet")  # Relationship to the positions
    
    
    

class WalletPublic(WalletBase):
    id: uuid.UUID # Unique identifier for the wallet
    created_at: datetime.datetime  # Creation timestamp
    updated_at: datetime.datetime  # Update timestamp


class WalletUpdate(SQLModel):
    address: str | None = None  # Address of the wallet
    name: str | None = None  # Name of the wallet
    description: str | None = None  # Description of the wallet
    balance: float | None = None  # Balance of the wallet
    capital_gain: float | None = None  # Capital gain of the wallet
    unrealized_gain: float | None = None  # Unrealized gain of the wallet
    progress_percentage: float | None = None  # Progress percentage of the wallet
    created_at: datetime.datetime | None = None  # Creation timestamp
    updated_at: datetime.datetime | None = None  # Update timestamp


class WalletPublicWithUser(WalletPublic):
    user: Optional["UserPublic"] = None  # User information associated with the wallet


class WalletsPublic(SQLModel):
    data: list[WalletPublic]  # List of wallets
    count: int  # Total count of wallets


# This is a workaround to avoid circular imports
if TYPE_CHECKING:
    from models.user import UserPublic, app_User
    from models.position import app_Position

from models.user import UserPublic

WalletPublicWithUser.model_rebuild()
