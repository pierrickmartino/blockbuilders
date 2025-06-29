import csv
from datetime import datetime
import logging, os

from django.http import HttpResponse

import pandas as pd
import pandas_ta as ta

import plotly.graph_objects as go

logger = logging.getLogger("blockbuilders")

from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from datetime import datetime, timedelta

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from app.models import (
    Contract,
    ContractCalculator,
    MarketData,
    Position,
    PositionCalculator,
    Transaction,
    TransactionCalculator,
    User,
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


# @login_required
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
            "against_contract",
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
        .order_by("date")
        .values_list(
            "id",
            "type",
            "date",
            "quantity",
            "comment",
            "hash",
            "price",
            "price_contract_based",
            "against_contract",
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

@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this view
def export_all_transactions_csv(request):

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
            "against_contract",
            "price_fiat_based",
            "running_quantity",
            "buy_quantity",
            "sell_quantity",
            "total_cost",
            "total_cost_contract_based",
            "total_cost_fiat_based",
            "average_cost",
            "average_cost_contract_based",
            "average_cost_fiat_based",
            "capital_gain",
            "running_capital_gain",
            "position__contract__symbol",
            "position__contract__name",
            "position__wallet__name",
            "position__contract__category",
            "position__contract__blockchain__name",
        ]
    )

    # Get the wallets owned by the user
    user = get_object_or_404(User, id=request.user.id)
    wallets = Wallet.objects.filter(user=user)
    if not wallets:
        logger.warning("No wallets found for the user.")
        return HttpResponse({"status": "No wallets found for the user."}, status=404)
    # Collect all the positions from all wallets
    positions = Position.objects.filter(wallet__in=wallets)
    if not positions:
        logger.warning("No positions found for the user's wallets.")
        return HttpResponse({"status": "No positions found for the user's wallets."}, status=404)
    
    # Collect all transactions from the positions
    transactions = (
        Transaction.objects.filter(position__in=positions)
        .order_by("date")
        .values_list(
            "id",
            "type",
            "date",
            "quantity",
            "comment",
            "hash",
            "price",
            "price_contract_based",
            "against_contract",
            "price_fiat_based",
            "running_quantity",
            "buy_quantity",
            "sell_quantity",
            "total_cost",
            "total_cost_contract_based",
            "total_cost_fiat_based",
            "average_cost",
            "average_cost_contract_based",
            "average_cost_fiat_based",
            "capital_gain",
            "running_capital_gain",
            "position__contract__symbol",
            "position__contract__name",
            "position__wallet__name",
            "position__contract__category",
            "position__contract__blockchain__name",
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

    symbol_for_plot = contract.symbol.replace("WETH", "ETH")

    delta = 360
    days_ago = timezone.now().date() - timedelta(days=delta)
    market_data = MarketData.objects.filter(symbol=symbol_for_plot, reference="USD", time__gte=days_ago).order_by(
        "time"
    )
    stock_data = []
    for data in market_data:
        stock_data.append(
            {
                "timestamp": data.time,
                "open": float(data.open),
                "high": float(data.high),
                "low": float(data.low),
                "close": float(data.close),
                "volume": int(data.volume_to),
            }
        )

    # Create the candlestick chart
    df = pd.DataFrame(stock_data)
    # df.set_index("timestamp", inplace=True)

    if not df.empty:
        # Calculate Moving Averages
        df["EMA20"] = ta.ema(df["close"], length=20)
        df["EMA50"] = ta.ema(df["close"], length=50)

        # Calculate RSI
        df["RSI"] = ta.rsi(df["close"], length=14)

        fig = go.Figure(
            data=[
                go.Candlestick(
                    x=df["timestamp"],
                    open=df["open"],
                    high=df["high"],
                    low=df["low"],
                    close=df["close"],
                    increasing_line_color="#00bcd4",
                    decreasing_line_color="#ff9800",
                    line_width=1,
                ),
            ]
        )

        # Add EMA20 line to the chart
        fig.add_trace(
            go.Scatter(
                x=df["timestamp"],
                y=df["EMA20"],
                mode="lines",
                name="EMA 20",
                line=dict(color="blue", width=2),  # Customize the line color and width
            )
        )

        # Add EMA50 line to the chart
        fig.add_trace(
            go.Scatter(
                x=df["timestamp"],
                y=df["EMA50"],
                mode="lines",
                name="EMA 50",
                line=dict(color="red", width=2),  # Customize the line color and width
            )
        )

        # Adjust the layout for the figure
        fig.update_layout(
            height=575,  # Set the height of the chart
            xaxis_rangeslider_visible=False,
            plot_bgcolor="#ffffff",
            xaxis=dict(
                showgrid=True,  # Show grid lines for x-axis
                gridcolor="#e6e6e8",  # Set grid line color
            ),
            yaxis=dict(
                showgrid=True,  # Show grid lines for y-axis
                gridcolor="#e6e6e8",  # Set grid line color
                # type='log',  # Set y-axis to logarithmic scale
            ),
        )

        # Convert the figure to HTML
        chart_plotly = fig.to_html(full_html=False)
    else:
        chart_plotly = None

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
        average_cost = calculator.calculate_average_cost()
        cost = calculator.calculate_cost()
        cost_fiat_based = calculator.calculate_cost_fiat_based()
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
                "cost_fiat_based": cost_fiat_based,
                "against_contract": transaction.against_contract,
                "against_fiat": transaction.against_fiat,
                "total_cost": transaction.total_cost,
                "capital_gain": capital_gain,
                "date": transaction.date,
                "avg_cost": average_cost,
                "link": transaction_link,
            }
        )

    paginator = Paginator(transactions_with_calculator, per_page=20)
    page_transactions = paginator.get_page(page)
    page_transactions.adjusted_elided_pages = paginator.get_elided_page_range(page)

    reference_average_cost = (
        TransactionCalculator(transactions.first()).calculate_average_cost() if transactions else 0
    )
    total_unrealized_gain = (
        (
            (contract.price - reference_average_cost) / reference_average_cost * 100
            if round(contract.price * transactions.first().running_quantity, 2) > 0 and reference_average_cost != 0
            else 0
        )
        if transactions
        else 0
    )

    context = {
        "page_transactions": page_transactions,
        "position": position,
        "wallet": wallet,
        "contract": contract,
        "total_unrealized_gain": total_unrealized_gain,
        "total_realized_gain": total_realized_gain,
        "position_amount": position_amount,
        "position_kpi": position_kpi,
        "chart_plotly": chart_plotly,
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this view
def count_transactions(request):
     # Count transactions only for wallets owned by the authenticated user
    counter = Transaction.objects.filter(position__wallet__user=request.user).count()
    return Response({"counter": counter})
