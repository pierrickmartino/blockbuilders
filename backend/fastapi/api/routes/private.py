from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from api.deps import SessionDep
from core.security import get_password_hash
from models import (
    app_User,
    UserPublic,
)

router = APIRouter(tags=["private"], prefix="/private")


class PrivateUserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    is_verified: bool = False    


@router.post("/users/", response_model=UserPublic)
def create_user(user_in: PrivateUserCreate, session: SessionDep) -> Any:
    """
    Create a new user.
    """

    user = app_User(
        email=user_in.email,
        last_name=user_in.last_name,
        first_name=user_in.first_name,
        name=f"{user_in.first_name} {user_in.last_name}",
        hashed_password=get_password_hash(user_in.password),
        date_joined=datetime.now(timezone.utc).isoformat(),  # Store date in ISO format UTC
    )

    session.add(user)
    session.commit()

    return user
