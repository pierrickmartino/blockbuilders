import decimal
import logging, os
from app.utils.polygon.models_polygon import Polygon_ERC20_Raw
from app.utils.polygon.view_polygon import (
    get_erc20_transactions_by_wallet,
    get_erc20_transactions_by_wallet_and_contract,
)
from app.utils.utils import find_between_strings

logger = logging.getLogger("blockbuilders")

from django.db.models import Count, Q
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required

from app.forms import ContractForm, WalletForm
from app.models import Blockchain, Contract, Fiat, Position, Transaction, Wallet

from datetime import datetime

logger.info("Number of CPU : " + str(os.cpu_count()))


# Views
@login_required
def home(request):
    if request.method == "POST":
        form = WalletForm(request.POST or None)

        if form.is_valid():
            address = form.cleaned_data["address"]
            user = request.user
            wallet = Wallet.objects.create(
                address=address,
                user=user,
            )
            wallet.save()

            wallets = Wallet.objects.all()
            blockchains = Blockchain.objects.all()

            logger.info("New wallet is added")

            context = {
                "wallets": wallets,
                "blockchains": blockchains,
            }
            return render(request, "home.html", context)
    else:
        wallets = Wallet.objects.all()
        blockchains = Blockchain.objects.all()

        context = {
            "wallets": wallets,
            "blockchains": blockchains,
        }
        return render(request, "home.html", context)


def get_Contract_by_address(contract_address):
    contract = Contract.objects.filter(address=contract_address).get()
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
    result = get_erc20_transactions_by_wallet(wallet.address)

    # Clean existing ERC20 transactions for this Wallet
    # todo : replace by get or update to optimize data queries
    erc20_existing = get_Polygon_ERC20_Raw_by_Wallet_address(wallet.address)
    erc20_existing.delete()

    for erc20 in result:
        divider = 10
        for x in range(1, int(erc20["tokenDecimal"])):
            divider = divider * 10

        erc20_raw = Polygon_ERC20_Raw.objects.create(
            blockNumber=erc20["blockNumber"],
            timeStamp=erc20["timeStamp"],
            hash=erc20["hash"],
            nonce=erc20["nonce"],
            blockHash=erc20["blockHash"],
            fromAddress=erc20["from"],
            toAddress=erc20["to"],
            contractAddress=erc20["contractAddress"],
            value=erc20["value"],
            tokenName=erc20["tokenName"],
            tokenDecimal=erc20["tokenDecimal"],
            transactionIndex=erc20["transactionIndex"],
            gas=erc20["gas"],
            gasPrice=erc20["gasPrice"],
            gasUsed=erc20["gasUsed"],
            cumulativeGasUsed=erc20["cumulativeGasUsed"],
            input=erc20["input"],
            confirmations=erc20["confirmations"],
        )
        erc20_raw.save()

    return redirect("home")


