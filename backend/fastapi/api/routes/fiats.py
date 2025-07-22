import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from api.deps import CurrentUser, SessionDep
from models import FiatCreate, FiatUpdate, app_Fiat, FiatPublic, FiatsPublic, Message

router = APIRouter(prefix="/fiats", tags=["fiats"])


@router.get("/", response_model=FiatsPublic)
def read_fiats(session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve fiat currencies.
    """

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(app_Fiat)
        count = session.exec(count_statement).one()
        statement = select(app_Fiat).offset(skip).limit(limit)
        fiats = session.exec(statement).all()
    else:
        count_statement = select(func.count()).select_from(app_Fiat)
        count = session.exec(count_statement).one()
        statement = select(app_Fiat).offset(skip).limit(limit)
        fiats = session.exec(statement).all()

    return FiatsPublic(data=fiats, count=count)


@router.get("/{id}", response_model=FiatPublic)
def read_fiat(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get fiat currency by ID.
    """
    fiat = session.get(app_Fiat, id)
    if not fiat:
        raise HTTPException(status_code=404, detail="Fiat currency not found")
    if not current_user.is_superuser and (fiat.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return fiat


@router.post("/", response_model=FiatPublic)
def create_fiat(*, session: SessionDep, current_user: CurrentUser, item_in: FiatCreate) -> Any:
    """
    Create new fiat currency.
    """
    fiat = app_Fiat.model_validate(item_in)
    session.add(fiat)
    session.commit()
    session.refresh(fiat)
    return fiat


@router.put("/{id}", response_model=FiatPublic)
def update_fiat(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    item_in: FiatUpdate,
) -> Any:
    """
    Update a fiat currency.
    """
    fiat = session.get(app_Fiat, id)
    if not fiat:
        raise HTTPException(status_code=404, detail="Fiat currency not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = item_in.model_dump(exclude_unset=True)
    fiat.sqlmodel_update(update_dict)
    session.add(fiat)
    session.commit()
    session.refresh(fiat)
    return fiat


@router.delete("/{id}")
def delete_fiat(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Message:
    """
    Delete a fiat currency.
    """
    fiat = session.get(app_Fiat, id)
    if not fiat:
        raise HTTPException(status_code=404, detail="Fiat currency not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(fiat)
    session.commit()
    return Message(message="Fiat currency deleted successfully")
