import csv
from datetime import datetime
import logging, os

from django.http import HttpResponse

logger = logging.getLogger("blockbuilders")

from django.core.paginator import Paginator
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from app.models import (
    Contract,
    ContractCalculator,
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
def export_transactions_csv(request, position_id):
    # Generate the current timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"transactions_{timestamp}.csv"

    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'

    writer = csv.writer(response)
    writer.writerow(
        [
            "id",
            "type",
            "date",
            "quantity",
            "comment",
            "hash",
            "price",
            "price_contract_based",
            "price_fiat_based",
            "running_quantity",
            "buy_quantity",
            "sell_quantity",
            "total_cost",
            "total_cost_contract_based",
            "total_cost_fiat_based",
        ]
    )

    position = Position.objects.filter(id=position_id).first()
    transactions = (
        Transaction.objects.filter(position=position)
        .order_by("-date")
        .values_list(
            "id",
            "type",
            "date",
            "quantity",
            "comment",
            "hash",
            "price",
            "price_contract_based",
            "price_fiat_based",
            "running_quantity",
            "buy_quantity",
            "sell_quantity",
            "total_cost",
            "total_cost_contract_based",
            "total_cost_fiat_based",
        )
    )
    for transaction in transactions:
        writer.writerow(transaction)

    return response


@login_required
def position_transactions_paginated(request, position_id, page):
    position = Position.objects.filter(id=position_id).first()
    contract = Contract.objects.filter(id=position.contract.id).first()
    wallet = Wallet.objects.filter(id=position.wallet.id).first()
    transactions = Transaction.objects.filter(position=position).order_by("-date")
    position_calculator = PositionCalculator(position)
    position_amount = position_calculator.calculate_amount()

    contract_calculator = ContractCalculator(position.contract)
    daily_price_delta = contract_calculator.calculate_daily_price_delta()
    weekly_price_delta = contract_calculator.calculate_weekly_price_delta()
    monthly_price_delta = contract_calculator.calculate_monthly_price_delta()

    position_kpi = {
        "daily_price_delta": daily_price_delta,
        "weekly_price_delta": weekly_price_delta,
        "monthly_price_delta": monthly_price_delta,
    }

    # Calculate the average cost for each transaction
    transactions_with_calculator = []
    total_realized_gain = 0
    for transaction in transactions:
        calculator = TransactionCalculator(transaction)
        avg_cost = calculator.calculate_avg_cost()
        cost = calculator.calculate_cost()
        capital_gain = calculator.calculate_capital_gain()

        total_realized_gain += capital_gain

        transaction_link = transaction.position.contract.blockchain.transaction_link + transaction.hash

        transactions_with_calculator.append(
            {
                "type": transaction.type,
                "quantity": transaction.quantity,
                "running_quantity": transaction.running_quantity,
                "price": transaction.price,
                "cost": cost,
                "against_contract": transaction.against_contract,
                "total_cost": transaction.total_cost,
                "capital_gain": capital_gain,
                "date": transaction.date,
                "avg_cost": avg_cost,
                "link": transaction_link,
            }
        )

    paginator = Paginator(transactions_with_calculator, per_page=20)
    page_transactions = paginator.get_page(page)
    page_transactions.adjusted_elided_pages = paginator.get_elided_page_range(page)

    reference_avg_cost = (
        TransactionCalculator(transactions.first()).calculate_avg_cost() if transactions else 0
    )
    total_unrealized_gain = (
        (
            (contract.price - reference_avg_cost) / reference_avg_cost * 100
            if round(contract.price * transactions.first().running_quantity, 2) > 0 and reference_avg_cost != 0
            else 0
        )
        if transactions
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
        "position_kpi": position_kpi,
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
