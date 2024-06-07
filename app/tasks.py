import logging
import time

from celery import shared_task
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.timezone import utc
from app.utils.polygon.view_polygon import (
    account_balance_by_address as polygon_account_balance_by_address,
    erc20_transactions_by_wallet as polygon_erc20_transactions_by_wallet,
)
from app.utils.arbitrum.view_arbitrum import (
    account_balance_by_address as arbitrum_account_balance_by_address,
    erc20_transactions_by_wallet as arbitrum_erc20_transactions_by_wallet,
)
from app.utils.optimism.view_optimism import (
    account_balance_by_address as optimism_account_balance_by_address,
    erc20_transactions_by_wallet as optimism_erc20_transactions_by_wallet,
)
from app.utils.bsc.view_bsc import (
    account_balance_by_address as bsc_account_balance_by_address,
    bep20_transactions_by_wallet
)

from app.models import (
    Blockchain,
    Contract,
    Position,
    Transaction,
    TransactionCalculator,
    TypeTransactionChoices,
    Wallet,
)

from datetime import datetime

logger = logging.getLogger("blockbuilders")


@shared_task
def delete_wallet_task(wallet_id, sleep_duration: float):
    """
    Task to delete a wallet with a given id after a sleep duration.
    """
    logger.info(f"Deleting wallet with id {wallet_id} after sleeping for {sleep_duration} seconds.")
    wallet = get_object_or_404(Wallet, id=wallet_id)
    result = wallet.delete()
    time.sleep(sleep_duration)
    logger.info(f"Deleted wallet with id {wallet_id}.")
    return result


@shared_task
def delete_position_task(position_id, sleep_duration: float):
    """
    Task to delete a position with a given id after a sleep duration.
    """
    logger.info(f"Deleting position with id {position_id} after sleeping for {sleep_duration} seconds.")
    position = get_object_or_404(Position, id=position_id)
    result = position.delete()
    time.sleep(sleep_duration)
    logger.info(f"Deleted position with id {position_id}.")
    return result


# @shared_task
# def get_erc20_transactions_by_wallet_task(wallet_address):
#     """
#     Task to fetch ERC20 transactions for a given wallet address.
#     """
#     logger.info(f"Fetching ERC20 transactions for wallet address {wallet_address}.")
#     result = erc20_transactions_by_wallet(wallet_address)
#     logger.info(f"Fetched {len(result)} transactions for wallet address {wallet_address}.")
#     return result


@shared_task
def create_transactions_from_bsc_bep20_task(wallet_id: int):
    """
    Task to create transactions from BEP20 (BSC) data for a wallet.
    """
    logger.info(f"Creating transactions from BEP20 (BSC) data for wallet id {wallet_id}.")
    try:
        wallet = get_object_or_404(Wallet, id=wallet_id)
        transactions = bep20_transactions_by_wallet(wallet.address)
        blockchain = Blockchain.objects.filter(name="BSC").first()
        for bep20 in transactions:
            contract_address = bep20["contractAddress"]
            contract_name = bep20["tokenName"]
            contract_symbol = bep20["tokenSymbol"]
            # contract = Contract.objects.filter(address=contract_address).first()
            contract, created = Contract.objects.get_or_create(
                blockchain_id=blockchain.id,
                address=contract_address,
                name=contract_name,
                symbol=contract_symbol,
                defaults={
                    "previous_day": timezone.make_aware(datetime.now(), utc),
                    "previous_week": timezone.make_aware(datetime.now(), utc),
                    "previous_month": timezone.make_aware(datetime.now(), utc),
                },
            )
            # if contract is not None:
            position, created = Position.objects.get_or_create(wallet=wallet, contract=contract)
            transaction_type = (
                TypeTransactionChoices.IN
                if bep20["to"].upper() == wallet.address.upper()
                else TypeTransactionChoices.OUT
            )
            Transaction.objects.create(
                position=position,
                type=transaction_type,
                quantity=int(bep20["value"]) / (10 ** int(bep20["tokenDecimal"])),
                date=timezone.make_aware(datetime.fromtimestamp(int(bep20["timeStamp"])), utc),
                hash=bep20["hash"],
            ).save()
        logger.info(f"Created transactions from BEP20 (BSC) for wallet id {wallet_id} successfully.")

    except Contract.DoesNotExist:
        logger.error(f"Contract with address {contract_address} does not exist")
    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(
            f"An error occurred while creating transactions from BEP20 (BSC) for wallet id {wallet_id}: {str(e)}"
        )

    return wallet_id

