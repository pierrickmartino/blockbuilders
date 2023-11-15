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


class TimeStampModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Wallet(TimeStampModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_wallets"
    )
    address = models.CharField(max_length=255, default="")
    name = models.CharField(max_length=255, default="")
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)  # type: ignore
    description = models.TextField(blank=True, default="")

    class Meta:
        verbose_name = "Wallet"
        verbose_name_plural = "Wallets"

    def __str__(self):
        return f"{self.address}"


class Blockchain(models.Model):
    name = models.CharField(
        max_length=255, choices=[(tag.name, tag.value) for tag in Blockchain]
    )
    icon = models.CharField(max_length=255, default="")
    is_active = models.BooleanField()

    def __str__(self):
        return f"{self.name}"


class Fiat(models.Model):
    code = models.CharField(max_length=255)
    name = models.CharField(max_length=255, default="")

    class Meta:
        verbose_name = "Fiat"
        verbose_name_plural = "Fiats"

    def __str__(self):
        return f"{self.code}"


class Contract(models.Model):
    address = models.CharField(max_length=255, default="", db_index=True)
    blockchain = models.ForeignKey(
        Blockchain, on_delete=models.DO_NOTHING, related_name="blockchain_contracts"
    )
    name = models.CharField(max_length=255, default="")
    symbol = models.CharField(max_length=10, default="")
    price = models.DecimalField(max_digits=15, decimal_places=8, default=0)
    logo_uri = models.CharField(max_length=255, default="")
    decimals = models.IntegerField(default=0)
    # market_cap = models.DecimalField(max_digits=20, decimal_places=2, default=0) # type: ignore
    # volume = models.DecimalField(max_digits=20, decimal_places=10, default=0) # type: ignore

    class Meta:
        verbose_name = "Contract"
        verbose_name_plural = "Contracts"

    def __str__(self):
        return f"{self.name}"


class ContractCalculator:
    def __init__(self, contract):
        self.contract = contract


class ContractCalculator:
    def __init__(self, contract):
        self.contract = contract


class Position(TimeStampModel):
    contract = models.ForeignKey(
        Contract, on_delete=models.CASCADE, related_name="contract_positions"
    )
    wallet = models.ForeignKey(
        Wallet, on_delete=models.CASCADE, related_name="wallet_positions"
    )
    quantity = models.DecimalField(max_digits=32, decimal_places=18, default=0)
    amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    is_active = models.BooleanField()

    class Meta:
        verbose_name = "Position"
        verbose_name_plural = "Positions"

    def __str__(self):
        return f"{self.wallet} - {self.contract} - {self.quantity}"

    def mark_as_active(self):
        self.is_active = True
        self.save()

    def mark_as_inactive(self):
        self.is_active = False
        self.save()


class PositionCalculator:
    def __init__(self, position):
        self.position = position

    def total(self):
        return sum(i.amount for i in self.position.items.all())


class Transaction(TimeStampModel):
    position = models.ForeignKey(
        Position, on_delete=models.CASCADE, related_name="position_transactions"
    )
    type = models.CharField(
        max_length=3, choices=[(tag.name, tag.value) for tag in TypeTransaction]
    )
    quantity = models.DecimalField(max_digits=32, decimal_places=18, default=0)
    running_quantity = models.DecimalField(max_digits=32, decimal_places=18, default=0)
    buy_quantity = models.DecimalField(max_digits=32, decimal_places=18, default=0)
    sell_quantity = models.DecimalField(max_digits=32, decimal_places=18, default=0)
    price = models.DecimalField(max_digits=15, decimal_places=8, default=0)
    price_contract_based = models.DecimalField(max_digits=15, decimal_places=8, default=0)
    cost = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    cost_contract_based = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_cost_contract_based = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    avg_cost_contract_based = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    date = models.DateTimeField(db_index=True)
    comment = models.TextField(default="")
    hash = models.CharField(max_length=255, default="", db_index=True)
    against_contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name="counterpart_transactions",
        blank=True,
        null=True,
    )
    against_fiat = models.ForeignKey(
        Fiat,
        on_delete=models.CASCADE,
        related_name="counterpart_fiats",
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"

    def __str__(self):
        return f"{self.hash} - {self.type} {self.quantity} ({self.cost}) - {self.date}"


class TransactionCalculator:
    def __init__(self, transaction):
        self.transaction = transaction
