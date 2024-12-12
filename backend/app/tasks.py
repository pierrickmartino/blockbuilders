import logging
import time
import uuid

from blockbuilders.settings.base import DEBUG

from celery import shared_task
from django.shortcuts import get_object_or_404
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from django.db.models import F, Q, Sum, Count
from datetime import timezone as dt_timezone
from app.utils.cryptocompare.view_cryptocompare import get_daily_pair_ohlcv, get_multiple_symbols_price
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
    bep20_transactions_by_wallet,
)

from app.models import (
    Blockchain,
    CategoryContractChoices,
    Contract,
    ContractCalculator,
    Fiat,
    MarketData,
    Position,
    PositionCalculator,
    StatusTransactionChoices,
    TaskStatusChoices,
    Transaction,
    TransactionCalculator,
    TypeTransactionChoices,
    Wallet,
    WalletProcess,
)

from datetime import datetime, timedelta

logger = logging.getLogger("blockbuilders")


def is_contract_suspicious(contract_name, contract_symbol):
    suspicious_startswith_keywords = ["$", "claim ", "(e", "http", "use just", "visit ", "www.", "@", "!", "#", "NO_NAME"]

    suspicious_endswith_keywords = [
        ".com",
        ".net",
        ".xyz",
        ".org",
        "reward",
        "rewards",
        ".app)",
        ".vip]",
        "airdrop",
        ".xyz]",
        ".com ]",
        ".co",
        "events]",
        ".online",
        ".io",
        ".fi",
        ".gg",
        "www.ethena.promo)",
    ]

    # Check if contract symbol starts with any suspicious keywords
    for keyword in suspicious_startswith_keywords:
        if contract_symbol.lower().startswith(keyword):
            return True

    # Check if contract symbol ends with any suspicious keywords
    for keyword in suspicious_endswith_keywords:
        if contract_symbol.lower().endswith(keyword):
            return True

    # Check if contract name ends with any suspicious keywords
    for keyword in suspicious_endswith_keywords:
        if contract_name.lower().endswith(keyword):
            return True

    return False


def get_market_data(symbol, transaction_date):
    # Define a mapping of prefixes to their transformations
    prefix_map = {"USDC.e": "USDC", "aPol": "", "am": ""}

    # Determine the new symbol based on the prefix
    new_symbol = symbol
    for prefix, replacement in prefix_map.items():
        if symbol.startswith(prefix):
            new_symbol = symbol.replace(prefix, replacement)
            break

    # Retrieve market data
    data = (
        MarketData.objects.filter(symbol=new_symbol, reference="USD", time__lte=transaction_date)
        .order_by("-time")
        .first()
    )

    return data


def calculate_cost_transaction_task_debug(transaction, symbol):
    logger.info(f"transaction.position.contract.symbol : {transaction.position.contract.symbol}")
    logger.info(f"transaction.quantity : {transaction.quantity}")
    logger.info(f"transaction.date : {transaction.date}")
    logger.info(f"transaction.price : {transaction.price}")
    logger.info(f"transaction.against_contract : {transaction.against_contract}")
    logger.info(f"transaction.price_contract_based : {transaction.price_contract_based}")
    logger.info(f"transaction.against_fiat : {transaction.against_fiat}")
    logger.info(f"transaction.price_fiat_based : {transaction.price_fiat_based}")
    logger.info(f"transaction.cost_fiat_based : {transaction.cost_fiat_based}")
    logger.info(f"transaction.type : {transaction.type}")
    logger.info(f"transaction.position : {transaction.position}")
    logger.info(f"symbol : {symbol}")


@shared_task
def delete_wallet_task(wallet_id, sleep_duration: float):
    """
    Task to delete a wallet with a given id after a sleep duration.
    """
    start_time = time.time()
    logger.info(f"Task started [delete_wallet_task] with ({wallet_id}, {sleep_duration})")
    wallet = get_object_or_404(Wallet, id=wallet_id)
    result = wallet.delete()
    time.sleep(sleep_duration)
    end_time = time.time()
    logger.info(
        f"Task completed [delete_wallet_task] in {(end_time - start_time)} seconds ({wallet_id}, {sleep_duration})"
    )
    return result


@shared_task
def delete_position_task(position_id, sleep_duration: float):
    """
    Task to delete a position with a given id after a sleep duration.
    """
    start_time = time.time()
    logger.info(f"Task started [delete_position_task] with ({position_id}, {sleep_duration})")
    position = get_object_or_404(Position, id=position_id)
    result = position.delete()
    time.sleep(sleep_duration)
    end_time = time.time()
    logger.info(
        f"Task completed [delete_position_task] in {(end_time - start_time)} seconds ({position_id}, {sleep_duration})"
    )
    return result


