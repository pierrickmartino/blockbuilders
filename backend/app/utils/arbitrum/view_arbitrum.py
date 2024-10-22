from app.services.arbitrum_scan import ArbitrumScanAPI


def ethereum_price(request):
    api = ArbitrumScanAPI()
    price = api.get_ethereum_price()
    return price

def account_balance_by_address(address):
    api = ArbitrumScanAPI()
    balance = api.get_account_balance_by_address(address)
    return balance

def normal_transactions_by_address(address):
    api = ArbitrumScanAPI()
    transactions = api.get_normal_transactions_by_address(address)
    return transactions

def erc20_transactions_by_wallet(address):
    api = ArbitrumScanAPI()
    transactions = api.get_erc20_token_transfer_events_by_address(address)
    return transactions