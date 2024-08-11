import logging
from app.tasks import (
    delete_wallet_task,
)

from celery.result import AsyncResult
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger("blockbuilders")

from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from app.forms import WalletForm
from app.models import (
    Wallet,
    WalletProcess,
)


@csrf_exempt
def download_wallet_task_status(request, task_id):
    # logger.info("Download AsyncResult for : " + str(task_id))
    task_result = AsyncResult(str(task_id))
    # logger.info("Download task status : " + str(task_result.status))
    return JsonResponse({"status": task_result.status})

def get_download_wallet_task_status(task_id):
    # logger.info("Download AsyncResult for : " + str(task_id))
    task_result = AsyncResult(str(task_id))
    logger.info(f"Get download task status for task {task_id} : {task_result.status}")
    return task_result.status


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