def create_transactions(wallet, transactions, blockchain_name):
    blockchain = Blockchain.objects.filter(name=blockchain_name).first()

    transactions_to_create = []

    for tx in transactions:
        contract_address = tx["contractAddress"]
        contract_name = tx["tokenName"]
        contract_symbol = tx["tokenSymbol"]

        contract, created = Contract.objects.get_or_create(
            blockchain_id=blockchain.id,
            address=contract_address,
            name=contract_name if contract_name else "NO_NAME",
            symbol=contract_symbol if contract_symbol else "NO_SYMBOL",
            defaults={
                "previous_day": timezone.make_aware(datetime.now(), dt_timezone.utc),
                "previous_week": timezone.make_aware(datetime.now(), dt_timezone.utc),
                "previous_month": timezone.make_aware(datetime.now(), dt_timezone.utc),
            },
        )

        # Mark as suspicious if criteria are met
        if is_contract_suspicious(contract_name, contract_symbol):
            contract.category = CategoryContractChoices.SUSPICIOUS
            contract.save() # Save immediately if suspicious, to ensure it's marked
        

        if contract.category != CategoryContractChoices.SUSPICIOUS:
            position, created = Position.objects.get_or_create(wallet=wallet, contract=contract)

            transaction_type = (
                TypeTransactionChoices.IN if tx["to"].upper() == wallet.address.upper() else TypeTransactionChoices.OUT
            )
            transactions_to_create.append(
            Transaction(
                position=position,
                type=transaction_type,
                quantity=int(tx["value"]) / (10 ** int(tx["tokenDecimal"])),
                date=timezone.make_aware(datetime.fromtimestamp(int(tx["timeStamp"])), dt_timezone.utc),
                hash=tx["hash"],
                )
            )

    # Bulk create transactions
    Transaction.objects.bulk_create(transactions_to_create)


@shared_task
def create_transactions_from_bsc_bep20_task(wallet_id: uuid):
    """
    Task to create transactions from BEP20 (BSC) data for a wallet.
    """
    start_time = time.time()
    logger.info(f"Task started [create_transactions_from_bsc_bep20_task] with ({wallet_id})")

    try:
        wallet = get_object_or_404(Wallet, id=wallet_id)
        transactions = bep20_transactions_by_wallet(wallet.address)
        create_transactions(wallet, transactions, "BSC")

        end_time = time.time()
        logger.info(
            f"Task completed [create_transactions_from_bsc_bep20_task] in {(end_time - start_time)} seconds ({wallet_id})"
        )

    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(
            f"An error occurred while creating transactions from BEP20 (BSC) for wallet id {wallet_id}: {str(e)}"
        )

    return wallet_id


@shared_task
def create_transactions_from_polygon_erc20_task(wallet_id: uuid):
    """
    Task to create transactions from ERC20 (Polygon) data for a wallet.
    """
    start_time = time.time()
    logger.info(f"Task started [create_transactions_from_polygon_erc20_task] with ({wallet_id})")

    try:
        wallet = get_object_or_404(Wallet, id=wallet_id)
        transactions = polygon_erc20_transactions_by_wallet(wallet.address)
        create_transactions(wallet, transactions, "Polygon")

        end_time = time.time()
        logger.info(
            f"Task completed [create_transactions_from_polygon_erc20_task] in {(end_time - start_time)} seconds ({wallet_id})"
        )

    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(
            f"An error occurred while creating transactions from ERC20 (Polygon) for wallet id {wallet_id}: {str(e)}"
        )

    return wallet_id


@shared_task
def create_transactions_from_arbitrum_erc20_task(wallet_id: uuid):
    """
    Task to create transactions from ERC20 (Arbitrum) data for a wallet.
    """
    start_time = time.time()
    logger.info(f"Task started [create_transactions_from_arbitrum_erc20_task] with ({wallet_id})")

    try:
        wallet = get_object_or_404(Wallet, id=wallet_id)
        transactions = arbitrum_erc20_transactions_by_wallet(wallet.address)
        create_transactions(wallet, transactions, "Arbitrum")

        end_time = time.time()
        logger.info(
            f"Task completed [create_transactions_from_arbitrum_erc20_task] in {(end_time - start_time)} seconds ({wallet_id})"
        )

    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(
            f"An error occurred while creating transactions from ERC20 (Arbitrum) for wallet id {wallet_id}: {str(e)}"
        )

    return wallet_id


@shared_task
def create_transactions_from_optimism_erc20_task(wallet_id: uuid):
    """
    Task to create transactions from ERC20 (Optimism) data for a wallet.
    """
    start_time = time.time()
    logger.info(f"Task started [create_transactions_from_optimism_erc20_task] with ({wallet_id})")

    try:
        wallet = get_object_or_404(Wallet, id=wallet_id)
        transactions = optimism_erc20_transactions_by_wallet(wallet.address)
        create_transactions(wallet, transactions, "Optimism")

        end_time = time.time()
        logger.info(
            f"Task completed [create_transactions_from_optimism_erc20_task] in {(end_time - start_time)} seconds ({wallet_id})"
        )

    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(
            f"An error occurred while creating transactions from ERC20 (Optimism) for wallet id {wallet_id}: {str(e)}"
        )

    return wallet_id