@shared_task
def create_transactions_from_polygon_erc20_task(wallet_id: int):
    """
    Task to create transactions from ERC20 (Polygon) data for a wallet.
    """
    logger.info(f"Creating transactions from ERC20 (Polygon) data for wallet id {wallet_id}.")
    try:
        wallet = get_object_or_404(Wallet, id=wallet_id)
        transactions = polygon_erc20_transactions_by_wallet(wallet.address)
        blockchain = Blockchain.objects.filter(name="Polygon").first()
        for erc20 in transactions:
            contract_address = erc20["contractAddress"]
            contract_name = erc20["tokenName"]
            contract_symbol = erc20["tokenSymbol"]
            # contract = Contract.objects.filter(address=contract_address).first()
            contract, created = Contract.objects.get_or_create(
                blockchain_id=blockchain.id,
                address=contract_address,
                name=contract_name,
                symbol=contract_symbol,
                defaults={
                    "previous_day": timezone.make_aware(datetime.now(), utc),
                    "previous_week": timezone.make_aware(datetime.now(), utc),
                    "previous_month": timezone.make_aware(datetime.now(), utc),
                },
            )
            # if contract is not None:
            position, created = Position.objects.get_or_create(wallet=wallet, contract=contract)
            transaction_type = (
                TypeTransactionChoices.IN
                if erc20["to"].upper() == wallet.address.upper()
                else TypeTransactionChoices.OUT
            )
            Transaction.objects.create(
                position=position,
                type=transaction_type,
                quantity=int(erc20["value"]) / (10 ** int(erc20["tokenDecimal"])),
                date=timezone.make_aware(datetime.fromtimestamp(int(erc20["timeStamp"])), utc),
                hash=erc20["hash"],
            ).save()
        logger.info(f"Created transactions from ERC20 (Polygon) for wallet id {wallet_id} successfully.")

    except Contract.DoesNotExist:
        logger.error(f"Contract with address {contract_address} does not exist")
    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(
            f"An error occurred while creating transactions from ERC20 (Polygon) for wallet id {wallet_id}: {str(e)}"
        )

    return wallet_id

@shared_task
def create_transactions_from_arbitrum_erc20_task(wallet_id: int):
    """
    Task to create transactions from ERC20 (Arbitrum) data for a wallet.
    """
    logger.info(f"Creating transactions from ERC20 (Arbitrum) data for wallet id {wallet_id}.")
    try:
        wallet = get_object_or_404(Wallet, id=wallet_id)
        transactions = arbitrum_erc20_transactions_by_wallet(wallet.address)
        blockchain = Blockchain.objects.filter(name="Arbitrum").first()
        for erc20 in transactions:
            contract_address = erc20["contractAddress"]
            contract_name = erc20["tokenName"]
            contract_symbol = erc20["tokenSymbol"]
            # contract = Contract.objects.filter(address=contract_address).first()
            contract, created = Contract.objects.get_or_create(
                blockchain_id=blockchain.id,
                address=contract_address,
                name=contract_name,
                symbol=contract_symbol,
                defaults={
                    "previous_day": timezone.make_aware(datetime.now(), utc),
                    "previous_week": timezone.make_aware(datetime.now(), utc),
                    "previous_month": timezone.make_aware(datetime.now(), utc),
                },
            )
            # if contract is not None:
            position, created = Position.objects.get_or_create(wallet=wallet, contract=contract)
            transaction_type = (
                TypeTransactionChoices.IN
                if erc20["to"].upper() == wallet.address.upper()
                else TypeTransactionChoices.OUT
            )
            Transaction.objects.create(
                position=position,
                type=transaction_type,
                quantity=int(erc20["value"]) / (10 ** int(erc20["tokenDecimal"])),
                date=timezone.make_aware(datetime.fromtimestamp(int(erc20["timeStamp"])), utc),
                hash=erc20["hash"],
            ).save()
        logger.info(f"Created transactions from ERC20 (Arbitrum) for wallet id {wallet_id} successfully.")

    except Contract.DoesNotExist:
        logger.error(f"Contract with address {contract_address} does not exist")
    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(
            f"An error occurred while creating transactions from ERC20 (Arbitrum) for wallet id {wallet_id}: {str(e)}"
        )

    return wallet_id

