import logging, os

from django.http import JsonResponse

logger = logging.getLogger("blockbuilders")

from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.decorators import login_required

from app.models import (
    CategoryContractChoices,
    Contract,
)


@login_required
def contracts(request):
    contracts = Contract.objects.all()[:20]
    context = {
        "contracts": contracts,
    }
    return render(request, "contracts.html", context)


@login_required
def contracts_paginated(request, page):
    contracts = Contract.objects.all().order_by("name")
    paginator = Paginator(contracts, per_page=10)
    page_contracts = paginator.get_page(page)
    page_contracts.adjusted_elided_pages = paginator.get_elided_page_range(page)
    context = {
        "page_contracts": page_contracts,
    }
    return render(request, "contracts.html", context)


def get_Contract_by_address(contract_address):
    contract = Contract.objects.filter(address=contract_address).first()
    return contract


def blacklist_Contract_by_id(request, contract_id):
    if request.method == "POST":
        contract = get_object_or_404(Contract, id=contract_id)
        contract.category = CategoryContractChoices.SUSPICIOUS
        contract.save()
        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "error"}, status=400)


def stable_Contract_by_id(request, contract_id):
    if request.method == "POST":
        contract = get_object_or_404(Contract, id=contract_id)
        contract.category = CategoryContractChoices.STABLE
        contract.save()
        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "error"}, status=400)