@shared_task
def get_polygon_token_balance(wallet_id: uuid):
    """
    Task to get the MATIC (Polygon) balance for a wallet.
    """
    start_time = time.time()
    logger.info(f"Task started [get_polygon_token_balance] with ({wallet_id})")

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
                "decimals": 18,
                "previous_day": timezone.make_aware(datetime.now(), dt_timezone.utc),
                "previous_week": timezone.make_aware(datetime.now(), dt_timezone.utc),
                "previous_month": timezone.make_aware(datetime.now(), dt_timezone.utc),
            },
        )
        position, created = Position.objects.get_or_create(wallet=wallet, contract=contract)
        position.quantity = int(balance) / int(1000000000000000000)
        position.save()

        end_time = time.time()
        logger.info(f"Task completed [get_polygon_token_balance] in {(end_time - start_time)} seconds ({wallet_id})")

    except Contract.DoesNotExist:
        logger.error(f"Contract with address {contract_address} does not exist")
    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(f"An error occurred while getting MATIC (Polygon) balance for wallet id {wallet_id}: {str(e)}")

    return wallet_id


@shared_task
def get_bsc_token_balance(wallet_id: uuid):
    """
    Task to get the BNB (BSC) balance for a wallet.
    """
    start_time = time.time()
    logger.info(f"Task started [get_bsc_token_balance] with ({wallet_id})")

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
                "decimals": 18,
                "previous_day": timezone.make_aware(datetime.now(), dt_timezone.utc),
                "previous_week": timezone.make_aware(datetime.now(), dt_timezone.utc),
                "previous_month": timezone.make_aware(datetime.now(), dt_timezone.utc),
            },
        )
        position, created = Position.objects.get_or_create(wallet=wallet, contract=contract)
        position.quantity = int(balance) / int(1000000000000000000)
        position.save()

        end_time = time.time()
        logger.info(f"Task completed [get_bsc_token_balance] in {(end_time - start_time)} seconds ({wallet_id})")

    except Contract.DoesNotExist:
        logger.error(f"Contract with address {contract_address} does not exist")
    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(f"An error occurred while getting BNB (BSC) balance for wallet id {wallet_id}: {str(e)}")

    return wallet_id


@shared_task
def get_arbitrum_token_balance(wallet_id: uuid):
    """
    Task to get the ETH (Arbitrum) balance for a wallet.
    """
    start_time = time.time()
    logger.info(f"Task started [get_arbitrum_token_balance] with ({wallet_id})")

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
                "decimals": 18,
                "previous_day": timezone.make_aware(datetime.now(), dt_timezone.utc),
                "previous_week": timezone.make_aware(datetime.now(), dt_timezone.utc),
                "previous_month": timezone.make_aware(datetime.now(), dt_timezone.utc),
            },
        )
        position, created = Position.objects.get_or_create(wallet=wallet, contract=contract)
        position.quantity = int(balance) / int(1000000000000000000)
        position.save()

        end_time = time.time()
        logger.info(f"Task completed [get_arbitrum_token_balance] in {(end_time - start_time)} seconds ({wallet_id})")

    except Contract.DoesNotExist:
        logger.error(f"Contract with address {contract_address} does not exist")
    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(f"An error occurred while getting ETH (Arbitrum) balance for wallet id {wallet_id}: {str(e)}")

    return wallet_id


@shared_task
def get_optimism_token_balance(wallet_id: uuid):
    """
    Task to get the ETH (Optimism) balance for a wallet.
    """
    start_time = time.time()
    logger.info(f"Task started [get_optimism_token_balance] with ({wallet_id})")

    try:
        blockchain = Blockchain.objects.filter(name="Optimism").first()
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
                "decimals": 18,
                "previous_day": timezone.make_aware(datetime.now(), dt_timezone.utc),
                "previous_week": timezone.make_aware(datetime.now(), dt_timezone.utc),
                "previous_month": timezone.make_aware(datetime.now(), dt_timezone.utc),
            },
        )
        position, created = Position.objects.get_or_create(wallet=wallet, contract=contract)
        position.quantity = int(balance) / int(1000000000000000000)
        position.save()

        end_time = time.time()
        logger.info(f"Task completed [get_optimism_token_balance] in {(end_time - start_time)} seconds ({wallet_id})")

    except Contract.DoesNotExist:
        logger.error(f"Contract with address {contract_address} does not exist")
    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(f"An error occurred while getting ETH (Optimism) balance for wallet id {wallet_id}: {str(e)}")

    return wallet_id


@shared_task
def aggregate_transactions_task(previous_return: int, wallet_id: uuid):
    """
    Task to aggregate transactions for a given wallet.
    """
    start_time = time.time()
    logger.info(f"Task started [aggregate_transactions_task] with ({wallet_id})")

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

            if DEBUG == True and transaction.hash == "0xff0a0c538e5ef106214bd0817af441e4ee9c468d35cc5e397f85bc852e40ffcb":
                logger.info(f"Transaction : {transactions_to_aggregate}")

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
            if DEBUG == True : logger.info(f"Transaction with hash {transaction_agg.hash} has been aggregated")
            transaction_agg.save()

    end_time = time.time()
    logger.info(f"Task completed [aggregate_transactions_task] in {(end_time - start_time)} seconds ({wallet_id})")
    return wallet_id


