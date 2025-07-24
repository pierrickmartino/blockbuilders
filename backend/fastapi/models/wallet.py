from sqlmodel import Relationship, SQLModel, Field, DateTime, Column
from typing import TYPE_CHECKING, Optional
import uuid
import datetime


class WalletBase(SQLModel):
    address: str = Field(max_length=255, unique=True)
    name: str = Field(max_length=255, unique=True)
    balance: float = Field(default=0.0)
    description: str | None = Field(default=None, max_length=500)
    created_at: datetime.datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False))
    updated_at: datetime.datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False))
    user_id: uuid.UUID | None = Field(default=None, foreign_key="app_user.id")


class WalletCreate(WalletBase):
    pass


class app_Wallet(WalletBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    capital_gain: float = Field(default=0.0)
    unrealized_gain: float = Field(default=0.0)
    progress_percentage: float = Field(default=0.0)
    user: Optional["app_User"] = Relationship(back_populates="wallets")


class WalletPublic(WalletBase):
    id: uuid.UUID


class WalletUpdate(SQLModel):
    address: str | None = Field(default=None, max_length=255)
    name: str | None = Field(default=None, max_length=255)
    description: str | None = Field(default=None, max_length=500)
    user_id: uuid.UUID | None = Field(default=None, foreign_key="app_user.id")


class WalletPublicWithUser(WalletPublic):
    user: Optional["UserPublic"] = None


class WalletsPublic(SQLModel):
    data: list[WalletPublic]
    count: int


if TYPE_CHECKING:
    from models.user import UserPublic, app_User
    
from models.user import UserPublic
WalletPublicWithUser.model_rebuild()

