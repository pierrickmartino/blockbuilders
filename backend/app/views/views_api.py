from rest_framework import viewsets, generics, filters, permissions
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError
from rest_framework import status

from app.serializers import (
    BlockchainSerializer,
    ContractSerializer,
    FiatSerializer,
    MarketDataSerializer,
    PositionSerializer,
    TransactionSerializer,
    UserSerializer,
    UserSettingSerializer,
    WalletSerializer,
)
from app.models import (
    Blockchain,
    CategoryContractChoices,
    Contract,
    Fiat,
    MarketData,
    Position,
    Transaction,
    User,
    UserSetting,
    Wallet,
)

##################
# AUTHENTICATION #
##################
class UserView(generics.RetrieveAPIView):
    model = User
    serializer_class = UserSerializer

    def retrieve(self, request, pk=None):
        if request.user and pk == 'me':
            return Response(UserSerializer(request.user).data)
        return super(UserView, self).retrieve(request, pk)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class Loginview(APIView):
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed("Account does not exist")
        if user is None:
            raise AuthenticationFailed("User does not exist")
        if not user.check_password(password):
            raise AuthenticationFailed("Incorrect Password")
        access_token = AccessToken.for_user(user)
        refresh_token = RefreshToken.for_user(user)
        return Response({"access_token": access_token, "refresh_token": refresh_token})


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response("Logout Successful", status=status.HTTP_200_OK)
        except TokenError:
            raise AuthenticationFailed("Invalid Token")


################
# ModelViewSet #
################

class WalletViewSet(viewsets.ModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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


###############
# ListAPIView #
###############


class TransactionView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["against_contract__name", "against_contract__symbol"]

    def get_queryset(self):
        return Transaction.objects.all()


class PositionView(generics.ListAPIView):
    serializer_class = PositionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["contract__name", "contract__symbol"]

    def get_queryset(self):
        return Position.objects.all().order_by("-amount")


class ContractView(generics.ListAPIView):
    serializer_class = ContractSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "symbol"]

    def get_queryset(self):
        return Contract.objects.all()


class TransactionLastView(generics.ListAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        max = self.kwargs["max"]
        return (
            Transaction.objects.exclude(position__contract__category=CategoryContractChoices.STABLE)
            .exclude(position__contract__category=CategoryContractChoices.SUSPICIOUS)
            .order_by("-date")[:max]
        )


class PositionTopView(generics.ListAPIView):
    serializer_class = PositionSerializer

    def get_queryset(self):
        max = self.kwargs["max"]
        return Position.objects.order_by("-amount")[:max]


class BlockchainTopView(generics.ListAPIView):
    serializer_class = BlockchainSerializer

    def get_queryset(self):
        max = self.kwargs["max"]
        return Blockchain.objects.order_by("-balance")[:max]


class WalletPositionView(generics.ListAPIView):
    serializer_class = PositionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["contract__name", "contract__symbol"]

    def get_queryset(self):
        wallet_id = self.kwargs["wallet_id"]

        try:
            return Position.objects.filter(wallet_id=wallet_id).order_by("-amount")

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
    filter_backends = [filters.SearchFilter]
    search_fields = ["against_contract__name", "against_contract__symbol"]

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
