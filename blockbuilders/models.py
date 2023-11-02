from enum import Enum
from django.db import models
from django.contrib.auth.models import User

class Blockchain(Enum):
    POLYGON = "Polygon"

class Wallet(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="user_wallets")
    address = models.CharField(max_length=255) 
    name = models.CharField(max_length=255, blank=True, null=True)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0) # type: ignore
    description = models.TextField(blank=True)
    sys_creation_date = models.DateTimeField(auto_now_add=True)
    sys_update_date = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Wallet"
        verbose_name_plural = "Wallets"
        ordering = ("balance", "name")

    def __str__(self):
        return f"{self.address}"
    
class Blockchain(models.Model):
    name = models.CharField(max_length=255, choices=[(tag.name, tag.value) for tag in Blockchain])
    icon = models.CharField(max_length=255)
    is_active = models.BooleanField()
    main_url = models.CharField(max_length=255)
    explorer_url = models.CharField(max_length=255)
    contract_url = models.CharField(max_length=255)
    transaction_url = models.CharField(max_length=255)
    sys_creation_date = models.DateTimeField(auto_now_add=True)
    sys_update_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"
    
class Contract(models.Model):
    address = models.CharField(max_length=255) 
    blockchain = models.ForeignKey(Blockchain, on_delete=models.DO_NOTHING, related_name="blockchain_contracts")
    name = models.CharField(max_length=255, blank=True, null=True)
    symbol = models.CharField(max_length=10, blank=True, null=True)
    price = models.DecimalField(max_digits=15, decimal_places=8, default=0) # type: ignore
    # market_cap = models.DecimalField(max_digits=20, decimal_places=2, default=0) # type: ignore
    # volume = models.DecimalField(max_digits=20, decimal_places=10, default=0) # type: ignore
    sys_creation_date = models.DateTimeField(auto_now_add=True)
    sys_update_date = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contract"
        verbose_name_plural = "Contracts"
        ordering = ("symbol", "name",)
		
    def __str__(self):
        return f"{self.name}"
    
class ContractLink(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.DO_NOTHING, related_name="contract_contractlinks")
    wallet = models.ForeignKey(Wallet, on_delete=models.DO_NOTHING, related_name="wallet_contractlinks")
    is_active = models.BooleanField()
    sys_creation_date = models.DateTimeField(auto_now_add=True)
    sys_update_date = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "ContractLink"
        verbose_name_plural = "ContractLinks"
		
    def __str__(self):
        return f"{self.wallet} - {self.contract}"