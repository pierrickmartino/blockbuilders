import requests
from blockbuilders.settings.base import CCOMPARE_API_KEY

class CryptoCompareAPI:
    base_url = "https://min-api.cryptocompare.com/data"
    data_url = "https://data-api.cryptocompare.com"

    def __init__(self, api_key=None):
        self.api_key = api_key or CCOMPARE_API_KEY

    
    def get_multiple_symbols_price(self, symbols: list[str]):
        self.base_url = self.base_url + "/pricemulti"
        params = {
            "fsyms": ','.join(symbols),
            "tsyms": "USD",
            "api_key": self.api_key,
        }
        response = requests.get(self.base_url, params=params)
        return self._handle_response(response)
    
    def get_daily_pair_ohlcv(self, symbol: str, limit: int):
        self.base_url = self.base_url + "/v2/histoday"
        params = {
            "fsym": symbol,
            "tsym": "USD",
            "limit": limit,
            "api_key": self.api_key,
        }
        response = requests.get(self.base_url, params=params)
        return self._handle_response(response)
    
    def get_asset_by_symbol(self, symbol: str):
        self.base_url = self.data_url + "/asset/v1/data/by/symbol"
        params = {
            "asset_symbol": symbol,
            "api_key": self.api_key,
        }
        response = requests.get(self.base_url, params=params)
        return self._handle_response(response)

    def _handle_response(self, response):
        if response.status_code != 200:
            return {"error": "API request failed"}
        # data = response.json()
        # if data["status"] != "1":
        #     return {"error": data.get("message", "Unknown error")}
        return response.json()