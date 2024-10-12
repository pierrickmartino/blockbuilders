from rest_framework import viewsets, generics, filters
from rest_framework.exceptions import NotFound

from app.serializers import (
    BlockchainSerializer,
    ContractSerializer,
    FiatSerializer,
    MarketDataSerializer,
    PositionSerializer,
    TransactionSerializer,
    UserSettingSerializer,
    WalletSerializer,
)
from app.models import Blockchain, Contract, Fiat, MarketData, Position, Transaction, UserSetting, Wallet


class WalletViewSet(viewsets.ModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WalletPositionView(generics.ListAPIView):
    serializer_class = PositionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['contract__name', 'contract__symbol']

    def get_queryset(self):
        wallet_id = self.kwargs["wallet_id"]

        try:
            return Position.objects.filter(wallet_id=wallet_id).order_by('-amount')
            
        except Wallet.DoesNotExist:
            raise NotFound("Wallet does not exist")

class PositionTopView(generics.ListAPIView):
    serializer_class = PositionSerializer

    def get_queryset(self):
        max = self.kwargs["max"]

        try:
            return Position.objects.order_by('-amount')[:max]
        except Wallet.DoesNotExist:
            raise NotFound("Wallet does not exist")

class BlockchainTopView(generics.ListAPIView):
    serializer_class = BlockchainSerializer

    def get_queryset(self):
        max = self.kwargs["max"]

        try:
            return Blockchain.objects.order_by('-balance')[:max]
        except Wallet.DoesNotExist:
            raise NotFound("Wallet does not exist")


class WalletPositionDetailView(generics.RetrieveAPIView):
    serializer_class = PositionSerializer

    def get_object(self):
        wallet_id = self.kwargs["wallet_id"]
        position_id = self.kwargs["position_id"]

        try:
            # Ensure the position belongs to the given wallet
            wallet = Wallet.objects.get(id=wallet_id)
            return Position.objects.get(wallet_id=wallet_id, id=position_id)
        except Position.DoesNotExist:
            raise NotFound("Position not found for this wallet")
        except Wallet.DoesNotExist:
            raise NotFound("Wallet does not exist")


class WalletPositionTransactionView(generics.ListAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        wallet_id = self.kwargs["wallet_id"]
        position_id = self.kwargs["position_id"]

        try:
            wallet = Wallet.objects.get(id=wallet_id)
            return Transaction.objects.filter(position_id=position_id)
        except Position.DoesNotExist:
            raise NotFound("Position not found for this wallet")
        except Wallet.DoesNotExist:
            raise NotFound("Wallet does not exist")


class WalletPositionTransactionDetailView(generics.RetrieveAPIView):
    serializer_class = TransactionSerializer

    def get_object(self):
        wallet_id = self.kwargs["wallet_id"]
        position_id = self.kwargs["position_id"]
        transaction_id = self.kwargs["transaction_id"]

        try:
            wallet = Wallet.objects.get(id=wallet_id)
            position = Position.objects.get(wallet_id=wallet_id, id=position_id)
            # Ensure the position belongs to the given wallet
            return Transaction.objects.get(position_id=position_id, id=transaction_id)
        except Transaction.DoesNotExist:
            raise NotFound("Transaction not found for this position")
        except Position.DoesNotExist:
            raise NotFound("Position not found for this wallet")
        except Wallet.DoesNotExist:
            raise NotFound("Wallet does not exist")


class FiatViewSet(viewsets.ModelViewSet):
    queryset = Fiat.objects.all()
    serializer_class = FiatSerializer


class BlockchainViewSet(viewsets.ModelViewSet):
    queryset = Blockchain.objects.all()
    serializer_class = BlockchainSerializer


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer


class PositionViewSet(viewsets.ModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class MarketDataViewSet(viewsets.ModelViewSet):
    queryset = MarketData.objects.all()
    serializer_class = MarketDataSerializer


class UserSettingViewSet(viewsets.ModelViewSet):
    queryset = UserSetting.objects.all()
    serializer_class = UserSettingSerializer
