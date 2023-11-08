import logging, os

from app.utils.utils import find_between_strings
logger = logging.getLogger("blockbuilders")

from django.db.models import Count
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required

from app.forms import ContractForm, WalletForm
from app.models import Blockchain, Contract, ContractLink, Wallet
from app.utils.polygon.parser_polygon import parse_contract_list, parse_transaction_list, parse_transaction_pagination
from app.utils.scraper import fetch_page

logger.info("Number of CPU : "  + str(os.cpu_count()))

# Views
@login_required
def home(request):
    if request.method == 'POST':
        form = WalletForm(request.POST or None)

        if form.is_valid():
            
            address = form.cleaned_data["address"]
            user = request.user
            wallet = Wallet.objects.create(
                address=address,
                user=user,
            )
            wallet.save()
            
            wallets = Wallet.objects.all()
            blockchains = Blockchain.objects.all()

            logger.info("New wallet is added")

            context = {
                "wallets": wallets,
                "blockchains": blockchains,
            }
            return render(request, 'home.html', context)
    else:
        wallets = Wallet.objects.all()
        blockchains = Blockchain.objects.all()

        context = {
                "wallets": wallets,
                "blockchains": blockchains,
            }
        return render(request, 'home.html', context)

@login_required
def delete_Wallet_by_id(request, wallet_id):
    wallet = get_object_or_404(Wallet, id=wallet_id)
    wallet.delete()
    return redirect("home")

@login_required
def delete_ContractLink_by_id(request, contract_link_id):
    contract_link = get_object_or_404(ContractLink, id=contract_link_id)
    contract_link.delete()
    return redirect(request.META['HTTP_REFERER'])


@login_required
def enable_ContractLink_by_id(request, contract_link_id):
    contract_link = get_object_or_404(ContractLink, id=contract_link_id)
    contract_link.mark_as_active()
    return redirect(request.META['HTTP_REFERER'])

@login_required
def disable_ContractLink_by_id(request, contract_link_id):
    contract_link = get_object_or_404(ContractLink, id=contract_link_id)
    contract_link.mark_as_inactive()
    return redirect(request.META['HTTP_REFERER'])

@login_required
def view_wallet(request, wallet_id):
    wallet = Wallet.objects.get(id=wallet_id)

    if request.method == 'POST':
        form = ContractForm(request.POST or None)

        if form.is_valid():
            
            address = find_between_strings(form.cleaned_data["address"], '[', ']', 0)
            contract = Contract.objects.get(address=address)
            contract_link = ContractLink.objects.create(
                contract=contract,
                wallet=wallet,
                is_active=True
            )
            contract_link.save()
            
            contract_links = ContractLink.objects.filter(wallet=wallet)
            contracts = Contract.objects.all()
            template = loader.get_template("view_wallet.html")

            logger.info("New contract_link is added")

            context = {
                "wallet": wallet,
                "contract_links": contract_links,
                "contracts" : contracts
            }
            return HttpResponse(template.render(context, request))
    else:
        wallet = Wallet.objects.get(id=wallet_id)
        contract_links = ContractLink.objects.filter(wallet=wallet)
        contracts = Contract.objects.all()
        template = loader.get_template("view_wallet.html")

        context = {
            "wallet": wallet,
            "contract_links": contract_links,
            "contracts" : contracts
        }
        return HttpResponse(template.render(context, request))


    


def register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password1")
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect("home")
    else:
        form = UserCreationForm()
    return render(request, "registration/register.html", {"form": form})

