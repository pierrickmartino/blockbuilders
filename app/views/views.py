import logging, os

from django.http import HttpRequest
from app.utils.polygon.models_polygon import Polygon_ERC20_Raw

logger = logging.getLogger("blockbuilders")

from django.db.models import Q
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required

from app.models import (
    Blockchain,
)


# Views
@login_required
def dashboard(request: HttpRequest):
    context = {
        "empty": "dashboard",
    }
    return render(request, "dashboard.html", context)


@login_required
def profile(request: HttpRequest):
    context = {
        "empty": "profile",
    }
    return render(request, "profile.html", context)


@login_required
def blockchains(request: HttpRequest):
    blockchains = Blockchain.objects.all()
    context = {
        "blockchains": blockchains,
    }
    return render(request, "blockchains.html", context)


def get_Polygon_ERC20_Raw_by_Wallet_address(wallet_address: str):
    result = Polygon_ERC20_Raw.objects.filter(
        Q(fromAddress=wallet_address) | Q(toAddress=wallet_address)
    )
    return result


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
