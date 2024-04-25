import asyncio
import decimal
import logging, os
import time
from app.utils.polygon.models_polygon import Polygon_ERC20_Raw
from app.utils.polygon.view_polygon import (
    get_erc20_transactions_by_wallet,
    get_erc20_transactions_by_wallet_and_contract,
)
from app.utils.market_data import get_crypto_price
from app.utils.utils import find_between_strings
from app.tasks import (
    aggregate_transactions_task,
    calculate_cost_transaction_task,
    calculate_running_quantity_transaction_task,
    clean_transaction_task,
    create_erc20_process_task,
    create_transactions_from_erc20_task,
    delete_position_task,
    delete_wallet_task,
    get_erc20_transactions_by_wallet_task,
)

from celery.result import AsyncResult
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger("blockbuilders")

from django.db.models import Sum, Q
from django.core.paginator import Paginator
from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required

from app.forms import ContractForm, WalletForm
from app.models import Blockchain, Contract, Fiat, Position, Transaction, Wallet, Wallet_Process

from datetime import datetime

from aiohttp import ClientSession
from asgiref.sync import sync_to_async
from celery import chain

logger.info("Number of CPU : " + str(os.cpu_count()))


# Views
@login_required
def dashboard(request):
    context = {
        "empty": "dashboard",
    }
    return render(request, "dashboard.html", context)


@login_required
def profile(request):
    context = {
        "empty": "profile",
    }
    return render(request, "profile.html", context)


@login_required
def contracts(request):
    contracts = Contract.objects.all()[:20]
    context = {
        "contracts": contracts,
    }
    return render(request, "contracts.html", context)


@login_required
def contracts_paginated(request, page):
    contracts = Contract.objects.all().order_by("name")
    paginator = Paginator(contracts, per_page=10)
    page_contracts = paginator.get_page(page)
    page_contracts.adjusted_elided_pages = paginator.get_elided_page_range(page)
    context = {
        "page_contracts": page_contracts,
    }
    return render(request, "contracts.html", context)


@login_required
def wallets(request):
    if request.method == "POST":
        form = WalletForm(request.POST or None)

        if form.is_valid():
            address = form.cleaned_data["address"]
            name = form.cleaned_data["name"]
            user = request.user
            wallet = Wallet.objects.create(
                address=address.lower(),
                name=name,
                user=user,
            )
            wallet.save()

            wallets = Wallet.objects.all()

            logger.info("New wallet is created")

            wallet_process = Wallet_Process.objects.create(wallet=wallet)
            wallet_process.save()

            logger.info("New wallet process is created")

            context = {
                "wallets": wallets,
            }
            return render(request, "wallets.html", context)
    else:
        wallets = Wallet.objects.all()

        context = {
            "wallets": wallets,
        }
        return render(request, "wallets.html", context)


@login_required
def blockchains(request):
    blockchains = Blockchain.objects.all()
    context = {
        "blockchains": blockchains,
    }
    return render(request, "blockchains.html", context)


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


def get_Contract_by_address(contract_address):
    contract = Contract.objects.filter(address=contract_address).first()
    return contract


def get_Transactions_by_Wallet(wallet):
    positions = Position.objects.filter(wallet=wallet)
    transaction_result = []
    for position in positions:
        transactions = Transaction.objects.filter(position=position).order_by("-date")
        for transaction in transactions:
            transaction_result.append(transaction)
    return transaction_result


def get_Positions_by_Wallet(wallet):
    positions = Position.objects.filter(wallet=wallet)
    return positions


def get_Transactions_by_Position(position):
    transaction_result = []
    transactions = Transaction.objects.filter(position=position).order_by("date")
    for transaction in transactions:
        transaction_result.append(transaction)
    return transaction_result


def get_Polygon_ERC20_Raw_by_Wallet_address(wallet_address):
    result = Polygon_ERC20_Raw.objects.filter(
        Q(fromAddress=wallet_address) | Q(toAddress=wallet_address)
    )
    return result

@login_required 
def get_information_Wallet_by_id(request, wallet_id):
    wallet = get_object_or_404(Wallet, id=wallet_id)

    # Clean existing ERC20 transactions for this Wallet
    # todo : replace by get or update to optimize data queries
    erc20_existing = get_Polygon_ERC20_Raw_by_Wallet_address(wallet.address)
    erc20_existing.delete()

    chained_task = chain(
        get_erc20_transactions_by_wallet_task.s(wallet.address)
        | create_erc20_process_task.s()
    )
    result = chained_task.apply_async()

    wallet_process = Wallet_Process.objects.filter(wallet=wallet).first()
    wallet_process.download_task = result.id
    wallet_process.save()

    return redirect("wallets")

@csrf_exempt
def download_wallet_task_status(request, task_id):
    # logger.info("Download AsyncResult for : " + str(task_id))
    task_result = AsyncResult(str(task_id))
    # logger.info("Download task status : " + str(task_result.status))
    return JsonResponse({'status': task_result.status})

