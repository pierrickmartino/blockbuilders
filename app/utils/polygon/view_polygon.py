from blockbuilders.settings import POLYGONSCAN_API_KEY
from polygonscan import PolygonScan


def get_erc20_transactions_by_wallet_and_contract(wallet_address, contract_address):
    with PolygonScan(POLYGONSCAN_API_KEY, False) as matic:  # type: ignore
        result = (
            matic.get_erc20_token_transfer_events_by_address_and_contract_paginated(
                address=wallet_address,
                contract_address=contract_address,
                sort="asc",
                page="1",
                offset="999",
            )
        )
        return result


def get_erc20_transactions_by_wallet(wallet_address):
    with PolygonScan(POLYGONSCAN_API_KEY, False) as matic:  # type: ignore
        result = matic.get_erc20_token_transfer_events_by_address(
            address=wallet_address,
            startblock=0,
            endblock=99999999,
            sort="asc",
        )
        return result


def get_balance_by_wallet_and_contract(wallet_address, contract_address):
    with PolygonScan(POLYGONSCAN_API_KEY, False) as matic:  # type: ignore
        result = matic.get_acc_balance_by_token_and_contract_address(
            address=wallet_address,
            contract_address=contract_address,
        )
        return result


def get_matic_price():
    with PolygonScan(POLYGONSCAN_API_KEY, False) as matic:  # type: ignore
        result = matic.get_matic_last_price()
        return result


def get_matic_balance_by_wallet(wallet_address):
    with PolygonScan(POLYGONSCAN_API_KEY, False) as matic:  # type: ignore
        result = matic.get_matic_balance(address=wallet_address)

    return result
