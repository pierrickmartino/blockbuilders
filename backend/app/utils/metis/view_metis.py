from app.services.metis_scan import MetisScanAPI


def metis_price(request):
    api = MetisScanAPI()
    price = api.get_metis_price()
    return price

def account_balance_by_address(address):
    api = MetisScanAPI()
    balance = api.get_account_balance_by_address(address)
    return balance

def normal_transactions_by_address(address):
    api = MetisScanAPI()
    transactions = api.get_normal_transactions_by_address(address)
    return transactions

def erc20_transactions_by_wallet(address):
    api = MetisScanAPI()
    transactions = api.get_erc20_token_transfer_events_by_address(address)
    return transactions
