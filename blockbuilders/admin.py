from django.contrib import admin

from blockbuilders.models import Blockchain, Wallet, Contract

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

admin.site.register(Wallet, Wallet_Admin)
admin.site.register(Blockchain, Blockchain_Admin)
admin.site.register(Contract, Contract_Admin)
