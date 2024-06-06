from django.db import models

from app.models import TimeStampModel


class Optimism_ERC20_Raw(TimeStampModel):
    blockNumber = models.CharField(max_length=255)
    timeStamp = models.CharField(max_length=255)
    hash = models.CharField(max_length=255)
    nonce = models.CharField(max_length=255)
    blockHash = models.CharField(max_length=255)
    fromAddress = models.CharField(max_length=255)
    toAddress = models.CharField(max_length=255)
    contractAddress = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
    tokenName = models.CharField(max_length=255)
    tokenDecimal = models.CharField(max_length=255)
    transactionIndex = models.CharField(max_length=255)
    gas = models.CharField(max_length=255)
    gasPrice = models.CharField(max_length=255)
    gasUsed = models.CharField(max_length=255)
    cumulativeGasUsed = models.CharField(max_length=255)
    input = models.CharField(max_length=255)
    confirmations = models.CharField(max_length=255)

    class Meta:
        verbose_name = "OptimismERC20"
        verbose_name_plural = "OptimismERC20"

    def __str__(self):
        return f"{self.blockNumber}"
