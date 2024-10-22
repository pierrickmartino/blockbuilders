from app.services.cryptocompare import CryptoCompareAPI


def get_multiple_symbols_price(symbols: list[str]):
    api = CryptoCompareAPI()
    prices = api.get_multiple_symbols_price(symbols)
    return prices

def get_daily_pair_ohlcv(symbol: str, limit: int):
    api = CryptoCompareAPI()
    prices = api.get_daily_pair_ohlcv(symbol, limit)
    return prices