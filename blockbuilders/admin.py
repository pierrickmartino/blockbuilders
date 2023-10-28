from django.contrib import admin

from blockbuilders.models import Blockchain, Wallet

class Wallet_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "address",
    )

class Blockchain_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
    )

admin.site.register(Wallet, Wallet_Admin)
admin.site.register(Blockchain, Blockchain_Admin)