@shared_task
def calculate_cost_transaction_task(wallet_id: uuid):
    """
    Task to calculate the cost of transactions for a given wallet.
    """
    start_time = time.time()
    logger.info(f"Task started [aggregate_transactions_task] with ({wallet_id})")

    try:
        # Retrieve the wallet associated with the given wallet_id
        wallet = Wallet.objects.get(id=wallet_id)

        # Get all positions associated with the wallet
        positions = Position.objects.filter(wallet=wallet)
        transactions_by_wallet = []  # List to hold transactions related to the wallet

        # Loop through each position to collect transactions
        for position in positions:
            # Retrieve transactions for the current position, ordered by date (most recent first)
            transactions = position.transactions.all().order_by("-date")
            # Access the pre-fetched transactions
            transactions_by_wallet.extend(transactions)  # Extend the list with transactions

        # Get the fiat currency object for USD
        fiat = Fiat.objects.get(symbol="USD")

        # Filter Transaction objects by hashes from transactions_by_wallet and count occurrences of each hash.
        transaction_hashes = (
            Transaction.objects.filter(hash__in=[t.hash for t in transactions_by_wallet])
            .values("hash")  # Select only the 'hash' field.
            .annotate(count=Count("id"))  # Count how many times each hash appears.
        )
        # Create a dictionary mapping each hash to its count.
        hash_count_map = {item["hash"]: item["count"] for item in transaction_hashes}

        transactions_to_update = []  # List to hold transactions to update

        # Process each transaction collected
        for transaction in transactions_by_wallet:
            # Check if there are two transactions with the same hash (indicating a multi-part transaction)

            # Vanilla case
            if hash_count_map.get(transaction.hash, 0) == 2:
                # If two transactions exist, find the reference transaction
                transaction_ref = Transaction.objects.filter(hash=transaction.hash).exclude(id=transaction.id)
                # Get the position of the reference transaction
                position_ref = Position.objects.filter(id=transaction_ref[0].position.id).first()
                # Set the against_contract and cost_contract_based fields for the transaction
                transaction.against_contract = position_ref.contract
                transaction.cost_contract_based = transaction_ref[0].quantity

                # Normalize the symbol for the contract
                symbol = position_ref.contract.symbol.replace("WETH", "ETH")

                # Calculate the price based on the quantity
                if transaction.quantity == 0:
                    transaction.price_contract_based = 0
                else:
                    transaction.price_contract_based = transaction_ref[0].quantity / transaction.quantity

                # Retrieve the market data for the specified symbol and transaction date
                data = get_market_data(symbol, transaction.date)

                # Calculate the price and cost in fiat based on the market data
                transaction.price_fiat_based = transaction.price_contract_based * data.close if data else 0
                transaction.price = transaction.price_fiat_based
                transaction.cost_fiat_based = data.close * transaction.quantity if data else 0
                transaction.against_fiat = fiat  # Set the fiat currency for the transaction
                transactions_to_update.append(transaction)

                # Debug logging for a specific transaction hash
                if (
                    DEBUG == True
                    and transaction.hash == "0x9a59d837769a45950af2bb4dffa11c05dc6f76ae8b7ecb542bf80eca36c82e12"
                ):  # "0xe9ca6a317ef1f07f7560d459368dc73ae354d6ae8224b9877e29bb0d6f6f04f3":
                    calculate_cost_transaction_task_debug(transaction, symbol)

            else:

                # TODO : Need to be investigated
                symbol = transaction.position.contract.symbol.replace("WETH", "ETH")

                # Retrieve the market data for the specified symbol and transaction date
                data = get_market_data(symbol, transaction.date)

                # Calculate the price and cost in fiat based on the market data
                transaction.price_fiat_based = data.close if data else 0
                transaction.price = transaction.price_fiat_based
                transaction.cost_fiat_based = data.close * transaction.quantity if data else 0
                transaction.against_fiat = fiat  # Set the fiat currency for the transaction
                transactions_to_update.append(transaction)

                # Debug logging for a specific transaction hash
                # logger.info(f"Multi-part transaction for {transaction}")
                if (
                    DEBUG == True
                    and transaction.hash == "0xf9746d44db326689f36d6851f5fcda84109d518437f6fb6943231094ddbeb7ed"
                ):
                    # 0xff0a0c538e5ef106214bd0817af441e4ee9c468d35cc5e397f85bc852e40ffcb
                    calculate_cost_transaction_task_debug(transaction, symbol)
        
        # Save all-in-one bulk the transactions
        Transaction.objects.bulk_update(
            transactions_to_update,
            [
                "price",
                "against_contract",
                "cost_contract_based",
                "price_contract_based",
                "price_fiat_based",
                "cost_fiat_based",
                "against_fiat",
            ],
        )

        end_time = time.time()
        logger.info(
            f"Task completed [calculate_cost_transaction_task] in {(end_time - start_time)} seconds ({wallet_id})"
        )
        return wallet_id

    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(f"An error occurred while calculating transaction costs for wallet id {wallet_id} : {str(e)}")


