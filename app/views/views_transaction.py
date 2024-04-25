import logging, os

logger = logging.getLogger("blockbuilders")

from django.core.paginator import Paginator
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from app.models import (
    Contract,
    Position,
    Transaction,
    Wallet,
)


@login_required
def transactions(request):
    transactions = Transaction.objects.all()
    context = {
        "transactions": transactions,
    }
    return render(request, "transactions.html", context)


@login_required
def transactions_paginated(request, page):
    transactions = Transaction.objects.all().order_by("-date")
    paginator = Paginator(transactions, per_page=10)
    page_transactions = paginator.get_page(page)
    page_transactions.adjusted_elided_pages = paginator.get_elided_page_range(page)
    context = {
        "page_transactions": page_transactions,
    }
    return render(request, "transactions.html", context)


@login_required
def position_transactions_paginated(request, position_id, page):
    position = Position.objects.filter(id=position_id).first()
    contract = Contract.objects.filter(id=position.contract.id).first()
    wallet = Wallet.objects.filter(id=position.wallet.id).first()
    transactions = Transaction.objects.filter(position=position).order_by("-date")
    paginator = Paginator(transactions, per_page=10)
    page_transactions = paginator.get_page(page)
    page_transactions.adjusted_elided_pages = paginator.get_elided_page_range(page)

    reference_avg_cost = transactions.first().avg_cost_contract_based
    performance = (contract.price - reference_avg_cost) / reference_avg_cost * 100

    context = {
        "page_transactions": page_transactions,
        "position": position,
        "wallet": wallet,
        "contract": contract,
        "performance": performance,
    }
    return render(request, "transactions.html", context)


def get_Transactions_by_Wallet(wallet):
    positions = Position.objects.filter(wallet=wallet)
    transaction_result = []
    for position in positions:
        transactions = Transaction.objects.filter(position=position).order_by("-date")
        for transaction in transactions:
            transaction_result.append(transaction)
    return transaction_result


def get_Transactions_by_Position(position):
    transaction_result = []
    transactions = Transaction.objects.filter(position=position).order_by("date")
    for transaction in transactions:
        transaction_result.append(transaction)
    return transaction_result
