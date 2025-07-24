from sqlmodel import SQLModel, Field
import uuid

class FiatBase(SQLModel):
    name: str = Field(max_length=255, unique=True)
    symbol: str = Field(max_length=50, unique=True)
    short_symbol: str = Field(max_length=3, default="")
    exchange_rate: float = Field(default=1.0)

class FiatCreate(FiatBase):
    pass

class app_Fiat(FiatBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class FiatPublic(FiatBase):
    id: uuid.UUID

class FiatUpdate(SQLModel):
    name: str | None = Field(default=None, max_length=255)
    symbol: str | None = Field(default=None, max_length=50)
    short_symbol: str | None = Field(default=None, max_length=3)
    exchange_rate: float | None = Field(default=None)

class FiatsPublic(SQLModel):
    data: list[FiatPublic]
    count: int