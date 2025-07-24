from sqlmodel import Numeric, Relationship, SQLModel, Field, DateTime, Column
from typing import TYPE_CHECKING, Optional
import uuid
import datetime

# This file defines the models for blockchains used in the application.


class BlockchainBase(SQLModel):
    name: str = Field(max_length=255, unique=True)  # Name of the blockchain
    icon: str = Field(max_length=255, unique=True)  # Icon URL for the blockchain
    is_active: bool = Field(default=True)  # Indicates if the blockchain is active
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


class BlockchainCreate(BlockchainBase):
    pass


class app_Blockchain(BlockchainBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # Unique identifier for the blockchain
    contracts: list["app_Contract"] = Relationship(back_populates="blockchain")


class BlockchainPublic(BlockchainBase):
    id: uuid.UUID  # Unique identifier for the blockchain


class BlockchainUpdate(SQLModel):
    name: str | None = Field(default=None, max_length=255)  # Name of the blockchain
    icon: str | None = Field(default=None, max_length=255)  # Icon URL for the blockchain
    is_active: bool | None = Field(default=None)  # Indicates if the blockchain is active
    gecko_id: str | None = Field(default=None, max_length=255)  # Gecko ID for the blockchain
    gecko_chain_identifier: str | None = Field(default=None, max_length=255)  # Gecko chain identifier
    gecko_name: str | None = Field(default=None, max_length=255)  # Gecko name
    gecko_shortname: str | None = Field(default=None, max_length=255)  # Gecko short name
    gecko_native_coin_id: str | None = Field(default=None, max_length=255)  # Gecko native coin id
    transaction_link: str | None = Field(default=None, max_length=255)  # Url link of the transaction on the blockchain explorer
    balance: float | None = Field(default=None, sa_column=Column(Numeric(15, 2), nullable=False))  # Balance of the blockchain
    capital_gain: float | None = Field(default=None, sa_column=Column(Numeric(15, 2), nullable=False))  # Capital gain of the blockchain
    unrealized_gain: float | None = Field(
        default=None, sa_column=Column(Numeric(15, 2), nullable=False)
    )  # Unrealized gain of the blockchain
    progress_percentage: float | None = Field(
        default=None, sa_column=Column(Numeric(15, 2), nullable=False)
    )  # Progress percentage of the blockchain


class BlockchainsPublic(SQLModel):
    data: list[BlockchainPublic]  # List of blockchains
    count: int  # Total count of blockchains


# This is a workaround to avoid circular imports
if TYPE_CHECKING:
    from models.contract import app_Contract
