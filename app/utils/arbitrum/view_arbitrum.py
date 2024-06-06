from app.services.arbitrum_scan import ArbitrumScanAPI


def ethereum_price(request):
    scan = ArbitrumScanAPI()
    price = scan.get_ethereum_price()
    return price

def account_balance_by_address(address):
    scan = ArbitrumScanAPI()
    balance = scan.get_account_balance_by_address(address)
    return balance

def normal_transactions_by_address(address):
    scan = ArbitrumScanAPI()
    transactions = scan.get_normal_transactions_by_address(address)
    return transactions

def erc20_transactions_by_wallet(address):
    scan = ArbitrumScanAPI()
    transactions = scan.get_erc20_token_transfer_events_by_address(address)
    return transactions