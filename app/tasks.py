import logging
import time

from celery import shared_task
from django.shortcuts import get_object_or_404

from app.utils.polygon.view_polygon import get_erc20_transactions_by_wallet
from blockbuilders.settings.base import POLYGONSCAN_API_KEY
from polygonscan import PolygonScan

from app.models import Contract, Position, Transaction, TransactionCalculator, TypeTransactionChoices, Wallet

from datetime import datetime

logger = logging.getLogger("blockbuilders")


@shared_task
def delete_wallet_task(wallet_id, sleep_duration: float):
    wallet = get_object_or_404(Wallet, id=wallet_id)
    result = wallet.delete()
    time.sleep(sleep_duration)
    return result


@shared_task
def delete_position_task(position_id, sleep_duration: float):
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


# @shared_task
# def create_erc20_process_task(erc20_list):
#     for erc20 in erc20_list:
#         divider = 10
#         for x in range(1, int(erc20["tokenDecimal"])):
#             divider = divider * 10

#         erc20_raw = Polygon_ERC20_Raw.objects.create(
#             blockNumber=erc20["blockNumber"],
#             timeStamp=erc20["timeStamp"],
#             hash=erc20["hash"],
#             nonce=erc20["nonce"],
#             blockHash=erc20["blockHash"],
#             fromAddress=erc20["from"],
#             toAddress=erc20["to"],
#             contractAddress=erc20["contractAddress"],
#             value=erc20["value"],
#             tokenName=erc20["tokenName"],
#             tokenDecimal=erc20["tokenDecimal"],
#             transactionIndex=erc20["transactionIndex"],
#             gas=erc20["gas"],
#             gasPrice=erc20["gasPrice"],
#             gasUsed=erc20["gasUsed"],
#             cumulativeGasUsed=erc20["cumulativeGasUsed"],
#             input=erc20["input"],
#             confirmations=erc20["confirmations"],
#         )
#         erc20_raw.save()


@shared_task
def create_transactions_from_erc20_task(wallet_id: int):
    """
    Task to create transactions from ERC20 data for a wallet.
    """
    try:
        wallet = get_object_or_404(Wallet, id=wallet_id)
        transactions = get_erc20_transactions_by_wallet(wallet.address)
        for erc20 in transactions:
            contract_address = erc20["contractAddress"]
            contract = Contract.objects.filter(address=contract_address).first()
            if contract is not None:
                position, created = Position.objects.get_or_create(wallet=wallet, contract=contract)
                transaction_type = TypeTransactionChoices.IN if erc20["to"].upper() == wallet.address.upper() else TypeTransactionChoices.OUT
                Transaction.objects.create(
                    position=position,
                    type=transaction_type,
                    quantity=int(erc20["value"]) / (10 ** int(erc20["tokenDecimal"])),
                    date=datetime.fromtimestamp(int(erc20["timeStamp"])),
                    hash=erc20["hash"],
                ).save()
        logger.info(f"Created transactions from ERC20 for wallet id {wallet_id}")
        
    except Contract.DoesNotExist:             
        logger.error(f"Contract with address {contract_address} does not exist")
    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")

    return wallet_id

# @shared_task
# def create_transactions_from_erc20_task(wallet_id: int):
#     """
#     Task to create transactions from ERC20 data for a wallet.
#     """
#     wallet = get_object_or_404(Wallet, id=wallet_id)

#     erc20_list = Polygon_ERC20_Raw.objects.filter(Q(fromAddress=wallet.address) | Q(toAddress=wallet.address))

#     fiat_USD = get_object_or_404(Fiat, code="USD")

#     for erc20 in erc20_list:
#         logger.info("Process " + erc20.hash)
#         transactionType = "IN"
#         if erc20.fromAddress == wallet.address:
#             transactionType = "OUT"
#         if erc20.toAddress == wallet.address:
#             transactionType = "IN"

#         divider = 10
#         for x in range(1, int(erc20.tokenDecimal)):
#             divider = divider * 10

#         try:
#             contract = Contract.objects.filter(address=erc20.contractAddress).get()

#             # 3. Create the position
#             position, position_created = Position.objects.get_or_create(
#                 contract=contract,
#                 wallet=wallet,
#                 is_active=True,
#             )
#             position.save()

#             # 4. Create the transaction
#             transaction = Transaction.objects.create(
#                 position=position,
#                 type=transactionType,
#                 date=datetime.fromtimestamp(int(erc20.timeStamp)),
#                 hash=erc20.hash,
#                 quantity=(int(erc20.value) / divider),
#                 against_fiat=fiat_USD,
#             )
#             transaction.save()

#         except Contract.DoesNotExist:
#             logger.error("Object does not exist : " + erc20.contractAddress)

#     return wallet_id


