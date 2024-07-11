import logging

from django.http import HttpRequest
from django.db.models import Sum, F

from app.forms import WalletForm
from app.views.views_wallet import wallets

logger = logging.getLogger("blockbuilders")

from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required

from app.models import (
    Blockchain,
    Position,
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

        # Calculate the total balance of all positions
        total_balance = Position.objects.aggregate(
            total_balance=Sum(F('quantity') * F('contract__price'))
        )['total_balance'] or 0

        # Annotate positions with the amount
        positions = Position.objects.annotate(
            amount=F('quantity') * F('contract__price')
        ).order_by('-amount')[:5]

        # Calculate the total balance for each blockchain
        blockchain_totals = Position.objects.values(
            blockchain_name=F('contract__blockchain__name'),
            blockchain_icon=F('contract__blockchain__icon'),
        ).annotate(
            total_amount=Sum(F('quantity') * F('contract__price'))
        ).order_by('-total_amount')

        # Get the top 5 blockchains
        top_blockchains_data = blockchain_totals[:5]

        top_positions = [{
            'wallet': pos.wallet,
            'contract': pos.contract,
            'quantity': pos.quantity,
            'amount': pos.amount,
            'percentage': (pos.amount / total_balance * 100) if total_balance != 0 else 0
        } for pos in positions]

        # Calculate the percentage of the total balance for each of the top 5 blockchains
        top_blockchains = [{
            'name': blockchain['blockchain_name'],
            'icon': blockchain['blockchain_icon'],
            'amount': blockchain['total_amount'],
            'percentage': (blockchain['total_amount'] / total_balance * 100) if total_balance != 0 else 0
        } for blockchain in top_blockchains_data]

        context = {
            "wallets": wallets,
            "top_positions": top_positions,
            "top_blockchains" : top_blockchains,
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
