import asyncio
import decimal
import logging, os
import time

from app.tasks import (
    delete_position_task,
)


from app.views.views_market import get_price_from_market, set_price
from app.views.views_wallet import async_calculate_total_wallet

logger = logging.getLogger("blockbuilders")

from django.core.paginator import Paginator
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import get_object_or_404, render, redirect

from django.contrib.auth.decorators import login_required

from app.models import (
    ContractCalculator,
    Position,
    Transaction,
    TransactionCalculator,
    UserSetting,
    Wallet,
)

from asgiref.sync import sync_to_async


@login_required
def positions(request):
    positions = Position.objects.all()
    context = {
        "positions": positions,
    }
    return render(request, "positions.html", context)


@login_required
def positions_paginated(request, page):

    user_setting = UserSetting.objects.filter(user=request.user).first()
    if user_setting and user_setting.show_positions_above_threshold:
        positions = Position.objects.filter(amount__gt=0.5).order_by("contract")
    else:
        positions = Position.objects.all().order_by("contract")

    logger.info("Number of positions found : " + str(positions.count()))
    logger.info("User Setting - show_positions_above_threshold : " + str(user_setting.show_positions_above_threshold))

    paginator = Paginator(positions, per_page=10)
    page_positions = paginator.get_page(page)
    page_positions.adjusted_elided_pages = paginator.get_elided_page_range(page)
    context = {
        "page_positions": page_positions,
        "user_setting": user_setting,
    }
    return render(request, "positions.html", context)


@login_required
def wallet_positions_paginated(request, wallet_id, page):
    wallet = Wallet.objects.filter(id=wallet_id).first()

    user_setting = UserSetting.objects.filter(user=request.user).first()
    if user_setting and user_setting.show_positions_above_threshold:
        positions = Position.objects.filter(wallet=wallet).filter(amount__gt=0.5).order_by("-amount")
    else:
        positions = Position.objects.filter(wallet=wallet).order_by("-amount")

    logger.info("Number of positions found : " + str(positions.count()))
    logger.info("User Setting - show_positions_above_threshold : " + str(user_setting.show_positions_above_threshold))

    positions_with_calculator = []
    for position in positions:
        calculator = ContractCalculator(position.contract)
        daily_price_delta = calculator.calculate_daily_price_delta()

        last_transaction = Transaction.objects.filter(position=position).order_by("-date").first()
        reference_avg_cost = (
            TransactionCalculator(last_transaction).calculate_avg_cost_contract_based()
            if last_transaction and last_transaction.running_quantity != 0
            else 0
        )
        total_unrealized_gain = (
            (position.contract.price - reference_avg_cost) / reference_avg_cost * 100 if reference_avg_cost != 0 else 0
        )

        positions_with_calculator.append(
            {
                "id": position.id,
                "wallet": position.wallet,
                "contract": position.contract,
                "quantity": position.quantity,
                "amount": position.amount,
                "avg_cost": position.avg_cost,
                "created_at": position.created_at,
                "daily_price_delta": daily_price_delta,
                "total_unrealized_gain": total_unrealized_gain,
            }
        )

    paginator = Paginator(positions_with_calculator, per_page=10)
    page_positions = paginator.get_page(page)
    page_positions.adjusted_elided_pages = paginator.get_elided_page_range(page)
    context = {
        "page_positions": page_positions,
        "wallet": wallet,
        "user_setting": user_setting,
    }
    return render(request, "positions.html", context)


@login_required
def delete_Position_by_id(request, position_id):
    result = delete_position_task.delay(position_id, 100)
    return redirect("wallets")


# todo : still needed ?
@login_required
def view_position(request, position_id):
    position = Position.objects.filter(id=position_id).first()
    transactions = Transaction.objects.filter(position=position).order_by("-date")

    template = loader.get_template("view_position.html")

    context = {
        "position": position,
        "transactions": transactions,
    }
    return HttpResponse(template.render(context, request))


async def refresh_position_price(request, position_id: int):
    # print("refresh_position_price for position " + str(position_id))
    logger.info("Refresh position price for : " + str(position_id))

    position = await async_get_position_by_id(position_id)

    start_time = time.time()
    symbol = await async_get_symbol_by_position(position)
    if symbol != "USDT/USDT":
        task = asyncio.create_task(get_price_from_market(symbol))
        await task

        print(f"Fetch total {symbol} urls and process takes {time.time() - start_time} seconds")

        await set_price(position.contract, task.result()[0])
        await calculate_position_amount(position)

    # await async_calculate_total_wallet(wallet_id)

    return redirect("wallets")


async def refresh_wallet_position_price(request, wallet_id):
    # print("refresh_wallet_position_price for wallet " + str(wallet_id))
    logger.info("Refresh wallet position price for : " + str(wallet_id))

    for position in await async_get_position_by_wallet_id(wallet_id):
        start_time = time.time()
        symbol = await async_get_symbol_by_position(position)
        if symbol != "USDT/USDT":
            task = asyncio.create_task(get_price_from_market(symbol))
            await task

            print(f"Fetch total {symbol} urls and process takes {time.time() - start_time} seconds")

            await set_price(position.contract, task.result()[0])

            # if previous_week is empty or before last week or previous_week_price is 0 -> we need to call the API
            # if previous_month is empty or before last month or previous_month_price is 0 -> we need to call the API

            await calculate_position_amount(position)

    await async_calculate_total_wallet(wallet_id)

    return redirect("wallets")


@sync_to_async
def async_get_symbol_by_position(position: Position):
    symbol = position.contract.symbol + "/USDT"
    return symbol


@sync_to_async
def async_get_position_by_id(position_id: int):
    position = get_object_or_404(Position, id=position_id)
    return position


@sync_to_async
def async_get_position_by_wallet_id(wallet_id: int):
    wallet = get_object_or_404(Wallet, id=wallet_id)
    positions = Position.objects.filter(wallet=wallet)
    positions_list = []
    for position in positions:
        positions_list.append(position)
    return positions_list


def get_Positions_by_Wallet(wallet):
    positions = Position.objects.filter(wallet=wallet)
    return positions


@sync_to_async
def calculate_position_amount(position):
    position.amount = decimal.Decimal(position.contract.price) * position.quantity
    position.save()