@shared_task
def start_wallet_resync_task(wallet_id: uuid):
    """
    Task to update wallet process with STARTED sync status.
    """
    start_time = time.time()
    logger.info(f"Task started [start_wallet_resync_task] with ({wallet_id})")

    wallet = get_object_or_404(Wallet, id=wallet_id)
    wallet_process, created = WalletProcess.objects.get_or_create(wallet=wallet)
    wallet_process.resync_task_status = TaskStatusChoices.STARTED
    wallet_process.save()

    end_time = time.time()
    logger.info(f"Task completed [start_wallet_resync_task] in {(end_time - start_time)} seconds ({wallet_id})")

    return wallet_id


@shared_task
def start_wallet_download_task(wallet_id: uuid):
    """
    Task to update wallet process with STARTED download status.
    """
    start_time = time.time()
    logger.info(f"Task started [start_wallet_download_task] with ({wallet_id})")

    wallet = get_object_or_404(Wallet, id=wallet_id)
    wallet_process, created = WalletProcess.objects.get_or_create(wallet=wallet)
    wallet_process.download_task_status = TaskStatusChoices.STARTED
    wallet_process.save()

    end_time = time.time()
    logger.info(f"Task completed [start_wallet_download_task] in {(end_time - start_time)} seconds ({wallet_id})")

    return wallet_id


@shared_task
def finish_wallet_resync_task(previous_return: list, wallet_id: uuid):
    """
    Task to update wallet process with FINISHED sync status.
    """
    start_time = time.time()
    logger.info(f"Task started [finish_wallet_resync_task] with ({wallet_id})")

    wallet = get_object_or_404(Wallet, id=wallet_id)
    wallet_process, created = WalletProcess.objects.get_or_create(wallet=wallet)
    wallet_process.resync_task_status = TaskStatusChoices.FINISHED
    wallet_process.save()

    end_time = time.time()
    logger.info(f"Task completed [finish_wallet_resync_task] in {(end_time - start_time)} seconds ({wallet_id})")

    return wallet_id


@shared_task
def start_wallet_fulldownload_task(wallet_id: uuid):
    """
    Task to update wallet process with STARTED full download status.
    """
    start_time = time.time()
    logger.info(f"Task started [start_wallet_fulldownload_task] with ({wallet_id})")

    wallet = get_object_or_404(Wallet, id=wallet_id)
    wallet_process, created = WalletProcess.objects.get_or_create(wallet=wallet)
    wallet_process.full_download_task_status = TaskStatusChoices.STARTED
    wallet_process.save()

    end_time = time.time()
    logger.info(f"Task completed [start_wallet_fulldownload_task] in {(end_time - start_time)} seconds ({wallet_id})")

    return wallet_id


@shared_task
def finish_wallet_fulldownload_task(previous_return: list, wallet_id: uuid):
    """
    Task to update wallet process with FINISHED full download status.
    """
    start_time = time.time()
    logger.info(f"Task started [finish_wallet_fulldownload_task] with ({wallet_id})")

    wallet = get_object_or_404(Wallet, id=wallet_id)
    wallet_process, created = WalletProcess.objects.get_or_create(wallet=wallet)
    wallet_process.full_download_task_status = TaskStatusChoices.FINISHED
    wallet_process.save()

    end_time = time.time()
    logger.info(f"Task completed [finish_wallet_fulldownload_task] in {(end_time - start_time)} seconds ({wallet_id})")

    return wallet_id


@shared_task
def finish_wallet_download_task(previous_return: list, wallet_id: uuid):
    """
    Task to update wallet process with FINISHED download status.
    """
    start_time = time.time()
    logger.info(f"Task started [finish_wallet_download_task] with ({wallet_id})")

    wallet = get_object_or_404(Wallet, id=wallet_id)
    wallet_process, created = WalletProcess.objects.get_or_create(wallet=wallet)
    wallet_process.download_task_status = TaskStatusChoices.FINISHED
    wallet_process.save()

    end_time = time.time()
    logger.info(f"Task completed [finish_wallet_download_task] in {(end_time - start_time)} seconds ({wallet_id})")

    return wallet_id


@shared_task
def clean_contract_address_task(wallet_id: uuid):
    """
    Task to clean contract addresses.
    """
    start_time = time.time()
    logger.info(f"Task started [clean_contract_address_task] with ({wallet_id})")

    contracts = Contract.objects.all()
    for contract in contracts:
        contract.address = contract.address.lower()
        contract.save()

    end_time = time.time()
    logger.info(f"Task completed [clean_contract_address_task] in {(end_time - start_time)} seconds ({wallet_id})")

    return wallet_id


@shared_task
def clean_transaction_task(wallet_id: uuid):
    """
    Task to clean existing transaction information for a given wallet.
    """
    start_time = time.time()
    logger.info(f"Task started [clean_transaction_task] with ({wallet_id})")

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

    end_time = time.time()
    logger.info(f"Task completed [clean_transaction_task] in {(end_time - start_time)} seconds ({wallet_id})")

    return wallet_id


