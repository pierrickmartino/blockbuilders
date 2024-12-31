import logging
import uuid

from celery import chain, chord, group
from django.http import JsonResponse

from app.tasks import (
    calculate_wallet_balance_task,
    delete_position_task,
    finish_wallet_download_task,
    finish_wallet_fulldownload_task,
    finish_wallet_resync_task,
    get_full_init_historical_price_from_market_task,
    get_historical_price_from_market_task,
    get_price_from_market_task,
    start_wallet_download_task,
    start_wallet_fulldownload_task,
    start_wallet_resync_task,
    update_contract_information,
)

from app.tasks import (
    aggregate_transactions_task,
    calculate_cost_transaction_task,
    calculate_running_quantity_transaction_task,
    calculate_blockchain_balance_task,
    clean_contract_address_task,
    clean_transaction_task,
    create_transactions_from_base_erc20_task,
    create_transactions_from_arbitrum_erc20_task,
    create_transactions_from_bsc_bep20_task,
    create_transactions_from_optimism_erc20_task,
    create_transactions_from_polygon_erc20_task,
    get_arbitrum_token_balance,
    get_base_token_balance,
    get_bsc_token_balance,
    get_optimism_token_balance,
    get_polygon_token_balance,
)
from app.views.calculators.calculators_position import calculate_wallet_positions

logger = logging.getLogger("blockbuilders")

from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, render, redirect

from django.contrib.auth.decorators import login_required

from app.models import (
    Position,
    UserSetting,
    Wallet,
    WalletProcess,
)


@login_required
def positions(request):
    positions = Position.objects.all()
    context = {
        "positions": positions,
    }
    return render(request, "positions.html", context)


@login_required
def positions_paginated(request, page):

    user_setting = UserSetting.objects.filter(user=request.user).first()
    if user_setting and user_setting.show_positions_above_threshold:
        positions = Position.objects.filter(amount__gt=0.5).order_by("contract")
    else:
        positions = Position.objects.all().order_by("contract")

    logger.info("Number of positions found : " + str(positions.count()))
    logger.info("User Setting - show_positions_above_threshold : " + str(user_setting.show_positions_above_threshold))

    paginator = Paginator(positions, per_page=10)
    page_positions = paginator.get_page(page)
    page_positions.adjusted_elided_pages = paginator.get_elided_page_range(page)
    context = {
        "page_positions": page_positions,
        "user_setting": user_setting,
    }
    return render(request, "positions.html", context)


@login_required
def wallet_positions_paginated(request, wallet_id, page):
    wallet = Wallet.objects.filter(id=wallet_id).first()
    # positions = Position.objects.filter(wallet=wallet)

    user_setting, created = UserSetting.objects.get_or_create(user=request.user)
    user_setting.save()

    position_filtered, total_realized_gain, total_unrealized_gain = calculate_wallet_positions(wallet)

    sorted_positions_desc = sorted(position_filtered, key=lambda x: x["amount"], reverse=True)

    paginator = Paginator(sorted_positions_desc, per_page=10)
    page_positions = paginator.get_page(page)
    page_positions.adjusted_elided_pages = paginator.get_elided_page_range(page)
    context = {
        "page_positions": page_positions,
        "wallet": wallet,
        "user_setting": user_setting,
        "total_realized_gain": total_realized_gain,
        "total_unrealized_gain": total_unrealized_gain,
    }
    return render(request, "positions.html", context)


@login_required
def delete_Position_by_id(request, position_id):
    result = delete_position_task.delay(position_id, 100)
    return redirect("dashboard")


