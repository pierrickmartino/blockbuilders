import logging, os
from app.tasks import (
    aggregate_transactions_task,
    calculate_cost_transaction_task,
    calculate_running_quantity_transaction_task,
    clean_contract_address_task,
    clean_transaction_task,
    create_transactions_from_erc20_task,
    delete_wallet_task,
    get_polygon_token_balance,
)

from celery.result import AsyncResult
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger("blockbuilders")

from django.db.models import Sum
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth.decorators import login_required

from app.forms import WalletForm
from app.models import (
    Wallet,
    WalletProcess,
)


from asgiref.sync import sync_to_async
from celery import chain


@csrf_exempt
def download_wallet_task_status(request, task_id):
    # logger.info("Download AsyncResult for : " + str(task_id))
    task_result = AsyncResult(str(task_id))
    # logger.info("Download task status : " + str(task_result.status))
    return JsonResponse({"status": task_result.status})


@csrf_exempt
def resync_wallet_task_status(request, task_id):
    # logger.info("Download AsyncResult for : " + str(task_id))
    task_result = AsyncResult(str(task_id))
    # logger.info("Download task status : " + str(task_result.status))
    return JsonResponse({"status": task_result.status})


@login_required
def delete_Wallet_by_id(request, wallet_id):
    result = delete_wallet_task.delay(wallet_id, 100)
    return redirect("wallets")


@sync_to_async
def async_calculate_total_wallet(wallet_id: int):
    wallet = get_object_or_404(Wallet, id=wallet_id)
    balance = Wallet.objects.filter(id__exact=wallet_id).aggregate(Sum("positions__amount", default=0))
    wallet.balance = balance["positions__amount__sum"]
    wallet.save()
    return wallet


# NEW
@login_required
def wallets(request):
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
            wallet_process = WalletProcess.objects.create(wallet=wallet)
            wallet_process.save()
            logger.info("New wallet and wallet process created")
            return redirect("wallets")
    else:
        wallets = Wallet.objects.all()
        context = {
            "wallets": wallets,
        }
        return render(request, "wallets.html", context)


@login_required
def delete_wallet(request, wallet_id: int):
    """
    View to delete a wallet and its associated wallet process.
    """
    wallet = get_object_or_404(Wallet, id=wallet_id)
    wallet.delete()
    WalletProcess.objects.filter(wallet=wallet).delete()
    logger.info(f"Wallet and associated process deleted for wallet id {wallet_id}")
    return redirect("wallets")


@login_required
def sync_wallet(request, wallet_id: int):
    """
    View to sync wallet data by chaining several Celery tasks.
    """
    wallet = get_object_or_404(Wallet, id=wallet_id)

    chain_result = chain(
        clean_contract_address_task.s(wallet_id),
        clean_transaction_task.s(),
        create_transactions_from_erc20_task.s(),
        aggregate_transactions_task.s(),
        calculate_cost_transaction_task.s(),
        calculate_running_quantity_transaction_task.s(),
        # TODO : add a task to get the token used for fees (f.e. Polygon --> MATIC)
        get_polygon_token_balance.s(),
    )()
    wallet_process, created = WalletProcess.objects.get_or_create(wallet=wallet)
    wallet_process.download_task = chain_result.id
    wallet_process.save()
    logger.info(f"Started syncing wallet with id {wallet_id}")
    return redirect("wallets")
