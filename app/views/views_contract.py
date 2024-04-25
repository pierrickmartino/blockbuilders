import logging, os

logger = logging.getLogger("blockbuilders")

from django.core.paginator import Paginator
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from app.models import (
    Contract,
)

logger.info("Number of CPU : " + str(os.cpu_count()))


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