# @login_required
def refresh_wallet_position_price(request, wallet_id: uuid):
    """
    View to refresh position prices of a wallet by chaining several Celery tasks.
    """
    logger.info(f"Enter in [refresh_wallet_position_price] for wallet with id {wallet_id}")
    wallet = get_object_or_404(Wallet, id=wallet_id)
    positions = Position.objects.filter(wallet=wallet)
    symbol_set = {
        position.contract.symbol
        for position in positions
        if not position.contract.symbol[0].islower()
        and "-" not in position.contract.symbol
        and "." not in position.contract.symbol
    }  # exclusion of all the derivative token (f.e. aPolMIMATIC, amUSDC, etc...)
    # exclusion of all the symbol with a . or - inside (f.e. BSC-Coin, USD.e, etc...)
    symbol_list = list(symbol_set)

    chain_result = chain(
        start_wallet_resync_task.s(wallet_id),
        group(get_historical_price_from_market_task.s(symbol) for symbol in symbol_list),
        group(update_contract_information.s(symbol) for symbol in symbol_list),
        get_price_from_market_task.s(symbol_list),
        calculate_wallet_balance_task.s(wallet_id),
        calculate_blockchain_balance_task.s(wallet_id),
        finish_wallet_resync_task.s(wallet_id),
    )()

    logger.info(f"Started getting position prices for wallet with id {wallet_id}")
    # return redirect("dashboard")
    return JsonResponse({"task_id": chain_result.id, "status": "Task triggered successfully"})


# @login_required
def refresh_full_historical_position_price(request, wallet_id: uuid):
    """
    View to refresh full position prices of a wallet by chaining several Celery tasks.
    """
    logger.info(f"Enter in [refresh_full_historical_position_price] for wallet with id {wallet_id}")
    wallet = get_object_or_404(Wallet, id=wallet_id)
    positions = Position.objects.filter(wallet=wallet)
    symbol_set = {
        position.contract.symbol
        for position in positions
        if not position.contract.symbol[0].islower()
        and "-" not in position.contract.symbol
        and "." not in position.contract.symbol
    }  # exclusion of all the derivative token (f.e. aPolMIMATIC, amUSDC, etc...)
    # exclusion of all the symbol with a . or - inside (f.e. BSC-Coin, USD.e, etc...)
    symbol_list = list(symbol_set)

    chain_result = chain(
        start_wallet_fulldownload_task.s(wallet_id),
        group(get_full_init_historical_price_from_market_task.s(symbol_list)),
        finish_wallet_fulldownload_task.s(wallet_id),
    )()
    wallet_process, created = WalletProcess.objects.get_or_create(wallet=wallet)
    wallet_process.full_download_task = chain_result.id
    wallet_process.save()
    logger.info(f"Started getting full position prices for wallet with id {wallet_id}")

    return JsonResponse({"task_id": chain_result.id, "status": "Task triggered successfully"})


# @login_required
# @require_POST
def download_wallet(request, wallet_id: uuid):
    """
    View to sync wallet data by chaining several Celery tasks.
    """
    logger.info(f"Enter in [download_wallet] for wallet with id {wallet_id}")
    wallet = get_object_or_404(Wallet, id=wallet_id)

    transactions_chord = chord(
        group(
            create_transactions_from_polygon_erc20_task.s(),
            create_transactions_from_bsc_bep20_task.s(),
            create_transactions_from_optimism_erc20_task.s(),
            create_transactions_from_arbitrum_erc20_task.s(),
            create_transactions_from_base_erc20_task.s(),
        ),
        aggregate_transactions_task.s(wallet_id),  # Callback task
    )

    chain_result = chain(
        start_wallet_download_task.s(wallet_id),
        clean_contract_address_task.s(),
        clean_transaction_task.s(),
        transactions_chord,  # The chord is part of the chain
        calculate_cost_transaction_task.s(),
        calculate_running_quantity_transaction_task.s(),
        group(
            get_polygon_token_balance.s(),
            get_bsc_token_balance.s(),
            get_optimism_token_balance.s(),
            get_arbitrum_token_balance.s(),
            get_base_token_balance.s(),
        ),
        finish_wallet_download_task.s(wallet_id),
    )()
    wallet_process, created = WalletProcess.objects.get_or_create(wallet=wallet)
    wallet_process.download_task = chain_result.id
    wallet_process.save()
    logger.info(f"Started downloading wallet with id {wallet_id}")
    # return redirect("dashboard")
    return JsonResponse({"task_id": chain_result.id, "status": "Task triggered successfully"})
