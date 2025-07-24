from sqlmodel import Numeric, Relationship, SQLModel, Field, DateTime, Column
from typing import TYPE_CHECKING, Optional
import uuid
import datetime

# This file defines the models for blockchains used in the application.


class Blockchain(SQLModel):
    name: str = Field(max_length=255, unique=True)  # Name of the blockchain
    icon: str = Field(max_length=255, unique=True)  # Icon URL for the blockchain
    is_active: bool = Field(default=True)  # Indicates if the blockchain is active


class BlockchainExtended(Blockchain):
    gecko_id: str = Field(max_length=255, default="")  # Gecko ID for the blockchain
    gecko_chain_identifier: str = Field(max_length=255, default="")  # Gecko chain identifier
    gecko_name: str = Field(max_length=255, default="")  # Gecko name
    gecko_shortname: str = Field(max_length=255, default="")  # Gecko short name
    gecko_native_coin_id: str = Field(max_length=255, default="")  # Gecko native coin id
    transaction_link: str = Field(max_length=255, default="")  # Url link of the transaction on the blockchain explorer
    balance: float = Field(default=0.0, sa_column=Column(Numeric(15, 2), nullable=False))  # Balance of the blockchain
    capital_gain: float = Field(default=0.0, sa_column=Column(Numeric(15, 2), nullable=False))  # Capital gain of the blockchain
    unrealized_gain: float = Field(default=0.0, sa_column=Column(Numeric(15, 2), nullable=False))  # Unrealized gain of the blockchain
    progress_percentage: float = Field(
        default=0.0, sa_column=Column(Numeric(15, 2), nullable=False)
    )  # Progress percentage of the blockchain


class BlockchainCreate(BlockchainExtended):
    pass


class app_Blockchain(BlockchainExtended, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # Unique identifier for the blockchain
    contracts: list["app_Contract"] = Relationship(back_populates="blockchain")  # Relationship to the contracts


class BlockchainExtendedPublic(BlockchainExtended):
    id: uuid.UUID  # Unique identifier for the blockchain

class BlockchainPublic(Blockchain):
    id: uuid.UUID  # Unique identifier for the blockchain


class BlockchainUpdate(SQLModel):
    name: str | None = None  # Name of the blockchain
    icon: str | None = None  # Icon URL for the blockchain
    is_active: bool | None = None  # Indicates if the blockchain is active
    gecko_id: str | None = None  # Gecko ID for the blockchain
    gecko_chain_identifier: str | None = None  # Gecko chain identifier
    gecko_name: str | None = None  # Gecko name
    gecko_shortname: str | None = None  # Gecko short name
    gecko_native_coin_id: str | None = None  # Gecko native coin id
    transaction_link: str | None = None  # Url link of the transaction on the blockchain explorer
    balance: float | None = None  # Balance of the blockchain
    capital_gain: float | None = None  # Capital gain of the blockchain
    unrealized_gain: float | None = None  # Unrealized gain of the blockchain
    progress_percentage: float | None = None  # Progress percentage of the blockchain


class BlockchainsExtendedPublic(SQLModel):
    data: list[BlockchainExtendedPublic]  # List of blockchains
    count: int  # Total count of blockchains

class BlockchainsPublic(SQLModel):
    data: list[BlockchainPublic]  # List of blockchains
    count: int  # Total count of blockchains

# This is a workaround to avoid circular imports
if TYPE_CHECKING:
    from models.contract import app_Contract
