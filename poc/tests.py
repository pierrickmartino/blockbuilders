from django.test import TestCase
import datetime

from blockbuilders.models import Wallet 

class WalletTestCase(TestCase):
    def setUp(self):
        start_time = datetime.datetime.now()
        wallets = []
        size = 500
        for i in range(100000):
            wallet = Wallet()
            wallet.title = f"title{i}"
            wallet.author = f"author{i}"
            wallet.comments = f"comment{i}"
            wallets.append(wallet)
        Wallet.objects.bulk_create(wallets, size)

        end_time = datetime.datetime.now()
        print(f"Create method execution time: {end_time - start_time}")

    def test_lookup(self):
        start_time = datetime.datetime.now()
        for i in range(50000, 51000):
            Wallet.objects.get(title=f"title{i}")

        end_time = datetime.datetime.now()
        print(f"Get method execution time: {end_time - start_time}")