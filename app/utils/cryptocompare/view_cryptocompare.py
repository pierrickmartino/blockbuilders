from app.services.cryptocompare import CryptoCompareAPI


def get_multiple_symbols_price(symbols: list[str]):
    api = CryptoCompareAPI()
    prices = api.get_multiple_symbols_price(symbols)
    return prices
