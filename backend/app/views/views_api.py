from datetime import timedelta
from django.utils import timezone
from rest_framework import viewsets, generics, filters, permissions, pagination
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError
from rest_framework.permissions import IsAuthenticated
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


class MonthlyResultsSetPagination(pagination.PageNumberPagination):
    page_size = 30
    page_size_query_param = "limit"
    max_page_size = 30


##################
# AUTHENTICATION #
##################
class UserView(generics.RetrieveAPIView):
    model = User
    serializer_class = UserSerializer

    def retrieve(self, request, pk=None):
        if request.user and pk == "me":
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
            refresh_token = request.data["refresh"]
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
    """
    ViewSet for Wallets that restricts access to only the authenticated user's wallets.
    """

    # queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get_queryset(self):
        # Restrict the queryset to only wallets belonging to the authenticated user
        return Wallet.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically associate the wallet with the authenticated user during creation
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
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ["against_contract__name", "against_contract__symbol"]

    def get_queryset(self):
        return Transaction.objects.all()


class PositionView(generics.ListAPIView):
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]
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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the max number of transactions to return from the URL kwargs
        limit = int(self.kwargs.get("limit", 1))  # Default to 1 if not provided

        # Filter transactions to include only those belonging to wallets owned by the authenticated user
        return (
            Transaction.objects.filter(position__wallet__user=self.request.user)  # Restrict to user's wallets
            .exclude(position__contract__category=CategoryContractChoices.STABLE)  # Exclude STABLE contracts
            .exclude(position__contract__category=CategoryContractChoices.SUSPICIOUS)  # Exclude SUSPICIOUS contracts
            .order_by("-date")[:limit]  # Order by date and limit to the max specified
        )


class PositionTopView(generics.ListAPIView):
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the max number of positions to return from the URL kwargs
        limit = int(self.kwargs.get("limit", 1))  # Default to 1 if not provided

        # Filter positions to include only those belonging to wallets owned by the authenticated user
        return Position.objects.filter(wallet__user=self.request.user).order_by("-amount")[  # Restrict to user's wallets
            :limit
        ]  # Order by amount and limit to the max specified


class PositionMostProfitableView(generics.ListAPIView):
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the max number of positions to return from the URL kwargs
        limit = int(self.kwargs.get("limit", 1))  # Default to 1 if not provided

        # Filter positions to include only those belonging to wallets owned by the authenticated user and only STANDARD contracts
        return Position.objects.filter(wallet__user=self.request.user, contract__category=CategoryContractChoices.STANDARD).order_by(
            "-capital_gain"
        )[  # Restrict to user's wallets
            :limit
        ]  # Order by amount and limit to the max specified


class PositionLessProfitableView(generics.ListAPIView):
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the max number of positions to return from the URL kwargs
        limit = int(self.kwargs.get("limit", 1))  # Default to 1 if not provided

        # Filter positions to include only those belonging to wallets owned by the authenticated user and only STANDARD contracts
        return Position.objects.filter(wallet__user=self.request.user, contract__category=CategoryContractChoices.STANDARD).order_by(
            "capital_gain"
        )[  # Restrict to user's wallets
            :limit
        ]  # Order by amount and limit to the max specified


class BestPerformerPositionView(generics.ListAPIView):
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the max number of positions to return from the URL kwargs
        limit = int(self.kwargs.get("limit", 1))  # Default to 1 if not provided

        # Filter positions to include only those belonging to wallets owned by the authenticated user, only STANDARD contracts, and only those with a previous day at yesterday
        return Position.objects.filter(
            wallet__user=self.request.user,
            contract__category=CategoryContractChoices.STANDARD,
            contract__previous_day__gt=timezone.now() - timedelta(days=2)
        ).order_by(
            "-daily_price_delta"
        )[  # Restrict to user's wallets
            :limit
        ]  # Order by amount and limit to the max specified


class WorstPerformerPositionView(generics.ListAPIView):
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the max number of positions to return from the URL kwargs
        limit = int(self.kwargs.get("limit", 1))  # Default to 1 if not provided

        # Filter positions to include only those belonging to wallets owned by the authenticated user, only STANDARD contracts, and only those with a previous day at yesterday
        return Position.objects.filter(
            wallet__user=self.request.user,
            contract__category=CategoryContractChoices.STANDARD,
            contract__previous_day__gt=timezone.now() - timedelta(days=2)
        ).order_by(
            "daily_price_delta"
        )[  # Restrict to user's wallets
            :limit
        ]  # Order by amount and limit to the max specified


class MarketDataLastView(generics.ListAPIView):
    serializer_class = MarketDataSerializer
    pagination_class = MonthlyResultsSetPagination

    def get_queryset(self):
        symbol = self.kwargs["symbol"]
        reference = self.kwargs["reference"]
        last = self.kwargs["last"]
        symbol_for_query = symbol.replace("WETH", "ETH")
        return MarketData.objects.filter(symbol=symbol_for_query, reference=reference).order_by("-time")[:last]


class BlockchainTopView(generics.ListAPIView):
    serializer_class = BlockchainSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the max number of blockchains to return from the URL kwargs
        limit = int(self.kwargs.get("limit", 1))  # Default to 1 if not provided

        return Blockchain.objects.order_by("-balance")[:limit]


class WalletPositionView(generics.ListAPIView):
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ["contract__name", "contract__symbol"]

    def get_queryset(self):
        wallet_id = self.kwargs["wallet_id"]

        try:
            return (
                Position.objects.filter(wallet__user=self.request.user)  # Restrict to user's wallets
                .filter(wallet_id=wallet_id)  # Restrict to the selected wallet
                .order_by("-amount")  # Order by amount
            )

        except Wallet.DoesNotExist:
            raise NotFound("Wallet does not exist")


class WalletPositionDetailView(generics.RetrieveAPIView):
    serializer_class = PositionSerializer
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ["against_contract__name", "against_contract__symbol"]

    def get_queryset(self):
        wallet_id = self.kwargs["wallet_id"]
        position_id = self.kwargs["position_id"]

        try:
            # Ensure the position belongs to the given wallet
            wallet = Wallet.objects.get(id=wallet_id)
            return Transaction.objects.filter(position__wallet__user=self.request.user).filter(  # Restrict to user's wallets
                position_id=position_id
            )
        except Position.DoesNotExist:
            raise NotFound("Position not found for this wallet")
        except Wallet.DoesNotExist:
            raise NotFound("Wallet does not exist")


# class WalletPositionCapitalGainLastView(generics.ListAPIView):
#     serializer_class = TransactionSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         wallet_id = self.kwargs["wallet_id"]
#         position_id = self.kwargs["position_id"]
#         last = self.kwargs["last"]

#         try:
#             # Ensure the position belongs to the given wallet
#             wallet = Wallet.objects.get(id=wallet_id)
#             return Transaction.objects.filter(position__wallet__user=self.request.user).filter(  # Restrict to user's wallets
#                 position_id=position_id
#             )
#         except Position.DoesNotExist:
#             raise NotFound("Position not found for this wallet")
#         except Wallet.DoesNotExist:
#             raise NotFound("Wallet does not exist")


class WalletPositionTransactionDetailView(generics.RetrieveAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

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
