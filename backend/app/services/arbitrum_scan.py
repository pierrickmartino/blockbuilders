import requests
from blockbuilders.settings.base import ARBISCAN_API_KEY


class ArbitrumScanAPI:
    base_url = "https://api.arbiscan.io/api"

    def __init__(self, api_key=None):
        self.api_key = api_key or ARBISCAN_API_KEY

    def get_ethereum_price(self):
        params = {
            "module": "stats",
            "action": "ethprice",
            "apikey": self.api_key,
        }
        response = requests.get(self.base_url, params=params)
        return self._handle_response(response)

    def get_account_balance_by_address(self, address):
        params = {
            "module": "account",
            "action": "balance",
            "address": address,
            "apikey": self.api_key,
        }
        response = requests.get(self.base_url, params=params)
        return self._handle_response(response)

    def get_normal_transactions_by_address(self, address):
        params = {
            "module": "account",
            "action": "txlist",
            "address": address,
            "apikey": self.api_key,
        }
        response = requests.get(self.base_url, params=params)
        return self._handle_response(response)

    def get_erc20_token_transfer_events_by_address(self, address):
        params = {
            "module": "account",
            "action": "tokentx",
            "address": address,
            "startblock": "0",
            "endblock": "99999999",
            "sort": "asc",
            "apikey": self.api_key,
        }
        response = requests.get(self.base_url, params=params)
        return self._handle_response(response)

    def _handle_response(self, response):
        if response.status_code != 200:
            return {"error": "API request failed"}
        data = response.json()
        if data["status"] != "1":
            return {"error": data.get("message", "Unknown error")}
        return data["result"]