@shared_task
def aggregate_transactions_task(wallet_id: int):
    # 5. Aggregate transactions when not 1 vs 1
    wallet = get_object_or_404(Wallet, id=wallet_id)
    positions = Position.objects.filter(wallet=wallet)
    transactions_by_wallet_to_aggregate = []
    for position in positions:
        transactions = Transaction.objects.filter(position=position).order_by("-date")
        for transaction in transactions:
            transactions_by_wallet_to_aggregate.append(transaction)

    for transaction in transactions_by_wallet_to_aggregate:
        condition = Transaction.objects.filter(hash=transaction.hash)
        if condition.count() > 2:

            transaction_agg = Transaction.objects.create(
                position=transaction.position,
                date=transaction.date,
                hash=transaction.hash,
                against_fiat=transaction.against_fiat,
            )

            transactions_to_aggregate = Transaction.objects.filter(hash=transaction.hash).filter(
                position=transaction.position
            )
            quantity_agg = 0
            for t_agg in transactions_to_aggregate:
                # logger.info(t_agg)
                quantity_agg += t_agg.quantity if t_agg.type == TypeTransactionChoices.IN else t_agg.quantity * -1
                t_agg.delete()

            transaction_agg.type = TypeTransactionChoices.IN if quantity_agg > 0 else TypeTransactionChoices.OUT
            transaction_agg.quantity = abs(quantity_agg)
            logger.info(transaction_agg)
            transaction_agg.save()

    return wallet_id


@shared_task
def calculate_cost_transaction_task(wallet_id: int):
    # 6. Retrieve the contract against the transaction to calculate cost
    try:
        wallet = Wallet.objects.get(id=wallet_id)
        positions = Position.objects.filter(wallet=wallet)
        transactions_by_wallet = []
        for position in positions:
            transactions = Transaction.objects.filter(position=position).order_by("-date")
            for transaction in transactions:
                transactions_by_wallet.append(transaction)

        for transaction in transactions_by_wallet:
            condition = Transaction.objects.filter(hash=transaction.hash)
            if condition.count() == 2:
                transaction_ref = Transaction.objects.filter(hash=transaction.hash).exclude(id=transaction.id)  # type: ignore
                position = Position.objects.filter(id=transaction_ref[0].position.id).first()
                transaction.against_contract = position.contract
                transaction.cost_contract_based = transaction_ref[0].quantity
                if transaction.quantity == 0:
                    transaction.price_contract_based = 0  # type: ignore
                else:
                    transaction.price_contract_based = transaction_ref[0].quantity / transaction.quantity
                transaction.save()

        return wallet_id

    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")


@shared_task
def clean_contract_address_task(wallet_id: int):
     # 0. Clean contracts addresses
    contracts = Contract.objects.all()
    for contract in contracts:
        contract.address = contract.address.lower()
        contract.save()

    return wallet_id

@shared_task
def clean_transaction_task(wallet_id: int):
    # 1. Clean existing information
    wallet = get_object_or_404(Wallet, id=wallet_id)
    try:
        positions = Position.objects.filter(wallet=wallet)
        for position in positions:
            position = get_object_or_404(Position, id=position.id)
            result = position.delete()
            logger.info(f"Position with id {position.id} has been deleted")
    except Position.DoesNotExist:
        logger.info(f"Object Position does not exist for : " + str(wallet.id))
    except Exception as error:
        logger.error(f"An error occurred : " + type(error).__name__)

    return wallet_id


@shared_task
def calculate_running_quantity_transaction_task(wallet_id: int):
    """
    Task to calculate the running quantity of transactions in a wallet.
    """
    try:
        wallet = Wallet.objects.get(id=wallet_id)
        positions = Position.objects.filter(wallet=wallet)

        for position in positions:
            # Get all transactions associated with the current position, ordered by date
            transactions = Transaction.objects.filter(position=position).order_by("date")

            running_quantity = 0
            buy_quantity = 0
            sell_quantity = 0
            total_cost = 0
            price_contract_based = 0
            
            for transaction in transactions:
                
                calculator = TransactionCalculator(transaction)
                cost_contract_based = calculator.calculate_cost_contract_based()

                if transaction.type == TypeTransactionChoices.IN:
                    # Reset total_cost and buy_quantity if we sold everything (or almost) on last transaction
                    if (running_quantity * price_contract_based) < 1:
                        total_cost = cost_contract_based
                        buy_quantity = transaction.quantity
                    else:
                        total_cost += cost_contract_based
                        buy_quantity += transaction.quantity
                    # Then update the running_quantity
                    running_quantity += transaction.quantity
                elif transaction.type == TypeTransactionChoices.OUT:
                    running_quantity -= transaction.quantity
                    sell_quantity += transaction.quantity

                price_contract_based = transaction.price_contract_based
                
                # Update the running quantity for the transaction
                transaction.running_quantity = running_quantity
                transaction.buy_quantity = buy_quantity
                transaction.sell_quantity = sell_quantity
                transaction.total_cost_contract_based = total_cost
                transaction.save()
        
            position.quantity = running_quantity
            position.save()

        logger.info(f"Calculated running quantities for all positions in wallet id {wallet_id}")

    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(f"An error occurred while calculating running quantities: {str(e)}")
