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
from django.contrib.auth import views as auth_views
from django.urls import include, path

from app.views import views, views_contract, views_position, views_transaction, views_wallet, views_profile
from app.utils.polygon import view_polygon
from app.utils.arbitrum import view_arbitrum
from app.utils.optimism import view_optimism
from app.utils.bsc import view_bsc

urlpatterns = [
    # GLOBAL
    path("", views.dashboard, name="dashboard"),
    path("__debug__/", include("debug_toolbar.urls")),
    path("admin/", admin.site.urls),
    # AUTHENTICATION / USER
    path("login/", auth_views.LoginView.as_view(), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("register/", views.register, name="register"),
    path("profile/", views_profile.profile, name="profile"),
    path("profile/update/", views_profile.update_user_settings, name="update_user_settings"),
    # DASHBOARD
    path("dashboard/", views.dashboard, name="dashboard"),
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
        "sync_wallet/<int:wallet_id>/",
        views_wallet.sync_wallet,
        name="sync_wallet",
    ),
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
    path("positions/", views_position.positions, name="positions"),
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
        name="delete_position",
    ),
    path(
        "wallet/<int:wallet_id>/positions/<int:page>",
        views_position.wallet_positions_paginated,
        name="wallet-positions-by-page",
    ),
    path(
        "wallet/<int:wallet_id>/refresh_price/",
        views_position.refresh_wallet_position_price,
        name="refresh_wallet_position_price",
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
    path('position/<int:position_id>/transactions/export/csv/', views_transaction.export_transactions_csv, name='export_transactions_csv'),
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
]
