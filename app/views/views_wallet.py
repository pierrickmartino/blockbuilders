import logging, os
from app.tasks import (
    aggregate_transactions_task,
    calculate_cost_transaction_task,
    calculate_running_quantity_transaction_task,
    create_transactions_from_erc20_task,
    delete_wallet_task,
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


# @login_required
# def wallets(request):
#     if request.method == "POST":
#         form = WalletForm(request.POST or None)

#         if form.is_valid():
#             address = form.cleaned_data["address"]
#             name = form.cleaned_data["name"]
#             user = request.user
#             wallet = Wallet.objects.create(
#                 address=address.lower(),
#                 name=name,
#                 user=user,
#             )
#             wallet.save()

#             wallets = Wallet.objects.all()

#             logger.info("New wallet is created")

#             wallet_process = WalletProcess.objects.create(wallet=wallet)
#             wallet_process.save()

#             logger.info("New wallet process is created")

#             context = {
#                 "wallets": wallets,
#             }
#             return render(request, "wallets.html", context)
#     else:
#         wallets = Wallet.objects.all()

#         context = {
#             "wallets": wallets,
#         }
#         return render(request, "wallets.html", context)


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


# @login_required
# def resync_information_Wallet_by_id(request, wallet_id):
#     # 0. Clean contracts addresses
#     contracts = Contract.objects.all()
#     for contract in contracts:
#         contract.address = contract.address.lower()
#         contract.save()

#     chained_task = chain(
#         clean_transaction_task.s(wallet_id)
#         | create_transactions_from_erc20_task.s()
#         | aggregate_transactions_task.s()
#         | calculate_cost_transaction_task.s()
#         | calculate_running_quantity_transaction_task.s()
#     )
#     result = chained_task.apply_async()

#     wallet = get_object_or_404(Wallet, id=wallet_id)

#     wallet_process = WalletProcess.objects.filter(wallet=wallet).first()
#     wallet_process.resync_task = result.id
#     wallet_process.save()

#     return redirect("wallets")


@login_required
def delete_Wallet_by_id(request, wallet_id):
    result = delete_wallet_task.delay(wallet_id, 100)
    return redirect("wallets")
    # return HttpResponse(f"Task triggered. Task ID: {result.id}")
    # return JsonResponse({'task_id': str(result)})


# @login_required
# def get_information_Wallet_by_id(request, wallet_id):
#     wallet = get_object_or_404(Wallet, id=wallet_id)

#     # Clean existing ERC20 transactions for this Wallet
#     # todo : replace by get or update to optimize data queries
#     erc20_existing = get_Polygon_ERC20_Raw_by_Wallet_address(wallet.address)
#     erc20_existing.delete()

#     chained_task = chain(get_erc20_transactions_by_wallet_task.s(wallet.address) | create_erc20_process_task.s())
#     result = chained_task.apply_async()

#     wallet_process = WalletProcess.objects.filter(wallet=wallet).first()
#     wallet_process.download_task = result.id
#     wallet_process.save()

#     return redirect("wallets")


@sync_to_async
def async_calculate_total_wallet(wallet_id: int):
    wallet = get_object_or_404(Wallet, id=wallet_id)
    balance = Wallet.objects.filter(id__exact=wallet_id).aggregate(Sum("wallet_positions__amount", default=0))
    wallet.balance = balance["wallet_positions__amount__sum"]
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
        # get_erc20_transactions_by_wallet_task.s(wallet.address),
        create_transactions_from_erc20_task.s(wallet.id),
        aggregate_transactions_task.s(wallet.id),
        calculate_cost_transaction_task.s(wallet.id),
        calculate_running_quantity_transaction_task.s(wallet.id),
        # clean_transaction_task.s(wallet.id),
    )()
    wallet_process, created = WalletProcess.objects.get_or_create(wallet=wallet)
    wallet_process.download_task = chain_result.id
    wallet_process.save()
    logger.info(f"Started syncing wallet with id {wallet_id}")
    return redirect("view_wallet", wallet_id=wallet.id)


# todo : still needed ?
# @login_required
# def view_wallet(request, wallet_id):
#     wallet = Wallet.objects.filter(id=wallet_id).first()

#     if request.method == "POST":
#         form = ContractForm(request.POST or None)

#         if form.is_valid():
#             address = find_between_strings(form.cleaned_data["address"], "[", "]", 0)
#             contract = Contract.objects.filter(address=address).first()
#             position = Position.objects.create(
#                 contract=contract, wallet=wallet, is_active=True
#             )
#             position.save()

#             positions = Position.objects.filter(wallet=wallet)
#             contracts = Contract.objects.all()
#             template = loader.get_template("view_wallet.html")

#             logger.info("New position is added")

#             transactions = get_erc20_transactions_by_wallet_and_contract(
#                 wallet.address, contract.address
#             )
#             for erc20 in transactions:
#                 divider = 10
#                 for x in range(1, int(erc20["tokenDecimal"])):
#                     divider = divider * 10

#                 logger.info(erc20)
#                 logger.info(wallet.address)
#                 logger.info(erc20["from"])
#                 logger.info(erc20["to"])

#                 transactionType = "BUY"

#                 if erc20["from"].upper() == wallet.address.upper():
#                     transactionType = "SEL"
#                 if erc20["to"].upper() == wallet.address.upper():
#                     transactionType = "BUY"

#                 logger.info(transactionType)

#                 transaction = Transaction.objects.create(
#                     position=position,
#                     type=transactionType,
#                     quantity=(int(erc20["value"]) / divider),
#                     date=datetime.fromtimestamp(int(erc20["timeStamp"])),
#                     comment="",
#                     hash=erc20["hash"],
#                 )
#                 transaction.save()

#             context = {
#                 "wallet": wallet,
#                 "positions": positions,
#                 "contracts": contracts,
#             }
#             return HttpResponse(template.render(context, request))
#     else:
#         wallet = Wallet.objects.filter(id=wallet_id).first()
#         positions = Position.objects.filter(wallet=wallet)
#         contracts = Contract.objects.all()
#         template = loader.get_template("view_wallet.html")

#         context = {
#             "wallet": wallet,
#             "positions": positions,
#             "contracts": contracts,
#         }
#         return HttpResponse(template.render(context, request))
