from django.contrib import admin

from app.models import Blockchain, User, Wallet, Contract, Position, Transaction, Fiat, WalletProcess, ContractProcess, UserSetting, MarketData

class User_Admin(admin.ModelAdmin):
    list_display = ("id", "name", "email")

class Wallet_Admin(admin.ModelAdmin):
    list_display = ("id", "address", "name", "balance", "description")


class Wallet_Process_Admin(admin.ModelAdmin):
    list_display = ("wallet", "download_task", "full_download_task", "resync_task", "delete_task")

class Contract_Process_Admin(admin.ModelAdmin):
    list_display = ("contract", "download_task" )


class Fiat_Admin(admin.ModelAdmin):
    list_display = ("id", "symbol", "name", "exchange_rate")


class Blockchain_Admin(admin.ModelAdmin):
    list_display = ("id", "name", "icon")


class Contract_Admin(admin.ModelAdmin):
    list_filter = ["blockchain", "category", "symbol", "relative_symbol"]
    list_display = (
        "id",
        "blockchain",
        "category",
        "name",
        "address",
        "symbol",
        "relative_symbol",
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
    list_filter = ["wallet", "contract"]
    list_display = (
        "id",
        "wallet",
        "contract",
        "quantity",
        "average_cost",
        "total_cost",
        "unrealized_gain",
        "unrealized_gain_percentage",
        "capital_gain",
    )


class Transaction_Admin(admin.ModelAdmin):
    list_filter = ["date", "type"]
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
        "status",
        "status_value"
    )

class MarketData_Admin(admin.ModelAdmin):
    list_filter = ["symbol", "time"]
    list_display = (
        "id",
        "symbol",
        "reference",
        "time",
        "high",
        "low",
        "open",
        "close",
        "volume_from",
        "volume_to",
    )


class UserSetting_Admin(admin.ModelAdmin):
    list_filter = ["user"]
    list_display = (
        "id",
        "user",
        "show_positions_above_threshold",
        "show_only_secure_contracts",
    )

admin.site.register(User, User_Admin)
admin.site.register(UserSetting, UserSetting_Admin)
admin.site.register(Wallet, Wallet_Admin)
admin.site.register(WalletProcess, Wallet_Process_Admin)
admin.site.register(ContractProcess, Contract_Process_Admin)
admin.site.register(Blockchain, Blockchain_Admin)
admin.site.register(Fiat, Fiat_Admin)
admin.site.register(Contract, Contract_Admin)
admin.site.register(Position, Position_Admin)
admin.site.register(Transaction, Transaction_Admin)
admin.site.register(MarketData, MarketData_Admin)