@shared_task
def calculate_running_quantity_transaction_task(wallet_id: uuid):
    """
    Task to calculate the running quantity of transactions in a wallet.
    """
    start_time = time.time()
    logger.info(f"Task started [calculate_running_quantity_transaction_task] with ({wallet_id})")

    try:
        wallet = Wallet.objects.get(id=wallet_id)
        positions = Position.objects.filter(wallet=wallet)

        DEBUG_LINK = False

        for position in positions:
            # Get all transactions associated with the current position, ordered by date
            transactions = position.transactions.all().order_by("date")

            # DEBUG_LINK = True if position.contract.address == "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39" else False

            running_quantity = 0
            buy_quantity = 0
            sell_quantity = 0
            total_cost = 0
            price_contract_based = 0
            price_fiat_based = 0
            price = 0

            if DEBUG == True : logger.info(f"Calculating running quantities for position id {position.id}.")

            for transaction in transactions:

                calculator = TransactionCalculator(transaction)
                cost_contract_based = calculator.calculate_cost_contract_based()
                cost_fiat_based = calculator.calculate_cost_fiat_based()
                cost_price_based = calculator.calculate_cost()

                if DEBUG == True and DEBUG_LINK == True:
                    logger.info(f"Calculating running quantities for transaction id {transaction.id}.")
                    logger.info(f"BEFORE calculation")
                    logger.info(f"transaction.date : {transaction.date}")
                    logger.info(f"cost_contract_based : {cost_contract_based}")
                    logger.info(f"cost_fiat_based : {cost_fiat_based}")
                    logger.info(f"cost_price_based : {cost_price_based}")
                    logger.info(f"transaction.type : {transaction.type}")
                    logger.info(f"running_quantity : {running_quantity}")
                    logger.info(f"price_contract_based : {price_contract_based}")
                    logger.info(f"price_fiat_based : {price_fiat_based}")
                    logger.info(f"transaction.quantity : {transaction.quantity}")

                if transaction.type == TypeTransactionChoices.IN:
                    # Reset total_cost and buy_quantity if we sold everything (or almost) on last transaction
                    if (running_quantity * price) < 1:
                        total_cost = cost_price_based
                        buy_quantity = transaction.quantity
                        transaction.status = StatusTransactionChoices.OPEN
                    else:
                        total_cost += cost_price_based
                        buy_quantity += transaction.quantity
                        transaction.status = StatusTransactionChoices.INCREASE
                    # Then update the running_quantity
                    running_quantity += transaction.quantity
                elif transaction.type == TypeTransactionChoices.OUT:
                    running_quantity -= transaction.quantity
                    sell_quantity += transaction.quantity
                    transaction.status = StatusTransactionChoices.CLOSE if (running_quantity * price) < 1 else StatusTransactionChoices.DIMINUTION
                    

                price_contract_based = transaction.price_contract_based
                price = transaction.price

                if DEBUG == True and DEBUG_LINK == True:
                    logger.info(f"AFTER calculation")
                    logger.info(f"running_quantity : {running_quantity}")
                    logger.info(f"buy_quantity : {buy_quantity}")
                    logger.info(f"sell_quantity : {sell_quantity}")
                    logger.info(f"total_cost : {total_cost}")

                # Update the running quantity for the transaction
                transaction.running_quantity = running_quantity
                transaction.buy_quantity = buy_quantity
                transaction.sell_quantity = sell_quantity
                transaction.total_cost = total_cost

                quantity_to_consider = transaction.quantity if transaction.status == StatusTransactionChoices.INCREASE else -transaction.quantity 
                transaction.status_value = transaction.quantity / (transaction.running_quantity - quantity_to_consider) * 100 if transaction.status == StatusTransactionChoices.DIMINUTION or transaction.status == StatusTransactionChoices.INCREASE else 0
                 
                # Save the transaction 
                transaction.save()

                calculator = TransactionCalculator(transaction)
                transaction.average_cost = calculator.calculate_average_cost()
                transaction.cost = calculator.calculate_cost()
                transaction.cost_fiat_based = calculator.calculate_cost_fiat_based()
                transaction.capital_gain = calculator.calculate_capital_gain()
                transaction.save()

            position.quantity = running_quantity
            position.save()

    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(f"An error occurred while calculating running quantities for wallet id {wallet_id}: {str(e)}")

    end_time = time.time()
    logger.info(
        f"Task completed [calculate_running_quantity_transaction_task] in {(end_time - start_time)} seconds ({wallet_id})"
    )

    return wallet_id


@shared_task
def get_price_from_market_task(previous_return: list, symbol_list: list[str]):
    """
    Task to get the market price of a list of symbols.
    """
    start_time = time.time()
    logger.info(f"Task started [get_price_from_market_task] with ({','.join(symbol_list)})")

    try:
        
        # Get contracts with a relative symbol in the symbol_list
        relative_contracts = Contract.objects.filter(relative_symbol__in=symbol_list)  

        # Remove them from the symbol list 
        for contract in relative_contracts: symbol_list.remove(contract.symbol)

        # Get the price for each of the symbols in the list
        prices = get_multiple_symbols_price(symbol_list)

        # Then update the price column in the Contract object
        for symbol, value in prices.items():
            try:
                if symbol == "USDC":
                    contracts = Contract.objects.filter(symbol__startswith=symbol)
                elif symbol == "ETH":
                    contracts = Contract.objects.filter(symbol__endswith=symbol)
                else:
                    contracts = Contract.objects.filter(symbol=symbol)

                if contracts.exists():
                    for contract in contracts:
                        contract.price = value["USD"]
                        contract.save()
            except Contract.DoesNotExist:
                print(f"Contract with symbol {symbol} does not exist.")

    except Exception as e:
        logger.error(
            f"An error occurred while getting the market price of a list of symbols {','.join(symbol_list)}: {str(e)}"
        )

    end_time = time.time()
    logger.info(
        f"Task completed [get_price_from_market_task] in {(end_time - start_time)} seconds ({','.join(symbol_list)})"
    )

    return symbol_list


