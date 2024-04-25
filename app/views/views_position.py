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
    Position,
    Transaction,
    Wallet,
)

from asgiref.sync import sync_to_async


logger.info("Number of CPU : " + str(os.cpu_count()))


@login_required
def positions(request):
    positions = Position.objects.all()
    context = {
        "positions": positions,
    }
    return render(request, "positions.html", context)


@login_required
def positions_paginated(request, page):
    positions = Position.objects.all().order_by("contract")
    paginator = Paginator(positions, per_page=10)
    page_positions = paginator.get_page(page)
    page_positions.adjusted_elided_pages = paginator.get_elided_page_range(page)
    context = {
        "page_positions": page_positions,
    }
    return render(request, "positions.html", context)


@login_required
def wallet_positions_paginated(request, wallet_id, page):
    wallet = Wallet.objects.filter(id=wallet_id).first()
    positions = Position.objects.filter(wallet=wallet).order_by("-amount")
    paginator = Paginator(positions, per_page=10)
    page_positions = paginator.get_page(page)
    page_positions.adjusted_elided_pages = paginator.get_elided_page_range(page)
    context = {
        "page_positions": page_positions,
        "wallet": wallet,
    }
    return render(request, "positions.html", context)


@login_required
def delete_Position_by_id(request, position_id):
    result = delete_position_task.delay(position_id, 100)
    return redirect("wallets")


# todo : still needed ?
@login_required
def enable_Position_by_id(request, position_id):
    position = get_object_or_404(Position, id=position_id)
    position.mark_as_active()
    wallet = position.wallet
    return redirect("wallet", wallet_id=wallet.id)


# todo : still needed ?
@login_required
def disable_Position_by_id(request, position_id):
    position = get_object_or_404(Position, id=position_id)
    position.mark_as_inactive()
    wallet = position.wallet
    return redirect("wallet", wallet_id=wallet.id)


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
    print("refresh_position_price for position " + str(position_id))

    position = await async_get_position_by_id(position_id)

    start_time = time.time()
    symbol = await async_get_symbol_by_position(position)
    if symbol != "USDT/USDT":
        task = asyncio.create_task(get_price_from_market(symbol))
        await task

        print(
            f"Fetch total {symbol} urls and process takes {time.time() - start_time} seconds"
        )

        await set_price(position.contract, task.result()[0])
        await calculate_position_amount(position)

    # await async_calculate_total_wallet(wallet_id)

    return redirect("wallets")


async def refresh_wallet_position_price(request, wallet_id):
    print("refresh_wallet_position_price for wallet " + str(wallet_id))

    for position in await async_get_position_by_wallet_id(wallet_id):
        start_time = time.time()
        symbol = await async_get_symbol_by_position(position)
        if symbol != "USDT/USDT":
            task = asyncio.create_task(get_price_from_market(symbol))
            await task

            print(
                f"Fetch total {symbol} urls and process takes {time.time() - start_time} seconds"
            )

            await set_price(position.contract, task.result()[0])
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
