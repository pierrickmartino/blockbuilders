import uuid
import datetime
from sqlmodel import Relationship, SQLModel, Field, Column, DateTime
from pydantic import EmailStr
from typing import TYPE_CHECKING

# This file defines the models for users used in the application.


class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)  # Email of the user
    is_active: bool = True  # Indicates if the user is active
    is_superuser: bool = False  # Indicates if the user is a superuser
    is_staff: bool = False  # Indicates if the user is a staff member
    last_name: str | None = Field(default=None, max_length=255)  # Last name of the user
    first_name: str | None = Field(default=None, max_length=255)  # First name of the user
    name: str | None = Field(default=None, max_length=255)  # Full name of the user
    date_joined: datetime.datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False))  # Date when the user joined


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)  # Password of the user, must be at least 8 characters long


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)  # Email of the user
    password: str = Field(min_length=8, max_length=40)  # Password of the user, must be at least 8 characters long
    last_name: str | None = Field(default=None, max_length=255)  # Last name of the user
    first_name: str | None = Field(default=None, max_length=255)  # First name of the user


class UserUpdate(UserBase):
    email: EmailStr | None = None  # Email of the user
    password: str | None = None  # Password of the user, can be updated


class UserUpdateMe(SQLModel):
    last_name: str | None = None
    first_name: str | None = None
    email: EmailStr | None = None


class app_User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)  # Unique identifier for the user
    hashed_password: str
    wallets: list["app_Wallet"] = Relationship(back_populates="user")  # Relationship to the user's wallets


class UserPublic(UserBase):
    id: uuid.UUID  # Unique identifier for the user


class UsersPublic(SQLModel):
    data: list[UserPublic]  # List of users
    count: int  # Total count of users


# This is a workaround to avoid circular imports
if TYPE_CHECKING:
    from models.wallet import app_Wallet