@shared_task
def get_historical_price_from_market_task(previous_return: list, symbol: str):
    """
    Task to get the historical market price of a symbol.
    """
    start_time = time.time()
    logger.info(f"Task started [get_historical_price_from_market_task] with ({symbol})")

    try:

        delta = 30

        # Get historical date
        days_ago = timezone.now().date() - timedelta(days=delta)

        # Test if the data is already there
        data = MarketData.objects.filter(symbol=symbol, reference="USD", time__gte=days_ago)
        record_count = data.count()

        if record_count > delta:
            logger.info(
                f"Already have {delta} or more entries ({record_count}) starting from today. No need to fetch new data for symbol {symbol}."
            )
            return symbol

        data.delete()
        logger.info(f"Historical prices are cleaned up for symbol {symbol}.")

        # Get the historical prices for the symbol
        prices = get_daily_pair_ohlcv(symbol, delta)

        # Iterate over each data point
        for record in prices["Data"]["Data"]:
            time2 = timezone.make_aware(datetime.fromtimestamp(int(record["time"])), dt_timezone.utc)
            high = record["high"]
            low = record["low"]
            open_price = record["open"]
            close = record["close"]
            volume_from = record["volumefrom"]
            volume_to = record["volumeto"]

            # Create and save the MarketData object
            market_data = MarketData(
                symbol=symbol,
                reference="USD",
                time=time2,
                high=high,
                low=low,
                open=open_price,
                close=close,
                volume_from=volume_from,
                volume_to=volume_to,
            )
            market_data.save()

    except Exception as e:
        logger.error(f"An error occurred while getting the historical market price of a symbol {symbol}: {str(e)}")

    end_time = time.time()
    logger.info(
        f"Task completed [get_historical_price_from_market_task] in {(end_time - start_time)} seconds ({symbol})"
    )

    return symbol


@shared_task
def get_full_init_historical_price_from_market_task(previous_return: list, symbol_list: list[str]):
    """
    Task to get the full init historical market price of a symbol.
    """
    start_time = time.time()
    logger.info(f"Task started [get_full_init_historical_price_from_market_task] with ({','.join(symbol_list)})")

    for symbol in symbol_list:
        logger.info(f"Get full init market historical price for {symbol}.")
        try:
            delta = 1000

            # Get today's date
            days_ago = timezone.now().date() - timedelta(days=delta)

            # Test if the data is already there
            data = MarketData.objects.filter(symbol=symbol, reference="USD", time__gte=days_ago)
            data.delete()
            logger.info(f"Historical prices are cleaned up for symbol {symbol}.")

            # Get the historical prices for the symbol
            prices = get_daily_pair_ohlcv(symbol, delta)

            # Iterate over each data point
            for record in prices["Data"]["Data"]:
                time2 = timezone.make_aware(datetime.fromtimestamp(int(record["time"])), dt_timezone.utc)
                high = record["high"]
                low = record["low"]
                open_price = record["open"]
                close = record["close"]
                volume_from = record["volumefrom"]
                volume_to = record["volumeto"]

                # Create and save the MarketData object
                market_data = MarketData(
                    symbol=symbol,
                    reference="USD",
                    time=time2,
                    high=high,
                    low=low,
                    open=open_price,
                    close=close,
                    volume_from=volume_from,
                    volume_to=volume_to,
                )
                market_data.save()

        except Exception as e:
            logger.error(f"An error occurred while getting the historical market price of a symbol {symbol}: {str(e)}")

    end_time = time.time()
    logger.info(
        f"Task completed [get_full_init_historical_price_from_market_task] in {(end_time - start_time)} seconds ({','.join(symbol_list)})"
    )

    return symbol_list


