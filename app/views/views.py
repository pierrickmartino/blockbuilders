import logging

from django.http import HttpRequest
from django.db.models import F, Value, Case, When, Sum, DecimalField
from django.db.models.functions import Coalesce

from app.forms import WalletForm

logger = logging.getLogger("blockbuilders")

from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator

from app.models import (
    Blockchain,
    Position,
    Transaction,
    Wallet,
)


# Views
@login_required
def dashboard_redirect(request):
    return redirect("dashboard", page=1)


@login_required
def dashboard(request: HttpRequest, page):
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
            return redirect("/dashboard/1")
    else:

        wallets = Wallet.objects.all()
        wallets_with_calculator = []

        # Calculate the total balance of all positions
        total_balance = (
            Position.objects.aggregate(total_balance=Sum(F("quantity") * F("contract__price")))["total_balance"] or 0
        )

        # Annotate positions with the amount
        positions = Position.objects.annotate(amount=F("quantity") * F("contract__price")).order_by("-amount")[:5]

        # Annotate transactions with the capital gain
        transactions_gain = Transaction.objects.annotate(
            capital_gain=F("quantity") * F("price")
            - Case(
                When(buy_quantity=0, then=Value(0)),
                default=F("quantity") * (F("total_cost") / Coalesce(F("buy_quantity"), 1)),
                output_field=DecimalField(),
            )
        ).order_by("-capital_gain")[:5]

        # Annotate transactions with the capital loss
        transactions_loss = Transaction.objects.annotate(
            capital_gain=F("quantity") * F("price")
            - Case(
                When(buy_quantity=0, then=Value(0)),
                default=F("quantity") * (F("total_cost") / Coalesce(F("buy_quantity"), 1)),
                output_field=DecimalField(),
            )
        ).order_by("capital_gain")[:5]

        # Calculate the total balance for each blockchain
        blockchain_totals = (
            Position.objects.values(
                blockchain_name=F("contract__blockchain__name"),
                blockchain_icon=F("contract__blockchain__icon"),
            )
            .annotate(total_amount=Sum(F("quantity") * F("contract__price")))
            .order_by("-total_amount")
        )

        # Get the top 5 blockchains
        top_blockchains_data = blockchain_totals[:5]

        for wallet in wallets:
            progress_percentage = wallet.balance / total_balance * 100 if total_balance != 0 else 0

            wallet_data = {
                "id": wallet.id,
                "balance": wallet.balance,
                "name": wallet.name,
                "address": wallet.address,
                "created_at": wallet.created_at,
                "description": wallet.description,
                "percentage": progress_percentage,
            }

            wallets_with_calculator.append(wallet_data)

        top_positions = [
            {
                "wallet": pos.wallet,
                "contract": pos.contract,
                "quantity": pos.quantity,
                "amount": pos.amount,
                "percentage": (pos.amount / total_balance * 100) if total_balance != 0 else 0,
            }
            for pos in positions
        ]

        # Calculate the percentage of the total balance for each of the top 5 blockchains
        top_blockchains = [
            {
                "name": blockchain["blockchain_name"],
                "icon": blockchain["blockchain_icon"],
                "amount": blockchain["total_amount"],
                "percentage": (blockchain["total_amount"] / total_balance * 100) if total_balance != 0 else 0,
            }
            for blockchain in top_blockchains_data
        ]

        top_transactions_gain = [
            {
                "date": transaction.date,
                "contract": transaction.position.contract,
                "capital_gain": transaction.capital_gain,
                "icon": transaction.position.contract.blockchain.icon,
            }
            for transaction in transactions_gain
        ]

        top_transactions_loss = [
            {
                "date": transaction.date,
                "contract": transaction.position.contract,
                "capital_gain": transaction.capital_gain,
                "icon": transaction.position.contract.blockchain.icon,
            }
            for transaction in transactions_loss
        ]

        sorted_wallets_desc = sorted(wallets_with_calculator, key=lambda x: x["balance"], reverse=True)
        paginator = Paginator(sorted_wallets_desc, per_page=5)
        page_wallets = paginator.get_page(page)
        page_wallets.adjusted_elided_pages = paginator.get_elided_page_range(page)

        context = {
            "page_wallets": page_wallets,
            "top_positions": top_positions,
            "top_blockchains": top_blockchains,
            "top_transactions_gain": top_transactions_gain,
            "top_transactions_loss": top_transactions_loss,
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
