from datetime import datetime
from enum import Enum
from django.db import models
from django.contrib.auth.models import User
import uuid


# Using TextChoices for better enumeration
class BlockchainChoices(models.TextChoices):
    POLYGON = "Polygon", "Polygon"
    BSC = "BSC", "BSC"
    METIS = "Metis", "Metis"
    ARBITRUM = "Arbitrum", "Arbitrum"
    OPTIMISTIC = "Optimism", "Optimism"


class TypeTransactionChoices(models.TextChoices):
    IN = "IN", "IN"
    OUT = "OUT", "OUT"


# Abstract model for timestamp fields
class TimeStampModel(models.Model):
    created_at = models.DateTimeField(
        auto_now_add=True
    )  # Automatically set the field to now when the object is first created
    updated_at = models.DateTimeField(
        auto_now=True
    )  # Automatically set the field to now every time the object is saved

    class Meta:
        abstract = True  # This model will not be used to create any database table


# Model to represent fiat currencies
class Fiat(models.Model):
    name = models.CharField(max_length=255, unique=True)  # Unique name of the fiat currency
    symbol = models.CharField(max_length=50, unique=True)  # Unique symbol of the fiat currency
    exchange_rate = models.DecimalField(
        max_digits=15, decimal_places=8, default=1
    )  # Exchange rate of the fiat currency

    class Meta:
        verbose_name = "Fiat"
        verbose_name_plural = "Fiats"

    def __str__(self):
        return f"{self.name} ({self.symbol})"


# Model to represent a cryptocurrency wallet
class Wallet(TimeStampModel):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="wallets"
    )  # Reference to the user who owns the wallet
    address = models.CharField(max_length=255, unique=True)  # Unique address of the wallet
    name = models.CharField(max_length=255)  # Name of the wallet
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)  # Balance of the wallet
    description = models.TextField(blank=True, default="")  # Description of the wallet

    class Meta:
        verbose_name = "Wallet"
        verbose_name_plural = "Wallets"
        indexes = [
            models.Index(fields=["user", "address"]),  # Index for frequent queries
        ]

    def __str__(self):
        return self.address


# Model to manage processes related to a wallet
class WalletProcess(TimeStampModel):
    wallet = models.OneToOneField(
        Wallet,
        on_delete=models.CASCADE,
        primary_key=True,
    )  # One-to-one relationship with Wallet
    download_task = models.UUIDField(default=uuid.uuid4)  # UUID for download task
    resync_task = models.UUIDField(default=uuid.uuid4)  # UUID for resync task
    delete_task = models.UUIDField(default=uuid.uuid4)  # UUID for delete task

    class Meta:
        verbose_name = "Wallet Process"
        verbose_name_plural = "Wallets Processes"

    def __str__(self):
        return f"{self.wallet} processes"


# Model to represent a blockchain
class Blockchain(models.Model):
    name = models.CharField(
        max_length=255,
        choices=BlockchainChoices.choices,
        unique=True,  # Ensuring unique blockchain names
    )
    icon = models.CharField(max_length=255, default="")  # Icon for the blockchain
    is_active = models.BooleanField(default=True)  # Whether the blockchain is active
    gecko_id = models.CharField(max_length=255, default="")  # Gecko ID for the blockchain
    gecko_chain_identifier = models.CharField(max_length=255, default="")  # Gecko chain identifier
    gecko_name = models.CharField(max_length=255, default="")  # Gecko name
    gecko_shortname = models.CharField(max_length=255, default="")  # Gecko short name
    gecko_native_coin_id = models.CharField(max_length=255, default="")  # Gecko native coin id

    class Meta:
        verbose_name = "Blockchain"
        verbose_name_plural = "Blockchains"

    def __str__(self):
        return self.name


