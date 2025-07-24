import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from api.deps import CurrentUser, SessionDep
from models import app_Blockchain, BlockchainPublic, BlockchainCreate, BlockchainUpdate, BlockchainsPublic, Message

router = APIRouter(prefix="/blockchains", tags=["blockchains"])


@router.get("/", response_model=BlockchainsPublic)
def read_blockchains(session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve blockchains.
    """

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(app_Blockchain)
        count = session.exec(count_statement).one()
        statement = select(app_Blockchain).offset(skip).limit(limit)
        blockchains = session.exec(statement).all()
    else:
        count_statement = select(func.count()).select_from(app_Blockchain)
        count = session.exec(count_statement).one()
        statement = select(app_Blockchain).offset(skip).limit(limit)
        blockchains = session.exec(statement).all()

    return BlockchainsPublic(data=blockchains, count=count)


@router.get("/{id}", response_model=BlockchainPublic)
def read_blockchain(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get blockchain by ID.
    """
    blockchain = session.get(app_Blockchain, id)
    if not blockchain:
        raise HTTPException(status_code=404, detail="Blockchain not found")
    if not current_user.is_superuser and (blockchain.owner_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return blockchain


@router.post("/", response_model=BlockchainPublic)
def create_blockchain(*, session: SessionDep, current_user: CurrentUser, item_in: BlockchainCreate) -> Any:
    """
    Create new blockchain.
    """
    blockchain = app_Blockchain.model_validate(item_in)
    session.add(blockchain)
    session.commit()
    session.refresh(blockchain)
    return blockchain


@router.patch("/{id}", response_model=BlockchainPublic)
def update_blockchain(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    item_in: BlockchainUpdate,
) -> Any:
    """
    Update a blockchain.
    """
    blockchain = session.get(app_Blockchain, id)
    if not blockchain:
        raise HTTPException(status_code=404, detail="Blockchain not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = item_in.model_dump(exclude_unset=True)
    blockchain.sqlmodel_update(update_dict)
    session.add(blockchain)
    session.commit()
    session.refresh(blockchain)
    return blockchain


@router.delete("/{id}")
def delete_blockchain(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Message:
    """
    Delete a blockchain.
    """
    blockchain = session.get(app_Blockchain, id)
    if not blockchain:
        raise HTTPException(status_code=404, detail="Blockchain not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(blockchain)
    session.commit()
    return Message(message="Blockchain deleted successfully")
