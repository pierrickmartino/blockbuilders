"""blockbuilders URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path

from app.views import views, views_contract, views_position, views_transaction, views_wallet, views_profile
from app.utils.polygon import view_polygon
from app.utils.arbitrum import view_arbitrum
from app.utils.optimism import view_optimism
from app.utils.bsc import view_bsc
from app.views.views_api import (
    FiatViewSet,
    LogoutView,
    MarketDataLastView,
    PositionMostProfitableView,
    PositionTopView,
    PositionView,
    TransactionLastView,
    BlockchainTopView,
    TransactionView,
    # WalletPositionCapitalGainLastView,
    WalletPositionDetailView,
    WalletPositionTransactionDetailView,
    WalletPositionTransactionView,
    WalletPositionView,
    WalletViewSet,
    BlockchainViewSet,
    ContractViewSet,
    MarketDataViewSet,
    UserSettingViewSet,
    TransactionViewSet,
    PositionViewSet,
)

# from rest_framework.urlpatterns import format_suffix_patterns

wallet_list = WalletViewSet.as_view({"get": "list", "post": "create"})
wallet_detail = WalletViewSet.as_view({"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"})
wallet_position_list = WalletPositionView.as_view()
wallet_position_detail = WalletPositionDetailView.as_view()
wallet_position_transaction_list = WalletPositionTransactionView.as_view()
# wallet_position_capitalgain_last_list = WalletPositionCapitalGainLastView.as_view()
wallet_position_transaction_detail = WalletPositionTransactionDetailView.as_view()

fiat_list = FiatViewSet.as_view({"get": "list", "post": "create"})
fiat_detail = FiatViewSet.as_view({"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"})
blockchain_list = BlockchainViewSet.as_view({"get": "list", "post": "create"})
blockchain_detail = BlockchainViewSet.as_view({"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"})
contract_list = ContractViewSet.as_view({"get": "list", "post": "create"})
contract_detail = ContractViewSet.as_view({"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"})
market_data_list = MarketDataViewSet.as_view({"get": "list", "post": "create"})
market_data_detail = MarketDataViewSet.as_view({"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"})
market_data_last_list = MarketDataLastView.as_view()
user_setting_list = UserSettingViewSet.as_view({"get": "list", "post": "create"})
user_setting_detail = UserSettingViewSet.as_view({"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"})
transaction_list = TransactionView.as_view()
transaction_last_list = TransactionLastView.as_view()
transaction_detail = TransactionViewSet.as_view({"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"})
position_list = PositionView.as_view()
position_top_list = PositionTopView.as_view()
position_most_profitable_list = PositionMostProfitableView.as_view()
blockchain_top_list = BlockchainTopView.as_view()
position_detail = PositionViewSet.as_view({"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"})
urlpatterns = [
    # format_suffix_patterns(
    # GLOBAL
    path("", views.dashboard_redirect, name="dashboard"),
    path("__debug__/", include("debug_toolbar.urls")),
    path("admin/", admin.site.urls),
    path("prometheus/", include("django_prometheus.urls")),
    # AUTHENTICATION / USER
    # path("login/", auth_views.LoginView.as_view(), name="login"),
    # path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    # path("register/", views.register, name="register"),
    path("profile/", views_profile.profile, name="profile"),
    path("profile/update/", views_profile.update_user_settings, name="update_user_settings"),
    # DASHBOARD
    path("dashboard/", views.dashboard_redirect, name="dashboard_redirect"),
    path("dashboard/<int:page>/", views.dashboard, name="dashboard"),
    # BLOCKCHAIN
    path("blockchains/", views.blockchains, name="blockchains"),
    # CONTRACT
    path("contracts/", views_contract.contracts, name="contracts"),
    path(
        "contracts/<int:page>",
        views_contract.contracts_paginated,
        name="contracts-by-page",
    ),
    path(
        "blacklist_contract/<int:contract_id>/",
        views_contract.blacklist_Contract_by_id,
        name="blacklist_contract",
    ),
    path(
        "stable_contract/<int:contract_id>/",
        views_contract.stable_Contract_by_id,
        name="stable_contract",
    ),
    # WALLET
    path("wallets/", views_wallet.wallets, name="wallets"),
    path(
        "delete_wallet/<int:wallet_id>/",
        views_wallet.delete_Wallet_by_id,
        name="delete_wallet",
    ),
    # path(
    #     "wallet_download_info/<int:wallet_id>/",
    #     views_wallet.get_information_Wallet_by_id,
    #     name="wallet_download_info",
    # ),
    path(
        "download_wallet_task_status/<uuid:task_id>/",
        views_wallet.download_wallet_task_status,
        name="download_wallet_task_status",
    ),
    # path(
    #     "wallet_resync_info/<int:wallet_id>/",
    #     views_wallet.resync_information_Wallet_by_id,
    #     name="wallet_resync_info",
    # ),
    # path(
    #     "resync_wallet_task_status/<uuid:task_id>/",
    #     views_wallet.resync_wallet_task_status,
    #     name="resync_wallet_task_status",
    # ),
    # POSITION
    # path("positions/", views_position.positions, name="positions"),
    # path(
    #     "position/<int:position_id>/refresh_price/",
    #     views_position.refresh_position_price,
    #     name="refresh_position_price",
    # ),
    path(
        "positions/<int:page>",
        views_position.positions_paginated,
        name="positions-by-page",
    ),
    path(
        "delete_position/<int:position_id>/",
        views_position.delete_Position_by_id,
        name="delete-position",
    ),
    path(
        "wallet/<int:wallet_id>/positions/<int:page>",
        views_position.wallet_positions_paginated,
        name="wallet-positions-by-page",
    ),
    path(
        "wallet/<int:wallet_id>/refresh_price/",
        views_position.refresh_wallet_position_price,
        name="refresh-wallet-position-price",
    ),
    # path(
    #     "wallet/<int:wallet_id>/download_wallet/",
    #     views_position.download_wallet,
    #     name="download-wallet",
    # ),
    path(
        "wallet/<int:wallet_id>/refresh_full_histo_price/",
        views_position.refresh_full_historical_position_price,
        name="refresh-full-histo-price",
    ),
    # TRANSACTION
    path("transactions/", views_transaction.transactions, name="transactions"),
    path(
        "transactions/<int:page>",
        views_transaction.transactions_paginated,
        name="transactions-by-page",
    ),
    path(
        "position/<int:position_id>/transactions/<int:page>",
        views_transaction.position_transactions_paginated,
        name="position-transactions-by-page",
    ),
    # SCAN
    path(
        "polygon/balance/<str:address>/",
        view_polygon.account_balance_by_address,
        name="polygon_account_balance_by_address",
    ),
    path(
        "polygon/erc20transactions/<str:address>/",
        view_polygon.erc20_transactions_by_wallet,
        name="polygon_erc20_transactions_by_wallet",
    ),
    path("polygon/matic/", view_polygon.matic_price, name="polygon_matic_price"),
    path("arbitrum/ethereum/", view_arbitrum.ethereum_price, name="arbitrum_ethereum_price"),
    path("optimism/ethereum/", view_optimism.ethereum_price, name="optimism_ethereum_price"),
    path("bsc/bnb/", view_bsc.bnb_price, name="bsc_bnb_price"),
    ######################
    # API DEDICATED URLS #
    ######################
    # path('api/users/', UserView.as_view(), name='users'),
    # path('api/token/', jwt_views.TokenObtainPairView.as_view(), name ="token_obtain_pair"),
    # path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    # path('api/token/verify/', jwt_views.TokenVerifyView.as_view(), name='token_verify'),
    path("api/auth/", include("djoser.urls")),
    path("api/auth/", include("djoser.urls.jwt")),
    path("api/auth/logout/", LogoutView.as_view()),
    # path('api/register/', RegisterView.as_view(), name="register"),
    # path('api/login/', Loginview.as_view(), name="login"),
    # path('api/logout/', LogoutView.as_view(), name = "logout"),
    # path("api/auth/", include("rest_framework.urls")),
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # FROM WALLET OBJECT #
    path("api/wallets/", wallet_list, name="wallet-list"),
    path("api/wallets/<uuid:pk>/", wallet_detail, name="wallet-detail"),
    path("api/wallets/<uuid:wallet_id>/positions/", wallet_position_list, name="wallet-position-list"),
    path("api/wallets/<uuid:wallet_id>/download/", views_position.download_wallet, name="wallet-download"),
    path(
        "api/wallets/<uuid:wallet_id>/refresh/",
        views_position.refresh_wallet_position_price,
        name="wallet-refresh",
    ),
    path(
        "api/wallets/refresh/",
        views_position.refresh_position_price,
        name="refresh",
    ),
    path(
        "api/wallets/<uuid:wallet_id>/refresh-full/",
        views_position.refresh_full_historical_position_price,
        name="wallet-refresh-full",
    ),
    path(
        "api/wallets/<uuid:wallet_id>/positions/<uuid:position_id>/",
        wallet_position_detail,
        name="wallet-position-detail",
    ),
    path(
        "api/wallets/<uuid:wallet_id>/positions/<uuid:position_id>/transactions/",
        wallet_position_transaction_list,
        name="wallet-position-transaction-list",
    ),
    path(
        "api/wallets/<uuid:wallet_id>/positions/<uuid:position_id>/transactions/<uuid:transaction_id>/",
        wallet_position_transaction_detail,
        name="wallet-position-transaction-detail",
    ),
    # FROM FIAT OBJECT #
    path("api/fiats/", fiat_list, name="fiat-list"),
    path("api/fiats/<uuid:pk>/", fiat_detail, name="fiat-detail"),
    # FROM BLOCKCHAIN OBJECT #
    path("api/blockchains/", blockchain_list, name="blockchain-list"),
    path("api/blockchains/<uuid:pk>/", blockchain_detail, name="blockchain-detail"),
    path("api/blockchains/top/<int:limit>", blockchain_top_list, name="blockchain-top-list"),
    # FROM CONTRACT OBJECT #
    path("api/contracts/", contract_list, name="contract-list"),
    path("api/contracts/<uuid:pk>/", contract_detail, name="contract-detail"),
    path(
        "api/contracts/<uuid:contract_id>/download/",
        views_contract.download_contract_info,
        name="contract-download-info",
    ),
    path(
        "api/contracts/<uuid:contract_id>/suspicious/",
        views_contract.set_Contract_as_suspicious,
        name="contract-is-suspicious",
    ),
    path(
        "api/contracts/<uuid:contract_id>/stable/",
        views_contract.set_Contract_as_stable,
        name="contract-is-stable",
    ),
    path(
        "api/contracts/<uuid:contract_id>/standard/",
        views_contract.set_Contract_as_standard,
        name="contract-is-standard",
    ),
    # FROM MARKETDATA OBJECT #
    path("api/marketdatas/", market_data_list, name="marketdata-list"),
    path("api/marketdatas/<uuid:pk>/", market_data_detail, name="marketdata-detail"),
    path("api/marketdatas/<str:symbol>/<str:reference>/<int:last>", market_data_last_list, name="marketdata-last-list"),
    # FROM USER_SETTING OBJECT #
    path("api/usersettings/", user_setting_list, name="usersetting-list"),
    path("api/usersettings/<uuid:pk>/", user_setting_detail, name="usersetting-detail"),
    # FROM TRANSACTION OBJECT #
    path("api/transactions/", transaction_list, name="transaction-list"),
    path("api/transactions/last/<int:limit>", transaction_last_list, name="transaction-last-list"),
    path("api/transactions/count", views_transaction.count_transactions, name="transaction-count"),
    path("api/transactions/<uuid:pk>/", transaction_detail, name="transaction-detail"),
    # FROM POSITION OBJECT #
    path("api/positions/", position_list, name="position-list"),
    path("api/positions/top/<int:limit>", position_top_list, name="position-top-list"),
    path("api/positions/mostprofitable/<int:limit>", position_most_profitable_list, name="position-mostprofitable-list"),
    path(
        "api/positions/<uuid:position_id>/capitalgains/<int:last>",
        views_position.get_position_capitalgains,
        name="get_position_capitalgains",
    ),
    path(
        "api/wallets/<uuid:wallet_id>/capitalgains/<int:last>",
        views_position.get_wallet_capitalgains,
        name="get_wallet_capitalgains",
    ),
    path(
        "api/wallets/capitalgains/<int:last>",
        views_position.get_total_capitalgains,
        name="get_total_capitalgains",
    ),
    path(
        "api/positions/<uuid:position_id>/export/csv/",
        views_transaction.export_transactions_csv,
        name="export_transactions_csv",
    ),
    # FOR CELERY PROCESS
    path(
        "api/tasks/<uuid:task_id>/status/",
        views_wallet.get_task_status,
        name="task_id",
    ),
]
# )
