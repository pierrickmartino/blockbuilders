from app.services.optimistic_scan import OptimismScanAPI


def ethereum_price(request):
    scan = OptimismScanAPI()
    price = scan.get_ethereum_price()
    return price

def account_balance_by_address(address):
    scan = OptimismScanAPI()
    balance = scan.get_account_balance_by_address(address)
    return balance

def normal_transactions_by_address(address):
    scan = OptimismScanAPI()
    transactions = scan.get_normal_transactions_by_address(address)
    return transactions

def erc20_transactions_by_wallet(address):
    scan = OptimismScanAPI()
    transactions = scan.get_erc20_token_transfer_events_by_address(address)
    return transactions
