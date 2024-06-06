from app.services.polygon_scan import PolygonScanAPI

def matic_price():
    scan = PolygonScanAPI()
    price = scan.get_matic_price()
    return price

def account_balance_by_address(address):
    scan = PolygonScanAPI()
    balance = scan.get_account_balance_by_address(address)
    return balance

def normal_transactions_by_address(address):
    scan = PolygonScanAPI()
    transactions = scan.get_normal_transactions_by_address(address)
    return transactions

def erc20_transactions_by_wallet(address):
    scan = PolygonScanAPI()
    transactions = scan.get_erc20_token_transfer_events_by_address(address)
    return transactions
