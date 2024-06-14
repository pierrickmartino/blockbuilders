import logging, os

logger = logging.getLogger("blockbuilders")

from django.core.paginator import Paginator
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from app.models import (
    Contract,
    Position,
    PositionCalculator,
    Transaction,
    TransactionCalculator,
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
    position_calculator = PositionCalculator(position)
    position_amount = position_calculator.calculate_amount()

    # Calculate the average cost for each transaction
    transactions_with_calculator = []
    total_realized_gain = 0
    for transaction in transactions:
        calculator = TransactionCalculator(transaction)
        avg_cost_contract_based = calculator.calculate_avg_cost_contract_based()
        cost_contract_based = calculator.calculate_cost_contract_based()
        capital_gain_contract_based = calculator.calculate_capital_gain_contract_based()

        total_realized_gain += capital_gain_contract_based

        transactions_with_calculator.append(
            {
                "type": transaction.type,
                "quantity": transaction.quantity,
                "running_quantity": transaction.running_quantity,
                "price_contract_based": transaction.price_contract_based,
                "cost_contract_based": cost_contract_based,
                "against_contract": transaction.against_contract,
                "total_cost_contract_based": transaction.total_cost_contract_based,
                "capital_gain_contract_based": capital_gain_contract_based,
                "date": transaction.date,
                "avg_cost_contract_based": avg_cost_contract_based,
            }
        )

    paginator = Paginator(transactions_with_calculator, per_page=20)
    page_transactions = paginator.get_page(page)
    page_transactions.adjusted_elided_pages = paginator.get_elided_page_range(page)

    reference_avg_cost = TransactionCalculator(transactions.first()).calculate_avg_cost_contract_based()
    total_unrealized_gain = (
        (contract.price - reference_avg_cost) / reference_avg_cost * 100
        if transactions.first().running_quantity != 0
        else 0
    )

    # logger.info(f"Performance information :  {total_unrealized_gain} /  {total_realized_gain}")

    context = {
        "page_transactions": page_transactions,
        "position": position,
        "wallet": wallet,
        "contract": contract,
        "total_unrealized_gain": total_unrealized_gain,
        "total_realized_gain": total_realized_gain,
        "position_amount": position_amount,
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