@shared_task
def create_transactions_from_optimism_erc20_task(wallet_id: int):
    """
    Task to create transactions from ERC20 (Optimism) data for a wallet.
    """
    logger.info(f"Creating transactions from ERC20 (Optimism) data for wallet id {wallet_id}.")
    try:
        wallet = get_object_or_404(Wallet, id=wallet_id)
        transactions = optimism_erc20_transactions_by_wallet(wallet.address)
        blockchain = Blockchain.objects.filter(name="Optimism").first()
        for erc20 in transactions:
            contract_address = erc20["contractAddress"]
            contract_name = erc20["tokenName"]
            contract_symbol = erc20["tokenSymbol"]
            # contract = Contract.objects.filter(address=contract_address).first()
            contract, created = Contract.objects.get_or_create(
                blockchain_id=blockchain.id,
                address=contract_address,
                name=contract_name,
                symbol=contract_symbol,
                defaults={
                    "previous_day": timezone.make_aware(datetime.now(), utc),
                    "previous_week": timezone.make_aware(datetime.now(), utc),
                    "previous_month": timezone.make_aware(datetime.now(), utc),
                },
            )
            # if contract is not None:
            position, created = Position.objects.get_or_create(wallet=wallet, contract=contract)
            transaction_type = (
                TypeTransactionChoices.IN
                if erc20["to"].upper() == wallet.address.upper()
                else TypeTransactionChoices.OUT
            )
            Transaction.objects.create(
                position=position,
                type=transaction_type,
                quantity=int(erc20["value"]) / (10 ** int(erc20["tokenDecimal"])),
                date=timezone.make_aware(datetime.fromtimestamp(int(erc20["timeStamp"])), utc),
                hash=erc20["hash"],
            ).save()
        logger.info(f"Created transactions from ERC20 (Optimism) for wallet id {wallet_id} successfully.")

    except Contract.DoesNotExist:
        logger.error(f"Contract with address {contract_address} does not exist")
    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(
            f"An error occurred while creating transactions from ERC20 (Optimism) for wallet id {wallet_id}: {str(e)}"
        )

    return wallet_id



@shared_task
def get_polygon_token_balance(wallet_id: int):
    """
    Task to get the MATIC (Polygon) balance for a wallet.
    """
    logger.info(f"Get MATIC (Polygon) balance for wallet id {wallet_id}.")
    try:
        blockchain = Blockchain.objects.filter(name="Polygon").first()
        wallet = get_object_or_404(Wallet, id=wallet_id)
        contract_address = "0x0000000000000000000000000000000000001010"
        contract_name = "MATIC"
        contract_symbol = "MATIC"
        balance = polygon_account_balance_by_address(wallet.address)
        contract, created = Contract.objects.get_or_create(
                blockchain_id=blockchain.id,
                address=contract_address,
                name=contract_name,
                symbol=contract_symbol,
                defaults={
                    "decimals":18,
                    "previous_day": timezone.make_aware(datetime.now(), utc),
                    "previous_week": timezone.make_aware(datetime.now(), utc),
                    "previous_month": timezone.make_aware(datetime.now(), utc),
                },
            )
        position, created = Position.objects.get_or_create(wallet=wallet, contract=contract)
        position.quantity = int(balance) / int(1000000000000000000)
        position.save()
    except Contract.DoesNotExist:
        logger.error(f"Contract with address {contract_address} does not exist")
    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(f"An error occurred while getting MATIC (Polygon) balance for for wallet id {wallet_id}: {str(e)}")

    return wallet_id

