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
    # path('admin/', admin.site.urls),
    # path('', include('poc.urls'))
    path("", views.home, name="home"),
    path("__debug__/", include("debug_toolbar.urls")),
    path("login/", auth_views.LoginView.as_view(), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("home/", views.home, name="home"),
    path("register/", views.register, name="register"),
    path("admin/", admin.site.urls),
    path(
        "delete_wallet/<int:wallet_id>/",
        views.delete_Wallet_by_id,
        name="delete_wallet",
    ),
    path("wallet/<int:wallet_id>/", views.view_wallet, name="wallet"),
    path("wallet_download_info/<int:wallet_id>/", views.get_information_Wallet_by_id, name="wallet_download_info"),
    path("wallet_resync_info/<int:wallet_id>/", views.resync_information_Wallet_by_id, name="wallet_resync_info"),
    path(
        "delete_contract_link/<int:contract_link_id>/",
        views.delete_ContractLink_by_id,
        name="delete_contract_link",
    ),
    path(
        "enable _contract_link/<int:contract_link_id>/",
        views.enable_ContractLink_by_id,
        name="enable_contract_link",
    ),
    path(
        "disable_contract_link/<int:contract_link_id>/",
        views.disable_ContractLink_by_id,
        name="disable_contract_link",
    ),
]
