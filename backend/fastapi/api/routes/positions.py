import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from api.deps import CurrentUser, SessionDep
from models import app_Position, PositionPublic, PositionCreate, PositionUpdate, PositionsPublic, Message

router = APIRouter(prefix="/positions", tags=["positions"])

@router.get("/", response_model=PositionsPublic)
def read_positions(session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve positions.
    """

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(app_Position)
        count = session.exec(count_statement).one()
        statement = select(app_Position).offset(skip).limit(limit)
        positions = session.exec(statement).all()
    else:
        count_statement = select(func.count()).select_from(app_Position)
        count = session.exec(count_statement).one()
        statement = select(app_Position).offset(skip).limit(limit)
        positions = session.exec(statement).all()

    return PositionsPublic(data=positions, count=count)



@router.get("/{id}", response_model=PositionPublic)
def read_position(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get position by ID.
    """
    position = session.get(app_Position, id)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    if not current_user.is_superuser and (position.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return position


@router.post("/", response_model=PositionPublic)
def create_position(*, session: SessionDep, current_user: CurrentUser, item_in: PositionCreate) -> Any:
    """
    Create new position.
    """
    position = app_Position.model_validate(item_in)
    session.add(position)
    session.commit()
    session.refresh(position)
    return position


@router.patch("/{id}", response_model=PositionPublic)
def update_position(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    item_in: PositionUpdate,
) -> Any:
    """
    Update a position.
    """
    position = session.get(app_Position, id)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = item_in.model_dump(exclude_unset=True)
    position.sqlmodel_update(update_dict)
    session.add(position)
    session.commit()
    session.refresh(position)
    return position


@router.delete("/{id}")
def delete_position(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Message:
    """
    Delete a position.
    """
    position = session.get(app_Position, id)
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(position)
    session.commit()
    return Message(message="Position deleted successfully")