@shared_task
def get_bsc_token_balance(wallet_id: int):
    """
    Task to get the BNB (BSC) balance for a wallet.
    """
    logger.info(f"Get BNB (BSC) balance for wallet id {wallet_id}.")
    try:
        blockchain = Blockchain.objects.filter(name="BSC").first()
        wallet = get_object_or_404(Wallet, id=wallet_id)
        contract_address = "0x0000000000000000000000000000000000001010"
        contract_name = "BNB"
        contract_symbol = "BNB"
        balance = bsc_account_balance_by_address(wallet.address)
        contract, created = Contract.objects.get_or_create(
                blockchain_id=blockchain.id,
                address=contract_address,
                name=contract_name,
                symbol=contract_symbol,
                defaults={
                    "decimals":18,
                    "previous_day": timezone.make_aware(datetime.now(), utc),
                    "previous_week": timezone.make_aware(datetime.now(), utc),
                    "previous_month": timezone.make_aware(datetime.now(), utc),
                },
            )
        position, created = Position.objects.get_or_create(wallet=wallet, contract=contract)
        position.quantity = int(balance) / int(1000000000000000000)
        position.save()
    except Contract.DoesNotExist:
        logger.error(f"Contract with address {contract_address} does not exist")
    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(f"An error occurred while getting BNB (BSC) balance for for wallet id {wallet_id}: {str(e)}")

    return wallet_id

@shared_task
def get_arbitrum_token_balance(wallet_id: int):
    """
    Task to get the ETH (Arbitrum) balance for a wallet.
    """
    logger.info(f"Get ETH (Arbitrum) balance for wallet id {wallet_id}.")
    try:
        blockchain = Blockchain.objects.filter(name="Arbitrum").first()
        wallet = get_object_or_404(Wallet, id=wallet_id)
        contract_address = "0x0000000000000000000000000000000000001010"
        contract_name = "ETH"
        contract_symbol = "ETH"
        balance = arbitrum_account_balance_by_address(wallet.address)
        contract, created = Contract.objects.get_or_create(
                blockchain_id=blockchain.id,
                address=contract_address,
                name=contract_name,
                symbol=contract_symbol,
                defaults={
                    "decimals":18,
                    "previous_day": timezone.make_aware(datetime.now(), utc),
                    "previous_week": timezone.make_aware(datetime.now(), utc),
                    "previous_month": timezone.make_aware(datetime.now(), utc),
                },
            )
        position, created = Position.objects.get_or_create(wallet=wallet, contract=contract)
        position.quantity = int(balance) / int(1000000000000000000)
        position.save()
    except Contract.DoesNotExist:
        logger.error(f"Contract with address {contract_address} does not exist")
    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(f"An error occurred while getting ETH (Arbitrum) balance for wallet id {wallet_id}: {str(e)}")

    return wallet_id

@shared_task
def get_optimism_token_balance(wallet_id: int):
    """
    Task to get the ETH (Optimism) balance for a wallet.
    """
    logger.info(f"Get ETH (Optimism) balance for wallet id {wallet_id}.")
    try:
        blockchain = Blockchain.objects.filter(name="Arbitrum").first()
        wallet = get_object_or_404(Wallet, id=wallet_id)
        contract_address = "0x0000000000000000000000000000000000001010"
        contract_name = "ETH"
        contract_symbol = "ETH"
        balance = optimism_account_balance_by_address(wallet.address)
        contract, created = Contract.objects.get_or_create(
                blockchain_id=blockchain.id,
                address=contract_address,
                name=contract_name,
                symbol=contract_symbol,
                defaults={
                    "decimals":18,
                    "previous_day": timezone.make_aware(datetime.now(), utc),
                    "previous_week": timezone.make_aware(datetime.now(), utc),
                    "previous_month": timezone.make_aware(datetime.now(), utc),
                },
            )
        position, created = Position.objects.get_or_create(wallet=wallet, contract=contract)
        position.quantity = int(balance) / int(1000000000000000000)
        position.save()
    except Contract.DoesNotExist:
        logger.error(f"Contract with address {contract_address} does not exist")
    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(f"An error occurred while getting ETH (Optimism) balance for wallet id {wallet_id}: {str(e)}")

    return wallet_id

