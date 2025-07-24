import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from api.deps import CurrentUser, SessionDep
from models import WalletsPublic, app_Wallet, WalletPublic, WalletCreate, WalletUpdate, Message, WalletPublicWithUser

router = APIRouter(prefix="/wallets", tags=["wallets"])


@router.get("/", response_model=WalletsPublic)
def read_wallets(session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve wallet information.
    """

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(app_Wallet)
        count = session.exec(count_statement).one()
        statement = select(app_Wallet).offset(skip).limit(limit)
        wallets = session.exec(statement).all()
    else:
        count_statement = select(func.count()).select_from(app_Wallet)
        count = session.exec(count_statement).one()
        statement = select(app_Wallet).offset(skip).limit(limit)
        wallets = session.exec(statement).all()

    return WalletsPublic(data=wallets, count=count)


@router.get("/{id}", response_model=WalletPublicWithUser)
def read_wallet(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get wallet by ID.
    """
    wallet = session.get(app_Wallet, id)
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    if not current_user.is_superuser and (wallet.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return wallet


@router.post("/", response_model=WalletPublic)
def create_wallet(*, session: SessionDep, current_user: CurrentUser, item_in: WalletCreate) -> Any:
    """
    Create new wallet.
    """
    wallet = app_Wallet(
        user_id=current_user.id,
        name=item_in.name,
        currency=item_in.currency,
        balance=item_in.balance,
        description=item_in.description,
        created_at=datetime.now(timezone.utc).isoformat(),  # Store date in ISO format UTC
        updated_at=datetime.now(timezone.utc).isoformat(),  # Store date in ISO format UTC
    )
    session.add(wallet)
    session.commit()
    session.refresh(wallet)
    return wallet


@router.patch("/{id}", response_model=WalletPublic)
def update_wallet(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    item_in: WalletUpdate,
) -> Any:
    """
    Update a wallet.
    """
    wallet = session.get(app_Wallet, id)
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = item_in.model_dump(exclude_unset=True)
    # Update the updated_at field to the current time
    update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    wallet.sqlmodel_update(update_dict)
    session.add(wallet)
    session.commit()
    session.refresh(wallet)
    return wallet


@router.delete("/{id}")
def delete_wallet(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Message:
    """
    Delete a wallet.
    """
    wallet = session.get(app_Wallet, id)
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(wallet)
    session.commit()
    return Message(message="Wallet deleted successfully")
