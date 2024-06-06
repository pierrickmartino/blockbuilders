from app.services.bsc_scan import BSCScanAPI


def bnb_price(request):
    scan = BSCScanAPI()
    price = scan.get_bnb_price()
    return price

def account_balance_by_address(address):
    scan = BSCScanAPI()
    balance = scan.get_account_balance_by_address(address)
    return balance

def normal_transactions_by_address(address):
    scan = BSCScanAPI()
    transactions = scan.get_normal_transactions_by_address(address)
    return transactions

def erc20_transactions_by_wallet(address):
    scan = BSCScanAPI()
    transactions = scan.get_erc20_token_transfer_events_by_address(address)
    return transactions