# Model to represent a smart contract
class Contract(models.Model):
    blockchain = models.ForeignKey(
        Blockchain, on_delete=models.CASCADE, related_name="contracts"
    )  # Reference to the blockchain
    name = models.CharField(max_length=255)  # Name of the contract
    symbol = models.CharField(max_length=50)  # Symbol of the contract
    address = models.CharField(max_length=255)  # Unique address of the contract
    logo_uri = models.CharField(max_length=255, default="")  # Logo URI of the contract
    decimals = models.IntegerField(default=0)  # Decimals used to calculate quantity of the contract

    price = models.DecimalField(max_digits=15, decimal_places=8, default=0)

    previous_day_price = models.DecimalField(max_digits=15, decimal_places=8, default=0)
    previous_week_price = models.DecimalField(max_digits=15, decimal_places=8, default=0)
    previous_month_price = models.DecimalField(max_digits=15, decimal_places=8, default=0)

    previous_day = models.DateTimeField(default=datetime.now)
    previous_week = models.DateTimeField(default=datetime.now)
    previous_month = models.DateTimeField(default=datetime.now)

    # market_cap = models.DecimalField(max_digits=20, decimal_places=2, default=0) # type: ignore
    # volume = models.DecimalField(max_digits=20, decimal_places=10, default=0) # type: ignore

    class Meta:
        verbose_name = "Contract"
        verbose_name_plural = "Contracts"
        indexes = [
            models.Index(fields=["name", "symbol"]),  # Index for frequent queries
        ]

    def __str__(self):
        return f"{self.name} ({self.symbol})"


# Utility class for calculating contract details
class ContractCalculator:
    def __init__(self, contract):
        self.contract = contract

    def calculate_daily_price_delta(self):
        # Calculate the daily delta price of the contract
        return (
            100 * (self.contract.price - self.contract.previous_day_price) / self.contract.previous_day_price
            if self.contract.previous_day_price != 0
            else 0
        )


# Model to represent a position in a wallet
class Position(TimeStampModel):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="positions")  # Reference to the wallet
    contract = models.ForeignKey(
        Contract, on_delete=models.CASCADE, related_name="positions"
    )  # Reference to the contract
    quantity = models.DecimalField(max_digits=32, decimal_places=18, default=0)  # Quantity of the position
    avg_cost = models.DecimalField(max_digits=15, decimal_places=2, default=0)  # Average cost of the position

    amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    # Performance calculation
    # total_buy_quantity = models.DecimalField(max_digits=32, decimal_places=18, default=0)
    # total_buy_quantity_prev_day = models.DecimalField(max_digits=32, decimal_places=18, default=0)
    # total_buy_quantity_prev_week = models.DecimalField(max_digits=32, decimal_places=18, default=0)
    # total_buy_quantity_prev_year = models.DecimalField(max_digits=32, decimal_places=18, default=0)

    # avg_cost_prev_day = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # avg_cost_prev_week = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # avg_cost_prev_month = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    total_cost = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # total_cost_prev_day = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # total_cost_prev_week = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # total_cost_prev_month = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    unrealized_gain = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # unrealized_gain_prev_day = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # unrealized_gain_prev_week = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # unrealized_gain_prev_month = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    unrealized_gain_percentage = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # unrealized_gain_percentage_prev_day = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # unrealized_gain_percentage_prev_week = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # unrealized_gain_percentage_prev_month = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    capital_gain = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # capital_gain_prev_day = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # capital_gain_prev_week = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # capital_gain_prev_month = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    class Meta:
        verbose_name = "Position"
        verbose_name_plural = "Positions"
        indexes = [
            models.Index(fields=["wallet", "contract"]),  # Index for frequent queries
        ]

    def __str__(self):
        return f"{self.wallet} - {self.contract} - {self.quantity}"


