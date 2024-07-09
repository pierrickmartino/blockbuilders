import logging, os
from app.tasks import (
    aggregate_transactions_task,
    calculate_cost_transaction_task,
    calculate_running_quantity_transaction_task,
    clean_contract_address_task,
    clean_transaction_task,
    create_transactions_from_arbitrum_erc20_task,
    create_transactions_from_bsc_bep20_task,
    create_transactions_from_optimism_erc20_task,
    create_transactions_from_polygon_erc20_task,
    delete_wallet_task,
    get_arbitrum_token_balance,
    get_bsc_token_balance,
    get_optimism_token_balance,
    get_polygon_token_balance,
)

from celery.result import AsyncResult
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger("blockbuilders")

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth.decorators import login_required

from app.forms import WalletForm
from app.models import (
    Wallet,
    WalletProcess,
)


from celery import chain, chord, group


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
    result = delete_wallet_task.delay(wallet_id, 50)
    return redirect("dashboard")


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
def sync_wallet(request, wallet_id: int):
    """
    View to sync wallet data by chaining several Celery tasks.
    """
    wallet = get_object_or_404(Wallet, id=wallet_id)

    transactions_chord = chord(
        group(
            create_transactions_from_polygon_erc20_task.s(),
            create_transactions_from_bsc_bep20_task.s(),
            create_transactions_from_optimism_erc20_task.s(),
            create_transactions_from_arbitrum_erc20_task.s(),
        ),
        aggregate_transactions_task.s(wallet_id),  # Callback task
    )

    chain_result = chain(
        clean_contract_address_task.s(wallet_id),
        clean_transaction_task.s(),
        transactions_chord,  # The chord is part of the chain
        calculate_cost_transaction_task.s(),
        calculate_running_quantity_transaction_task.s(),
        group(
            get_polygon_token_balance.s(),
            get_bsc_token_balance.s(),
            get_optimism_token_balance.s(),
            get_arbitrum_token_balance.s(),
        ),
    )()
    wallet_process, created = WalletProcess.objects.get_or_create(wallet=wallet)
    wallet_process.download_task = chain_result.id
    wallet_process.save()
    logger.info(f"Started syncing wallet with id {wallet_id}")
    return redirect("wallets")
