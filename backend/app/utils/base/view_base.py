from app.services.base_scan import BaseScanAPI


def ethereum_price(request):
    api = BaseScanAPI()
    price = api.get_ethereum_price()
    return price

def account_balance_by_address(address):
    api = BaseScanAPI()
    balance = api.get_account_balance_by_address(address)
    return balance

def normal_transactions_by_address(address):
    api = BaseScanAPI()
    transactions = api.get_normal_transactions_by_address(address)
    return transactions

def erc20_transactions_by_wallet(address):
    api = BaseScanAPI()
    transactions = api.get_erc20_token_transfer_events_by_address(address)
    return transactions
