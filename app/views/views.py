import logging

from django.http import HttpRequest

from app.forms import WalletForm
from app.views.views_wallet import wallets

logger = logging.getLogger("blockbuilders")

from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required

from app.models import (
    Blockchain,
    Wallet,
)


# Views
@login_required
def dashboard(request: HttpRequest):
    """
    View to display and create wallets.
    Handles GET and POST requests.
    """
    if request.method == "POST":
        form = WalletForm(request.POST or None)
        if form.is_valid():
            address = form.cleaned_data["address"]
            name = form.cleaned_data["name"]
            user = request.user
            wallet = Wallet.objects.create(
                address=address.lower(),
                name=name,
                user=user,
            )
            wallet.save()
            # wallet_process = WalletProcess.objects.create(wallet=wallet)
            # wallet_process.save()
            logger.info("New wallet and wallet process created")
            return redirect("dashboard")
    else:
        wallets = Wallet.objects.all()
        context = {
            "wallets": wallets,
        }
        return render(request, "dashboard.html", context)
    


@login_required
def blockchains(request: HttpRequest):
    blockchains = Blockchain.objects.all()
    context = {
        "blockchains": blockchains,
    }
    return render(request, "blockchains.html", context)


def register(request: HttpRequest):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password1")
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect("dashboard")
    else:
        form = UserCreationForm()
    return render(request, "registration/register.html", {"form": form})