@csrf_exempt
def resync_wallet_task_status(request, task_id):
    # logger.info("Download AsyncResult for : " + str(task_id))
    task_result = AsyncResult(str(task_id))
    # logger.info("Download task status : " + str(task_result.status))
    return JsonResponse({'status': task_result.status})

@login_required
def resync_information_Wallet_by_id(request, wallet_id):
    # 0. Clean contracts addresses
    contracts = Contract.objects.all()
    for contract in contracts:
        contract.address = contract.address.lower()
        contract.save()

    chained_task = chain(
        clean_transaction_task.s(wallet_id)
        | create_transactions_from_erc20_task.s()
        | aggregate_transactions_task.s()
        | calculate_cost_transaction_task.s()
        | calculate_running_quantity_transaction_task.s()
    )
    result = chained_task.apply_async()

    wallet = get_object_or_404(Wallet, id=wallet_id)

    wallet_process = Wallet_Process.objects.filter(wallet=wallet).first()
    wallet_process.resync_task = result.id
    wallet_process.save()

    return redirect("wallets")


@login_required
def delete_Wallet_by_id(request, wallet_id):
    result = delete_wallet_task.delay(wallet_id, 100)
    return redirect("wallets")
    # return HttpResponse(f"Task triggered. Task ID: {result.id}")
    # return JsonResponse({'task_id': str(result)})


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
def view_wallet(request, wallet_id):
    wallet = Wallet.objects.filter(id=wallet_id).first()

    if request.method == "POST":
        form = ContractForm(request.POST or None)

        if form.is_valid():
            address = find_between_strings(form.cleaned_data["address"], "[", "]", 0)
            contract = Contract.objects.filter(address=address).first()
            position = Position.objects.create(
                contract=contract, wallet=wallet, is_active=True
            )
            position.save()

            positions = Position.objects.filter(wallet=wallet)
            contracts = Contract.objects.all()
            template = loader.get_template("view_wallet.html")

            logger.info("New position is added")

            transactions = get_erc20_transactions_by_wallet_and_contract(
                wallet.address, contract.address
            )
            for erc20 in transactions:
                divider = 10
                for x in range(1, int(erc20["tokenDecimal"])):
                    divider = divider * 10

                logger.info(erc20)
                logger.info(wallet.address)
                logger.info(erc20["from"])
                logger.info(erc20["to"])

                transactionType = "BUY"

                if erc20["from"].upper() == wallet.address.upper():
                    transactionType = "SEL"
                if erc20["to"].upper() == wallet.address.upper():
                    transactionType = "BUY"

                logger.info(transactionType)

                transaction = Transaction.objects.create(
                    position=position,
                    type=transactionType,
                    quantity=(int(erc20["value"]) / divider),
                    date=datetime.fromtimestamp(int(erc20["timeStamp"])),
                    comment="",
                    hash=erc20["hash"],
                )
                transaction.save()

            context = {
                "wallet": wallet,
                "positions": positions,
                "contracts": contracts,
            }
            return HttpResponse(template.render(context, request))
    else:
        wallet = Wallet.objects.filter(id=wallet_id).first()
        positions = Position.objects.filter(wallet=wallet)
        contracts = Contract.objects.all()
        template = loader.get_template("view_wallet.html")

        context = {
            "wallet": wallet,
            "positions": positions,
            "contracts": contracts,
        }
        return HttpResponse(template.render(context, request))


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


def register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password1")
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect("dashboard")
    else:
        form = UserCreationForm()
    return render(request, "registration/register.html", {"form": form})


@sync_to_async
def async_get_position_by_id(position_id : int):
    position = get_object_or_404(Position, id=position_id)
    return position


@sync_to_async
def async_get_position_by_wallet_id(wallet_id : int):
    wallet = get_object_or_404(Wallet, id=wallet_id)
    positions = Position.objects.filter(wallet=wallet)
    positions_list = []
    for position in positions:
        positions_list.append(position)
    return positions_list


@sync_to_async
def async_get_symbol_by_position(position : Position):
    symbol = position.contract.symbol + "/USDT"
    return symbol


@sync_to_async
def async_calculate_total_wallet(wallet_id : int):
    wallet = get_object_or_404(Wallet, id=wallet_id)
    balance = Wallet.objects.filter(id__exact=wallet_id).aggregate(
        Sum("wallet_positions__amount", default=0)
    )
    wallet.balance = balance["wallet_positions__amount__sum"]
    wallet.save()
    return wallet

async def refresh_position_price(request, position_id : int):
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
def set_price(contract, price):
    contract.price = price
    contract.save()


@sync_to_async
def calculate_position_amount(position):
    position.amount = decimal.Decimal(position.contract.price) * position.quantity
    position.save()


async def get_price_from_market(symbol):
    tasks = []
    async with ClientSession() as session:
        task = asyncio.ensure_future(get_crypto_price(symbol))
        tasks.append(task)
        responses = await asyncio.gather(*tasks)
    return responses
