import datetime
import uuid

from pydantic import EmailStr
from sqlmodel import Field, SQLModel
import sqlmodel


class FiatBase(SQLModel):
    name: str = Field(max_length=255, unique=True)  # Unique name of the fiat currency
    symbol: str = Field(max_length=50, unique=True)  # Unique symbol of the fiat currency
    short_symbol: str = Field(max_length=3, default="")  # Unique short symbol of the fiat currency ($, €, etc...)
    exchange_rate: float = Field(default=1.0)  # Exchange rate of the fiat currency


class FiatCreate(FiatBase):
    pass


class app_Fiat(FiatBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class FiatPublic(FiatBase):
    id: uuid.UUID


class FiatUpdate(FiatBase):
    name: str | None = Field(default=None, max_length=255)
    symbol: str | None = Field(default=None, max_length=50)
    short_symbol: str | None = Field(default=None, max_length=3)
    exchange_rate: float | None = Field(default=None)


class FiatsPublic(SQLModel):
    data: list[FiatPublic]
    count: int


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    is_staff: bool = False
    last_name: str | None = Field(default=None, max_length=255)
    first_name: str | None = Field(default=None, max_length=255)
    name: str | None = Field(default=None, max_length=255)
    date_joined: datetime.datetime = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.DateTime(timezone=True), nullable=False))


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    last_name: str | None = Field(default=None, max_length=255)
    first_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    last_name: str | None = Field(default=None, max_length=255)
    first_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class app_User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    # items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)
