from django.db import models
from django.contrib.auth.models import User

class Wallet(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="user_wallets")
    address = models.CharField(max_length=255)

    def __str__(self):
        return "%s" % (self.address)
    
class Blockchain(models.Model):
    name = models.CharField(max_length=255)
    icon = models.CharField(max_length=255)
    is_active = models.BooleanField()

    def __str__(self):
        return "%s" % (self.name)