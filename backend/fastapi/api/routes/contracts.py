import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from api.deps import CurrentUser, SessionDep
from models import ContractsPublic, app_Contract, ContractPublic, ContractCreate, ContractUpdate, Message, ContractExtendedPublicWithBlockchain

router = APIRouter(prefix="/contracts", tags=["contracts"])


@router.get("/", response_model=ContractsPublic)
def read_contracts(session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve contract information.
    """

    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(app_Contract)
        count = session.exec(count_statement).one()
        statement = select(app_Contract).offset(skip).limit(limit)
        contracts = session.exec(statement).all()
    else:
        count_statement = select(func.count()).select_from(app_Contract)
        count = session.exec(count_statement).one()
        statement = select(app_Contract).offset(skip).limit(limit)
        contracts = session.exec(statement).all()

    return ContractsPublic(data=contracts, count=count)


@router.get("/{id}", response_model=ContractExtendedPublicWithBlockchain)
def read_contract(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get contract by ID.
    """
    contract = session.get(app_Contract, id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    if not current_user.is_superuser and (contract.user_id != current_user.id):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return contract


@router.post("/", response_model=ContractPublic)
def create_contract(*, session: SessionDep, current_user: CurrentUser, item_in: ContractCreate) -> Any:
    """
    Create new contract.
    """
    contract = app_Contract(
        user_id=current_user.id,
        name=item_in.name,
        currency=item_in.currency,
        balance=item_in.balance,
        description=item_in.description,
        created_at=datetime.now(timezone.utc).isoformat(),  # Store date in ISO format UTC
        updated_at=datetime.now(timezone.utc).isoformat(),  # Store date in ISO format UTC
    )
    session.add(contract)
    session.commit()
    session.refresh(contract)
    return contract


@router.patch("/{id}", response_model=ContractPublic)
def update_contract(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    item_in: ContractUpdate,
) -> Any:
    """
    Update a contract.
    """
    contract = session.get(app_Contract, id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = item_in.model_dump(exclude_unset=True)
    # Update the updated_at field to the current time
    update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    contract.sqlmodel_update(update_dict)
    session.add(contract)
    session.commit()
    session.refresh(contract)
    return contract


@router.delete("/{id}")
def delete_contract(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Message:
    """
    Delete a contract.
    """
    contract = session.get(app_Contract, id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(contract)
    session.commit()
    return Message(message="Contract deleted successfully")
