from django.contrib import admin

from blockbuilders.models import Blockchain, Wallet, Contract, ContractLink, Position, Transaction

class Wallet_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "address",
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
    )

class ContractLink_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "wallet",
        "contract",
        "is_active",
    )

class Position_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "contract_link",
        "quantity",
        "amount",
    )

class Transaction_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "position",
        "type",
        "quantity",
        "price",
        "cost",
        "date",
        "hash",
    )

admin.site.register(Wallet, Wallet_Admin)
admin.site.register(Blockchain, Blockchain_Admin)
admin.site.register(Contract, Contract_Admin)
admin.site.register(ContractLink, ContractLink_Admin)
admin.site.register(Position, Position_Admin)
admin.site.register(Transaction, Transaction_Admin)