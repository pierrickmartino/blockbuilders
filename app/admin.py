from django.contrib import admin

from app.models import Blockchain, Wallet, Contract, Position, Transaction, Fiat, WalletProcess, UserSetting
from app.utils.arbitrum.models_arbitrum import Arbitrum_ERC20_Raw
from app.utils.bsc.models_bsc import BSC_BEP20_Raw
from app.utils.optimism.models_optimism import Optimism_ERC20_Raw
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

class Arbitrum_ERC20_Raw_Admin(admin.ModelAdmin):
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

class BSC_BEP20_Raw_Admin(admin.ModelAdmin):
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

class Optimism_ERC20_Raw_Admin(admin.ModelAdmin):
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
    list_display = ("id", "address", "name", "balance", "description")


class Wallet_Process_Admin(admin.ModelAdmin):
    list_display = ("wallet", "download_task", "resync_task", "delete_task")


class Fiat_Admin(admin.ModelAdmin):
    list_display = ("id", "symbol", "name", "exchange_rate")


class Blockchain_Admin(admin.ModelAdmin):
    list_display = ("id", "name", "icon")


class Contract_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "address",
        "symbol",
        "decimals",
        "price",
        "previous_day_price",
        "previous_week_price",
        "previous_month_price",
        "previous_day",
        "previous_week",
        "previous_month",
    )


class Position_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "wallet",
        "contract",
        "quantity",
        "amount",
        "avg_cost",
        "total_cost",
        "unrealized_gain",
        "unrealized_gain_percentage",
        "capital_gain",
    )


class Transaction_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "position",
        "type",
        "price",
        "date",
        "comment",
        "hash",
        "price_contract_based",
        "price_fiat_based",
        "running_quantity",
        "buy_quantity",
        "sell_quantity",
        "total_cost_contract_based",
        "total_cost_fiat_based",
        "against_contract",
        "against_fiat",
    )


class UserSetting_Admin(admin.ModelAdmin):
    list_display = ("id", "user", "show_positions_above_threshold")


admin.site.register(UserSetting, UserSetting_Admin)
admin.site.register(Wallet, Wallet_Admin)
admin.site.register(WalletProcess, Wallet_Process_Admin)
admin.site.register(Blockchain, Blockchain_Admin)
admin.site.register(Fiat, Fiat_Admin)
admin.site.register(Contract, Contract_Admin)
admin.site.register(Position, Position_Admin)
admin.site.register(Transaction, Transaction_Admin)
admin.site.register(Polygon_ERC20_Raw, Polygon_ERC20_Raw_Admin)
admin.site.register(BSC_BEP20_Raw, BSC_BEP20_Raw_Admin)
admin.site.register(Optimism_ERC20_Raw, Optimism_ERC20_Raw_Admin)
admin.site.register(Arbitrum_ERC20_Raw, Arbitrum_ERC20_Raw_Admin)