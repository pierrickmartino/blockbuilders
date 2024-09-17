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
    class Meta:
        model = Contract
        fields = "__all__"


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"


class MarketDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketData
        fields = "__all__"


class UserSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSetting
        fields = "__all__"


class PositionSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)

    class Meta:
        model = Position
        fields = ["id", "quantity", "avg_cost", "total_cost", "unrealized_gain", "capital_gain", "transactions"]


class WalletSerializer(serializers.ModelSerializer):
    positions = PositionSerializer(many=True, read_only=True)

    class Meta:
        model = Wallet
        fields = ["id", "user", "address", "name", "balance", "description", "positions"]
