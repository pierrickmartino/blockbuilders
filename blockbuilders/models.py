from enum import Enum
from django.db import models
from django.contrib.auth.models import User

class Blockchain(Enum):
    POLYGON = "Polygon"

class TypeTransaction(Enum):
    BUY = "Buy"
    SEL = "Sell"
    DEP = "Deposit"
    WTH = "Withdrawal"

class Wallet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_wallets")
    address = models.CharField(max_length=255, default="") 
    name = models.CharField(max_length=255, default="")
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0) # type: ignore
    description = models.TextField(blank=True, default="")
    sys_creation_date = models.DateTimeField(auto_now_add=True)
    sys_update_date = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Wallet"
        verbose_name_plural = "Wallets"

    def __str__(self):
        return f"{self.address}"
    
class Blockchain(models.Model):
    name = models.CharField(max_length=255, choices=[(tag.name, tag.value) for tag in Blockchain])
    icon = models.CharField(max_length=255, default="")
    is_active = models.BooleanField()
    # main_url = models.CharField(max_length=255, default="")
    # explorer_url = models.CharField(max_length=255, default="")
    # contract_url = models.CharField(max_length=255, default="")
    # transaction_url = models.CharField(max_length=255, default="")
    sys_creation_date = models.DateTimeField(auto_now_add=True)
    sys_update_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"
    
class Contract(models.Model):
    address = models.CharField(max_length=255, default="", db_index=True) 
    blockchain = models.ForeignKey(Blockchain, on_delete=models.DO_NOTHING, related_name="blockchain_contracts")
    name = models.CharField(max_length=255, default="")
    symbol = models.CharField(max_length=10, default="")
    price = models.DecimalField(max_digits=15, decimal_places=8, default=0)
    logo_uri = models.CharField(max_length=255, default="")
    decimals = models.IntegerField(default=0)
    # market_cap = models.DecimalField(max_digits=20, decimal_places=2, default=0) # type: ignore
    # volume = models.DecimalField(max_digits=20, decimal_places=10, default=0) # type: ignore
    sys_creation_date = models.DateTimeField(auto_now_add=True)
    sys_update_date = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contract"
        verbose_name_plural = "Contracts"
		
    def __str__(self):
        return f"{self.name}"

class ContractCalculator():
    def __init__(self, contract):
        self.contract = contract

class ContractLink(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="contract_contractlinks")
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="wallet_contractlinks")
    is_active = models.BooleanField()
    sys_creation_date = models.DateTimeField(auto_now_add=True)
    sys_update_date = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "ContractLink"
        verbose_name_plural = "ContractLinks"
		
    def __str__(self):
        return f"{self.wallet} - {self.contract}"
    
    def mark_as_active(self):
        self.is_active = True
        self.save()
    
    def mark_as_inactive(self):
        self.is_active = False
        self.save()

class ContractLinkCalculator():
    def __init__(self, contract_link):
        self.contract_link = contract_link

class ContractCalculator():
    def __init__(self, contract):
        self.contract = contract

class Position(models.Model):
    contract_link = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="contractlink_positions")
    quantity = models.DecimalField(max_digits=32, decimal_places=18)
    amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    sys_creation_date = models.DateTimeField(auto_now_add=True)
    sys_update_date = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Position"
        verbose_name_plural = "Positions"
		
    def __str__(self):
        return f"{self.contract_link} - {self.quantity}"

class PositionCalculator():
    def __init__(self, position):
        self.position = position
    def total(self):
        return sum(i.amount for i in self.position.items.all())

class Transaction(models.Model):
    position = models.ForeignKey(Position, on_delete=models.CASCADE, related_name="position_transactions")
    type = models.CharField(max_length=3, choices=[(tag.name, tag.value) for tag in TypeTransaction])
    quantity = models.DecimalField(max_digits=18, decimal_places=8)
    price = models.DecimalField(max_digits=15, decimal_places=8)
    cost = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    date = models.DateTimeField(db_index=True)
    comment = models.TextField(default="")
    hash = models.CharField(max_length=255, default="", db_index=True)
    sys_creation_date = models.DateTimeField(auto_now_add=True)
    sys_update_date = models.DateTimeField(auto_now=True)

    # Meta and String
    class Meta:
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"

    def __str__(self):
        return f"{self.hash} - {self.type} {self.quantity} ({self.cost}) - {self.date}"
    
class TransactionCalculator():
    def __init__(self, transaction):
        self.transaction = transaction
    