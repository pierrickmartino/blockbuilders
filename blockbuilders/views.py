import logging, os
logger = logging.getLogger(__name__)

from django.db.models import Count
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required

from blockbuilders.forms import WalletForm
from blockbuilders.models import Blockchain, Contract, ContractLink, Wallet
from blockbuilders.utils.polygon.parser_polygon import parse_contract_list, parse_transaction_pagination
from blockbuilders.utils.scraper import fetch_page

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

            for bc in blockchains:
                contract_list  = []
                explorer_url = bc.explorer_url + address
                # scrap
                yc_web_page = fetch_page(explorer_url)
                explorer_page_url = explorer_url + "&p="
                # parse
                page = parse_transaction_pagination(yc_web_page)
                logger.info("Pages : " + page)
                page = 1
               
                for i in range(int(page)):
                    explorer_url_loop = explorer_page_url + str(i+1)
                    # scrap
                    yc_web_page_loop_wallet = fetch_page(explorer_url_loop)
                    # parse
                    parse_contract_list(yc_web_page_loop_wallet, contract_list, i)
                    logger.info("Ready to process " + str(len(contract_list)) + " contracts")
    
                for contract_info in contract_list:
                    contract = Contract.objects.create(
                        address = contract_info[0],
                        blockchain = bc,
                        name = contract_info[1]
                    )
                    contract.save()

                    contract_link = ContractLink.objects.create(
                        contract = contract,
                        wallet = wallet,
                        is_active = False
                    )
                    contract_link.save()
            
            contract_link_ref = ContractLink.objects.filter(is_active=True).values("wallet").annotate(wallet_count=Count("wallet"))
            for obj in wallets :
                for cl in contract_link_ref:
                    if cl['wallet'] == obj.id:
                        obj.active_countract_counter = cl['wallet_count']


            context = {
                "wallets": wallets,
                "blockchains": blockchains,
            }
            return render(request, 'home.html', context)
    else:
        wallets = Wallet.objects.all()
        blockchains = Blockchain.objects.all()

        contract_link_ref = ContractLink.objects.filter(is_active=True).values("wallet").annotate(wallet_count=Count("wallet"))
        for obj in wallets :
            for cl in contract_link_ref:
                if cl['wallet'] == obj.id:
                    obj.active_countract_counter = cl['wallet_count']

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
    contract_links = ContractLink.objects.filter(wallet=wallet)
    template = loader.get_template("view_wallet.html")
    context = {
        "wallet": wallet,
        "contract_links": contract_links,
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