# Model to represent a transaction
class Transaction(TimeStampModel):
    position = models.ForeignKey(
        Position, on_delete=models.CASCADE, related_name="transactions"
    )  # Reference to the position
    type = models.CharField(
        max_length=3, choices=TypeTransactionChoices.choices
    )  # Type of the transaction (IN or OUT)
    quantity = models.DecimalField(max_digits=32, decimal_places=18, default=0)  # Quantity of the transaction
    price = models.DecimalField(max_digits=24, decimal_places=8, default=0)  # Price of the transaction
    date = models.DateTimeField(db_index=True)  # Date of the transaction
    comment = models.TextField(default="", blank=True)  # Comment about the transaction
    hash = models.CharField(max_length=255, default="")  # Hash of the transaction

    price_contract_based = models.DecimalField(max_digits=24, decimal_places=8, default=0)
    price_fiat_based = models.DecimalField(max_digits=15, decimal_places=8, default=0)

    running_quantity = models.DecimalField(max_digits=32, decimal_places=18, default=0)
    buy_quantity = models.DecimalField(max_digits=32, decimal_places=18, default=0)
    sell_quantity = models.DecimalField(max_digits=32, decimal_places=18, default=0)

    total_cost_contract_based = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # avg_cost_contract_based = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # capital_gain_contract_based = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # capital_gain_percentage_contract_based = models.DecimalField(max_digits=15, decimal_places=8, default=0)

    total_cost_fiat_based = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # avg_cost_fiat_based = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # capital_gain_fiat_based = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # capital_gain_percentage_fiat_based = models.DecimalField(max_digits=15, decimal_places=8, default=0)

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
        indexes = [
            models.Index(fields=["position"]),  # Index for frequent queries
        ]

    def __str__(self):
        return f"{self.hash} - {self.type} {self.quantity} ({self.price}) - {self.date}"


# Utility class for calculating transaction details
class TransactionCalculator:
    def __init__(self, transaction):
        self.transaction = transaction

    def calculate_avg_cost_fiat_based(self):
        # Calculate the average cost of the position based on fiat price
        return (
            self.transaction.total_cost_fiat_based / self.transaction.buy_quantity
            if self.transaction.buy_quantity != 0
            else 0
        )

    def calculate_avg_cost_contract_based(self):
        # Calculate the average cost of the position based on contract price
        return (
            self.transaction.total_cost_contract_based / self.transaction.buy_quantity
            if self.transaction.buy_quantity != 0
            else 0
        )

    def calculate_amount(self, current_price):
        # Calculate the amount of a transaction
        return self.transaction.running_quantity * current_price

    def calculate_cost_contract_based(self):
        # Calculate the cost of the transaction based on contract price
        return self.transaction.quantity * self.transaction.price_contract_based

    def calculate_gain(self, current_price):
        # Calculate the gain of the transaction
        initial_cost = self.calculate_cost_contract_based()
        current_value = self.transaction.quantity * current_price
        return current_value - initial_cost

    def calculate_performance(self, current_price):
        # Calculate the performance of the transaction as a percentage
        initial_cost = self.calculate_cost_contract_based()
        gain = self.calculate_gain(current_price)
        return (gain / initial_cost) * 100 if initial_cost != 0 else 0

    def calculate_capital_gain_contract_based(self):
        # Calculate the capital gain of the transaction based on contract price
        cost = self.calculate_cost_contract_based()
        avg_cost = self.calculate_avg_cost_contract_based()
        return (
            cost - self.transaction.quantity * avg_cost if self.transaction.type == TypeTransactionChoices.OUT else 0
        )

    def calculate_capital_gain_fiat_based(self):
        # Calculate the capital gain of the transaction based on fiat price
        cost = self.calculate_cost_contract_based()
        avg_cost = self.calculate_avg_cost_fiat_based()
        return (
            cost - self.transaction.quantity * avg_cost if self.transaction.type == TypeTransactionChoices.OUT else 0
        )


# Model to store user-specific settings
class UserSetting(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="settings"
    )  # One-to-one relationship with User
    show_positions_above_threshold = models.BooleanField(
        default=False
    )  # Whether to show positions above a certain threshold

    class Meta:
        verbose_name = "User Setting"
        verbose_name_plural = "User Settings"

    def __str__(self):
        return f"{self.user.username}'s settings"
