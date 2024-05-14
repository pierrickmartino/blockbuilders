from django.contrib import admin

from app.models import Blockchain, Wallet, Contract, Position, Transaction, Fiat, WalletProcess, UserSetting
from app.utils.polygon.models_polygon import Polygon_ERC20_Raw

class Polygon_ERC20_Raw_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "blockNumber",
        "timeStamp",
        "hash",
        "nonce",
        "blockHash",
        "fromAddress",
        "toAddress",
        "contractAddress",
        "value",
        "tokenName",
        "tokenDecimal",
        "transactionIndex",
        "gas",
        "gasPrice",
        "gasUsed",
        "cumulativeGasUsed",
    )

class Wallet_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "address",
        "name",
    )

class Wallet_Process_Admin(admin.ModelAdmin):
    list_display = (
        "wallet",
        "download_task",
        "resync_task",
        "delete_task",
    )

class Fiat_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "code",
        "name",
    )

class Blockchain_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "icon",
    )

class Contract_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "address",
        "symbol",
        "previous_day",
        "previous_week",
        "previous_month"
    )

class Position_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "wallet",
        "contract",
        "is_active",
        "quantity",
        "amount",
        "total_buy_quantity",
        "avg_cost",
        "total_cost",
        "unrealized_gain",
        "unrealized_gain_percentage",
        "capital_gain"
    )

class Transaction_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "position",
        "type",
        "quantity",
        "running_quantity",
        "buy_quantity",
        "sell_quantity",
        "price",
        "price_contract_based",
        "cost",
        "cost_contract_based",
        "avg_cost_contract_based",
        "capital_gain_contract_based",
        "capital_gain_percentage_contract_based",
        "date",
        "hash",
        "against_contract",
        "against_fiat",
    )

class UserSetting_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "show_positions_above_threshold",
    )

admin.site.register(UserSetting, UserSetting_Admin)
admin.site.register(Wallet, Wallet_Admin)
admin.site.register(WalletProcess, Wallet_Process_Admin)
admin.site.register(Blockchain, Blockchain_Admin)
admin.site.register(Fiat, Fiat_Admin)
admin.site.register(Contract, Contract_Admin)
admin.site.register(Position, Position_Admin)
admin.site.register(Transaction, Transaction_Admin)
admin.site.register(Polygon_ERC20_Raw, Polygon_ERC20_Raw_Admin)