@shared_task
def aggregate_transactions_task(wallet_id: int):
    """
    Task to aggregate transactions for a given wallet.
    """
    logger.info(f"Aggregating transactions for wallet id {wallet_id}.")
    wallet = get_object_or_404(Wallet, id=wallet_id)
    positions = Position.objects.filter(wallet=wallet)
    transactions_by_wallet_to_aggregate = []
    for position in positions:
        transactions = Transaction.objects.filter(position=position).order_by("-date")
        for transaction in transactions:
            transactions_by_wallet_to_aggregate.append(transaction)

    for transaction in transactions_by_wallet_to_aggregate:

        transactions_to_aggregate = Transaction.objects.filter(hash=transaction.hash).filter(
            position=transaction.position
        )

        if transactions_to_aggregate.count() >= 2:

            transaction_agg = Transaction.objects.create(
                position=transaction.position,
                date=transaction.date,
                hash=transaction.hash,
                against_fiat=transaction.against_fiat,
            )

            quantity_agg = 0
            for t_agg in transactions_to_aggregate:
                quantity_agg += t_agg.quantity if t_agg.type == TypeTransactionChoices.IN else t_agg.quantity * -1
                t_agg.delete()

            transaction_agg.type = TypeTransactionChoices.IN if quantity_agg > 0 else TypeTransactionChoices.OUT
            transaction_agg.quantity = abs(quantity_agg)
            logger.info(f"Transaction with hash {transaction_agg.hash} has been aggregated")
            transaction_agg.save()

    logger.info(f"Aggregated transactions for wallet id {wallet_id} successfully.")
    return wallet_id


@shared_task
def calculate_cost_transaction_task(wallet_id: int):
    """
    Task to calculate the cost of transactions for a given wallet.
    """
    logger.info(f"Calculating transaction costs for wallet id {wallet_id}.")
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

        logger.info(f"Calculated transaction costs for wallet id {wallet_id} successfully.")
        return wallet_id

    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(f"An error occurred while calculating transaction costs for wallet id {wallet_id}: {str(e)}")


@shared_task
def clean_contract_address_task(wallet_id: int):
    """
    Task to clean contract addresses.
    """
    logger.info(f"Cleaning contract addresses.")
    contracts = Contract.objects.all()
    for contract in contracts:
        contract.address = contract.address.lower()
        contract.save()
    logger.info(f"Cleaned contract addresses successfully.")
    return wallet_id


@shared_task
def clean_transaction_task(wallet_id: int):
    """
    Task to clean existing transaction information for a given wallet.
    """
    logger.info(f"Cleaning transactions for wallet id {wallet_id}.")
    wallet = get_object_or_404(Wallet, id=wallet_id)
    try:
        positions = Position.objects.filter(wallet=wallet)
        for position in positions:
            position = get_object_or_404(Position, id=position.id)
            position_id = position.id
            result = position.delete()
            logger.info(f"Position with id {position_id} has been deleted")
    except Position.DoesNotExist:
        logger.info(f"Position does not exist for wallet id {wallet_id}.")
    except Exception as error:
        logger.error(
            f"An error occurred while cleaning transactions for wallet id {wallet_id}: {type(error).__name__}"
        )

    return wallet_id


@shared_task
def calculate_running_quantity_transaction_task(wallet_id: int):
    """
    Task to calculate the running quantity of transactions in a wallet.
    """
    logger.info(f"Calculating running quantities for transactions in wallet id {wallet_id}.")
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
        logger.error(f"An error occurred while calculating running quantities for wallet id {wallet_id}: {str(e)}")

    return wallet_id
