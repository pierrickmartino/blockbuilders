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

from app import views


urlpatterns = [
    # GLOBAL
    path("", views.dashboard, name="dashboard"),
    path("__debug__/", include("debug_toolbar.urls")),
    path("admin/", admin.site.urls),
    # AUTHENTICATION / USER
    path("login/", auth_views.LoginView.as_view(), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("register/", views.register, name="register"),
    path("profile/", views.profile, name="profile"),
    # DASHBOARD
    path("dashboard/", views.dashboard, name="dashboard"),
    # BLOCKCHAIN
    path("blockchains/", views.blockchains, name="blockchains"),
    # CONTRACT
    path("contracts/", views.contracts, name="contracts"),
    path("contracts/<int:page>", views.contracts_paginated, name="contracts-by-page"),
    # WALLET
    path("wallets/", views.wallets, name="wallets"),
    path(
        "delete_wallet/<int:wallet_id>/",
        views.delete_Wallet_by_id,
        name="delete_wallet",
    ),
    path(
        "wallet/<int:wallet_id>/positions/<int:page>",
        views.wallet_positions_paginated,
        name="wallet-positions-by-page",
    ),
    path(
        "wallet/<int:wallet_id>/refresh_price/",
        views.refresh_wallet_position_price,
        name="refresh_wallet_position_price",
    ),
    path(
        "wallet_download_info/<int:wallet_id>/",
        views.get_information_Wallet_by_id,
        name="wallet_download_info",
    ),
    path(
        "download_wallet_task_status/<uuid:task_id>/",
        views.download_wallet_task_status,
        name="download_wallet_task_status",
    ),
    path(
        "wallet_resync_info/<int:wallet_id>/",
        views.resync_information_Wallet_by_id,
        name="wallet_resync_info",
    ),
    path(
        "resync_wallet_task_status/<uuid:task_id>/",
        views.resync_wallet_task_status,
        name="resync_wallet_task_status",
    ),
    # POSITION
    path("positions/", views.positions, name="positions"),
    path(
        "position/<int:position_id>/refresh_price/",
        views.refresh_position_price,
        name="refresh_position_price",
    ),
    path("positions/<int:page>", views.positions_paginated, name="positions-by-page"),
    path(
        "position/<int:position_id>/transactions/<int:page>",
        views.position_transactions_paginated,
        name="position-transactions-by-page",
    ),
    path(
        "delete_position/<int:position_id>/",
        views.delete_Position_by_id,
        name="delete_position",
    ),

    # TRANSACTION
    path("transactions/", views.transactions, name="transactions"),
    path(
        "transactions/<int:page>",
        views.transactions_paginated,
        name="transactions-by-page",
    ),
    path(
        "delete_wallet/<int:wallet_id>/",
        views.delete_Wallet_by_id,
        name="delete_wallet",
    ),
]