@shared_task
def update_contract_information(previous_return: int, symbol: str):
    """
    Task to update contract information based on market data.
    """
    start_time = time.time()
    logger.info(f"Task started [update_contract_information] with ({symbol})")

    try:

        contracts = Contract.objects.filter(Q(symbol=symbol) | Q(relative_symbol=symbol))

        # Get the current time
        now = timezone.now()

        # Calculate the relative dates
        one_day_ago = now - relativedelta(days=1)
        one_week_ago = now - relativedelta(weeks=1)
        one_month_ago = now - relativedelta(months=1)

        previous_day_price = (
            MarketData.objects.filter(symbol=symbol, reference="USD", time__lte=one_day_ago).order_by("-time").first()
        )
        previous_week_price = (
            MarketData.objects.filter(symbol=symbol, reference="USD", time__lte=one_week_ago).order_by("-time").first()
        )
        previous_month_price = (
            MarketData.objects.filter(symbol=symbol, reference="USD", time__lte=one_month_ago)
            .order_by("-time")
            .first()
        )

        for contract in contracts:
            # previous day
            contract.previous_day_price = previous_day_price.close if previous_day_price else 0
            contract.previous_day = one_day_ago if previous_day_price else 0
            # previous week
            contract.previous_week_price = previous_week_price.close if previous_week_price else 0
            contract.previous_week = one_week_ago if previous_week_price else 0
            # previous month
            contract.previous_month_price = previous_month_price.close if previous_month_price else 0
            contract.previous_month = one_month_ago if previous_month_price else 0
            # save
            contract.save()

    except Contract.DoesNotExist:
        logger.error(f"Contract with symbol {symbol} does not exist")
    except Exception as e:
        logger.error(
            f"An error occurred while updating contract information based on market data for {symbol}: {str(e)}"
        )

    end_time = time.time()
    logger.info(f"Task completed [update_contract_information] in {(end_time - start_time)} seconds ({symbol})")

    return symbol


@shared_task
def calculate_blockchain_balance_task(previous_return: int, wallet_id: uuid):
    """
    Task to calculate the balance of a blockchain.
    """
    start_time = time.time()
    logger.info(f"Task started [calculate_blockchain_balance_task] with ({wallet_id})")

    try:

        blockchains = Blockchain.objects.all()

        # Calculate the total balance of all positions
        total_balance = (
            Position.objects.aggregate(total_balance=Sum(F("quantity") * F("contract__price")))["total_balance"] or 0
        )

        # Calculate the total balance for each blockchain
        blockchain_totals = (
            Position.objects.values(
                blockchain_id=F("contract__blockchain__id"),
                blockchain_name=F("contract__blockchain__name"),
                blockchain_icon=F("contract__blockchain__icon"),
            )
            .annotate(total_amount=Sum(F("quantity") * F("contract__price")))
            .order_by("-total_amount")
        )

        for blockchain in blockchains:
            for blockchain_calcul in blockchain_totals:
                if blockchain.id == blockchain_calcul["blockchain_id"]:
                    blockchain.balance = blockchain_calcul["total_amount"]
                    blockchain.progress_percentage = (
                        (blockchain_calcul["total_amount"] / total_balance * 100) if total_balance != 0 else 0
                    )
                    blockchain.save()

    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(f"An error occurred while calculating blockchain balance for wallet id {wallet_id}: {str(e)}")

    end_time = time.time()
    logger.info(
        f"Task completed [calculate_blockchain_balance_task] in {(end_time - start_time)} seconds ({wallet_id})"
    )

    return wallet_id


@shared_task
def calculate_wallet_balance_task(previous_return: int, wallet_id: uuid):
    """
    Task to calculate the balance of a wallet.
    """
    start_time = time.time()
    logger.info(f"Task started [calculate_wallet_balance_task] with ({wallet_id})")

    try:

        wallet = Wallet.objects.get(id=wallet_id)
        positions = Position.objects.filter(wallet=wallet)
        balance = 0
        total_capital_gain = 0
        total_unrealized_gain = 0

        for position in positions:
            position_calculator = PositionCalculator(position)
            contract_calculator = ContractCalculator(position.contract)

            position_amount = position_calculator.calculate_amount()

            position.amount = position_amount
            position.daily_price_delta = contract_calculator.calculate_daily_price_delta()
            position.weekly_price_delta = contract_calculator.calculate_weekly_price_delta()
            position.monthly_price_delta = contract_calculator.calculate_monthly_price_delta()

            last_transaction = Transaction.objects.filter(position=position).order_by("-date").first()
            reference_average_cost = (
                TransactionCalculator(last_transaction).calculate_average_cost()
                if last_transaction and last_transaction.running_quantity != 0
                else 0
            )

            position.progress_percentage = (
                position_amount / position.wallet.balance * 100 if position.wallet.balance != 0 else 0
            )

            unrealized_gain = (
                (position.contract.price - reference_average_cost) / reference_average_cost * 100
                if round(position_amount, 2) > 0 and reference_average_cost != 0
                else 0
            )
            total_unrealized_gain += unrealized_gain
            position.unrealized_gain = unrealized_gain

            # Calculate realized gain for the position
            capital_gain = sum(
                TransactionCalculator(transaction).calculate_capital_gain()
                for transaction in Transaction.objects.filter(position=position)
            )
            total_capital_gain += capital_gain
            position.capital_gain = capital_gain

            position.save()
            balance += position_amount

        wallet.balance = balance
        wallet.capital_gain = total_capital_gain
        wallet.unrealized_gain = total_unrealized_gain
        wallet.save()

    except Wallet.DoesNotExist:
        logger.error(f"Wallet with id {wallet_id} does not exist")
    except Exception as e:
        logger.error(f"An error occurred while calculating balance for wallet id {wallet_id}: {str(e)}")

    end_time = time.time()
    logger.info(f"Task completed [calculate_wallet_balance_task] in {(end_time - start_time)} seconds ({wallet_id})")

    return wallet_id
