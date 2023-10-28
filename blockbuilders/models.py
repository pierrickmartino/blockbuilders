from django.db import models

class Wallet(models.Model):
    address = models.CharField(max_length=255)

    def __str__(self):
        return "%s" % (self.address)
    
class Blockchain(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return "%s" % (self.name)