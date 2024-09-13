from app.services.polygon_scan import PolygonScanAPI

def matic_price():
    api = PolygonScanAPI()
    price = api.get_matic_price()
    return price

def account_balance_by_address(address):
    api = PolygonScanAPI()
    balance = api.get_account_balance_by_address(address)
    return balance

def normal_transactions_by_address(address):
    api = PolygonScanAPI()
    transactions = api.get_normal_transactions_by_address(address)
    return transactions

def erc20_transactions_by_wallet(address):
    api = PolygonScanAPI()
    transactions = api.get_erc20_token_transfer_events_by_address(address)
    return transactions
