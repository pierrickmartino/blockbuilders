from app.services.bsc_scan import BSCScanAPI


def bnb_price(request):
    api = BSCScanAPI()
    price = api.get_bnb_price()
    return price

def account_balance_by_address(address):
    api = BSCScanAPI()
    balance = api.get_account_balance_by_address(address)
    return balance

def normal_transactions_by_address(address):
    api = BSCScanAPI()
    transactions = api.get_normal_transactions_by_address(address)
    return transactions

def bep20_transactions_by_wallet(address):
    api = BSCScanAPI()
    transactions = api.get_bep20_token_transfer_events_by_address(address)
    return transactions