@login_required
def resync_information_Wallet_by_id(request, wallet_id):
    logger.info("Resync wallet " + str(wallet_id))

    wallet = get_object_or_404(Wallet, id=wallet_id)
    erc20_list = get_Polygon_ERC20_Raw_by_Wallet_address(wallet.address)
    fiat_USD = get_object_or_404(Fiat, code="USD")

    logger.info("Ready to sync " + str(len(erc20_list)) + " transactions ERC20")

    positions = Position.objects.filter(wallet=wallet)

    # 0. Clean contracts addresses
    contracts = Contract.objects.all()
    for contract in contracts:
        contract.address = contract.address.lower()
        contract.save()

    # 1. Clean existing information
    for position in positions:
        delete_Position_by_id(request, position.id)

    # 2. Map existing contract list with erc20 transaction data and create Position
    for erc20 in erc20_list:
        logger.info("Process " + erc20.hash)
        transactionType = "BUY"
        if erc20.fromAddress == wallet.address:
            transactionType = "SEL"
        if erc20.toAddress == wallet.address:
            transactionType = "BUY"

        divider = 10
        for x in range(1, int(erc20.tokenDecimal)):
            divider = divider * 10

        try:
            contract = get_Contract_by_address(erc20.contractAddress)

            # 3. Create the position
            position, position_created = Position.objects.get_or_create(
                contract=contract,
                wallet=wallet,
                is_active=True,
            )
            position.save()

            # 4. Create the transaction
            transaction = Transaction.objects.create(
                position=position,
                type=transactionType,
                date=datetime.fromtimestamp(int(erc20.timeStamp)),
                hash=erc20.hash,
                quantity=(int(erc20.value) / divider),
                against_fiat=fiat_USD,
            )
            transaction.save()

        except Contract.DoesNotExist:
            logger.info("Object does not exist : " + erc20.contractAddress)

    # 5. Aggregate transactions when not 1 vs 1
    transactions_by_wallet_to_aggregate = get_Transactions_by_Wallet(wallet)
    for transaction in transactions_by_wallet_to_aggregate:
        condition = Transaction.objects.filter(hash=transaction.hash)
        if condition.count() > 2:
            logger.info("Transaction > 2")
            
            transaction_agg = Transaction.objects.create(
                position=transaction.position,
                date=transaction.date,
                hash=transaction.hash,
                against_fiat=transaction.against_fiat,
            )
            
            transactions_to_aggregate = Transaction.objects.filter(hash=transaction.hash).filter(position=transaction.position)
            quantity_agg = 0
            for t_agg in transactions_to_aggregate:
                logger.info(t_agg)
                quantity_agg += t_agg.quantity if t_agg.type == "BUY" else t_agg.quantity * -1
                t_agg.delete()

            transaction_agg.type = "BUY" if quantity_agg > 0 else "SEL"
            transaction_agg.quantity = abs(quantity_agg)
            logger.info(transaction_agg)
            transaction_agg.save()

    # 6. Retrieve the contract against the transaction to calculate cost
    transactions_by_wallet = get_Transactions_by_Wallet(wallet)
    for transaction in transactions_by_wallet:
        condition = Transaction.objects.filter(hash=transaction.hash)
        if condition.count() == 2:
            logger.info("Transaction = 2")
            transaction_ref = Transaction.objects.filter(hash=transaction.hash).exclude(id=transaction.id)  # type: ignore
            position = Position.objects.get(id=transaction_ref[0].position.id)
            transaction.against_contract = position.contract
            transaction.cost_contract_based = transaction_ref[0].quantity
            if transaction.quantity == 0:
                transaction.price_contract_based = 0  # type: ignore
            else:
                transaction.price_contract_based = (
                    transaction_ref[0].quantity / transaction.quantity
                )
            transaction.save()

    # 7. Calculate the running quantity for each position
    positions_by_Wallet = get_Positions_by_Wallet(wallet)
    logger.info("Running Quantity and Perf information calculation")
    
    for position in positions_by_Wallet:
        logger.info(position)
        transactions_by_Position = get_Transactions_by_Position(position)
        running_quantity, buy_quantity, sell_quantity, total_cost, avg_cost = 0, 0, 0, 0, 0

        for transaction in transactions_by_Position:
            capital_gain, capital_gain_perc = 0, 0

            logger.info(transaction)
            logger.info("running_quantity prev.:" + str(running_quantity))
            logger.info("transaction.cost_contract_based:" + str(transaction.cost_contract_based))

            if transaction.type == "BUY":
                if (running_quantity * transaction.cost_contract_based) < 1:
                    total_cost = transaction.cost_contract_based
                    buy_quantity = transaction.quantity
                else: 
                    total_cost += transaction.cost_contract_based
                    buy_quantity += transaction.quantity
            

            running_quantity += transaction.quantity if transaction.type == "BUY" else transaction.quantity * -1
            sell_quantity += transaction.quantity if transaction.type == "SEL" else 0
            avg_cost = total_cost / buy_quantity

            if transaction.type == "SEL" and avg_cost != 0:
                capital_gain = transaction.cost_contract_based - transaction.quantity * avg_cost
                capital_gain_perc = (transaction.price_contract_based - avg_cost) / avg_cost * decimal.Decimal(100)

            logger.info("running_quantity:" + str(running_quantity))
            logger.info("buy_quantity:" + str(buy_quantity))
            logger.info("sell_quantity:" + str(sell_quantity))
            logger.info("total_cost:" +  str(total_cost))
            logger.info("avg_cost:" + str(avg_cost))
            logger.info("capital_gain:" + str(capital_gain))
            logger.info("capital_gain_perc:" + str(capital_gain_perc))

            transaction.running_quantity = running_quantity
            transaction.buy_quantity = buy_quantity
            transaction.sell_quantity = sell_quantity
            transaction.total_cost_contract_based = total_cost
            transaction.avg_cost_contract_based = avg_cost
            transaction.capital_gain_contract_based = capital_gain
            transaction.capital_gain_percentage_contract_based = capital_gain_perc

            transaction.save()
            
        position.quantity = running_quantity
        position.save()

    return redirect("home")


@login_required
def delete_Wallet_by_id(request, wallet_id):
    wallet = get_object_or_404(Wallet, id=wallet_id)
    wallet.delete()
    return redirect("home")


@login_required
def delete_Position_by_id(request, position_id):
    position = get_object_or_404(Position, id=position_id)
    wallet = position.wallet
    position.delete()
    return redirect("wallet", wallet_id=wallet.id)


@login_required
def enable_Position_by_id(request, position_id):
    position = get_object_or_404(Position, id=position_id)
    position.mark_as_active()
    wallet = position.wallet
    return redirect("wallet", wallet_id=wallet.id)


@login_required
def disable_Position_by_id(request, position_id):
    position = get_object_or_404(Position, id=position_id)
    position.mark_as_inactive()
    wallet = position.wallet
    return redirect("wallet", wallet_id=wallet.id)


@login_required
def view_wallet(request, wallet_id):
    wallet = Wallet.objects.get(id=wallet_id)

    if request.method == "POST":
        form = ContractForm(request.POST or None)

        if form.is_valid():
            address = find_between_strings(form.cleaned_data["address"], "[", "]", 0)
            contract = Contract.objects.get(address=address)
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
        wallet = Wallet.objects.get(id=wallet_id)
        positions = Position.objects.filter(wallet=wallet)
        contracts = Contract.objects.all()
        template = loader.get_template("view_wallet.html")

        context = {
            "wallet": wallet,
            "positions": positions,
            "contracts": contracts,
        }
        return HttpResponse(template.render(context, request))


@login_required
def view_position(request, position_id):
    position = Position.objects.get(id=position_id)
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
            return redirect("home")
    else:
        form = UserCreationForm()
    return render(request, "registration/register.html", {"form": form})
