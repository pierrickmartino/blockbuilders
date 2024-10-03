from rest_framework import serializers
from .models import Wallet, Fiat, Blockchain, Contract, Position, Transaction, MarketData, UserSetting


class FiatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fiat
        fields = "__all__"


class BlockchainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blockchain
        fields = "__all__"


class ContractSerializer(serializers.ModelSerializer):
    blockchain = BlockchainSerializer(read_only=True)

    class Meta:
        model = Contract
        fields = [
            "id",
            "name",
            "symbol",
            "relative_symbol",
            "address",
            "logo_uri",
            "decimals",
            "price",
            "previous_day_price",
            "previous_week_price",
            "previous_month_price",
            "previous_day",
            "previous_week",
            "previous_month",
            "category",
            "blockchain",
        ]


class MarketDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketData
        fields = "__all__"


class UserSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSetting
        fields = "__all__"


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ["id", "user", "address", "name", "balance", "description"]
        read_only_fields = ["user"]


class PositionSerializer(serializers.ModelSerializer):
    wallet = WalletSerializer(read_only=True)
    contract = ContractSerializer(read_only=True)

    class Meta:
        model = Position
        fields = [
            "id",
            "quantity",
            "amount",
            "avg_cost",
            "total_cost",
            "unrealized_gain",
            "capital_gain",
            "created_at",
            "daily_price_delta",
            "weekly_price_delta",
            "monthly_price_delta",
            "progress_percentage",
            "contract",
            "wallet",
        ]


class TransactionSerializer(serializers.ModelSerializer):
    position = PositionSerializer(read_only=True)
    against_contract = ContractSerializer(read_only=True)
    against_fiat = FiatSerializer(read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id",
            "type",
            "quantity",
            "date",
            "comment",
            "hash",
            "price",
            "running_quantity",
            "buy_quantity",
            "sell_quantity",
            "cost",
            "average_cost",
            "total_cost",
            "capital_gain",
            "against_contract",
            "against_fiat",
            "position",
        ]
