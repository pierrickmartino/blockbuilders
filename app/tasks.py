import logging
import time
import decimal

from celery import shared_task
from django.shortcuts import get_object_or_404

from blockbuilders.settings.base import POLYGONSCAN_API_KEY
from polygonscan import PolygonScan

from app.models import Contract, Fiat, Position, Transaction, Wallet
from app.utils.polygon.models_polygon import Polygon_ERC20_Raw
from django.db.models import Q

from datetime import datetime

logger = logging.getLogger("blockbuilders")

@shared_task
def delete_wallet_task(wallet_id, sleep_duration):
    wallet = get_object_or_404(Wallet, id=wallet_id)
    result = wallet.delete()
    time.sleep(sleep_duration)
    return result

@shared_task
def delete_position_task(position_id, sleep_duration):
    position = get_object_or_404(Position, id=position_id)
    result = position.delete()
    time.sleep(sleep_duration)
    return result

@shared_task
def get_erc20_transactions_by_wallet_task(wallet_address):
    with PolygonScan(POLYGONSCAN_API_KEY, False) as matic:  # type: ignore
        result = matic.get_erc20_token_transfer_events_by_address(
            address=wallet_address,
            startblock=0,
            endblock=99999999,
            sort="asc",
        )
        return result

@shared_task
def create_erc20_process_task(erc20_list):
    for erc20 in erc20_list:
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

@shared_task
def create_transactions_from_erc20_task(wallet):
    erc20_list = Polygon_ERC20_Raw.objects.filter(
        Q(fromAddress=wallet.address) | Q(toAddress=wallet.address)
    )
    logger.info("Transactions trouvées : " + str(erc20_list.count))

    fiat_USD = get_object_or_404(Fiat, code="USD")
    
    for erc20 in erc20_list:
        logger.info("Process " + erc20.hash)
        transactionType = "IN"
        if erc20.fromAddress == wallet.address:
            transactionType = "OUT"
        if erc20.toAddress == wallet.address:
            transactionType = "IN"

        divider = 10
        for x in range(1, int(erc20.tokenDecimal)):
            divider = divider * 10

        try:
            contract = Contract.objects.filter(address=erc20.contractAddress).get()

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
    
    return wallet


@shared_task
def aggregate_transactions_task(wallet):
    # 5. Aggregate transactions when not 1 vs 1
    positions = Position.objects.filter(wallet=wallet)
    transactions_by_wallet_to_aggregate = []
    for position in positions:
        transactions = Transaction.objects.filter(position=position).order_by("-date")
        for transaction in transactions:
            transactions_by_wallet_to_aggregate.append(transaction)

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

            transactions_to_aggregate = Transaction.objects.filter(
                hash=transaction.hash
            ).filter(position=transaction.position)
            quantity_agg = 0
            for t_agg in transactions_to_aggregate:
                logger.info(t_agg)
                quantity_agg += (
                    t_agg.quantity if t_agg.type == "IN" else t_agg.quantity * -1
                )
                t_agg.delete()

            transaction_agg.type = "IN" if quantity_agg > 0 else "OUT"
            transaction_agg.quantity = abs(quantity_agg)
            logger.info(transaction_agg)
            transaction_agg.save()
    
    return wallet

@shared_task
def calculate_cost_transaction_task(wallet):
    # 6. Retrieve the contract against the transaction to calculate cost
    positions = Position.objects.filter(wallet=wallet)
    transactions_by_wallet = []
    for position in positions:
        transactions = Transaction.objects.filter(position=position).order_by("-date")
        for transaction in transactions:
            transactions_by_wallet.append(transaction)
    
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
    
    return wallet

@shared_task
def clean_transaction_task(wallet):
    # 1. Clean existing information
    try:
        positions = Position.objects.filter(wallet=wallet)
        for position in positions:
            position = get_object_or_404(Position, id=position.id)
            result = position.delete()
            logger.info("Positions are now clean")
    except Position.DoesNotExist:
            logger.info("Object Position does not exist for : " + wallet.id)

    return wallet

@shared_task
def calculate_running_quantity_transaction_task(wallet):
    # 7. Calculate the running quantity for each position
    positions_by_Wallet = Position.objects.filter(wallet=wallet)
    logger.info("Running Quantity and Perf information calculation")

    for position in positions_by_Wallet:
        logger.info(position)
        transactions_by_Position = []
        transactions = Transaction.objects.filter(position=position).order_by("date")
        for transaction in transactions:
            transactions_by_Position.append(transaction)
        running_quantity, buy_quantity, sell_quantity, total_cost, avg_cost = (
            0,
            0,
            0,
            0,
            0,
        )

        for transaction in transactions_by_Position:
            capital_gain, capital_gain_perc = 0, 0

            logger.info(transaction)
            logger.info("running_quantity prev.:" + str(running_quantity))
            logger.info(
                "transaction.cost_contract_based:"
                + str(transaction.cost_contract_based)
            )

            if transaction.type == "IN":
                if (running_quantity * transaction.cost_contract_based) < 1:
                    total_cost = transaction.cost_contract_based
                    buy_quantity = transaction.quantity
                else:
                    total_cost += transaction.cost_contract_based
                    buy_quantity += transaction.quantity

            running_quantity += (
                transaction.quantity
                if transaction.type == "IN"
                else transaction.quantity * -1
            )
            sell_quantity += transaction.quantity if transaction.type == "OUT" else 0
            avg_cost = total_cost / buy_quantity

            if transaction.type == "OUT" and avg_cost != 0:
                capital_gain = (
                    transaction.cost_contract_based - transaction.quantity * avg_cost
                )
                capital_gain_perc = (
                    (transaction.price_contract_based - avg_cost)
                    / avg_cost
                    * decimal.Decimal(100)
                )

            logger.info("running_quantity:" + str(running_quantity))
            logger.info("buy_quantity:" + str(buy_quantity))
            logger.info("sell_quantity:" + str(sell_quantity))
            logger.info("total_cost:" + str(total_cost))
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
