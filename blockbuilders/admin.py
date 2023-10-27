from django.contrib import admin

from blockbuilders.models import Wallet

# Register your models here.
class Wallet_Admin(admin.ModelAdmin):
    list_display = (
        "id",
        "address",
    )

admin.site.register(Wallet, Wallet_Admin)