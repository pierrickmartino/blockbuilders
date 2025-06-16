from collections import defaultdict
import logging
import uuid

from celery import chain, chord, group
from django.http import JsonResponse

from app.tasks import (
    calculate_wallet_balance_task,
    delete_position_task,
    finish_user_resync_task,
    finish_wallet_download_task,
    finish_wallet_fulldownload_task,
    finish_wallet_resync_task,
    get_full_init_historical_price_from_market_task,
    get_historical_price_from_market_task,
    get_price_from_market_task,
    start_user_resync_task,
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
    create_transactions_from_metis_erc20_task,
    create_transactions_from_bsc_bep20_task,
    create_transactions_from_optimism_erc20_task,
    create_transactions_from_polygon_erc20_task,
    get_arbitrum_token_balance,
    get_base_token_balance,
    get_metis_token_balance,
    get_bsc_token_balance,
    get_optimism_token_balance,
    get_polygon_token_balance,
)
from app.views.calculators.calculators_position import calculate_wallet_positions
from app.views.views_transaction import get_Transactions_by_Wallet

logger = logging.getLogger("blockbuilders")

from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from app.models import (
    CategoryContractChoices,
    Position,
    Transaction,
    User,
    UserSetting,
    Wallet,
    WalletProcess,
)

from django.utils import timezone
from datetime import timedelta, datetime
import pytz
from decimal import Decimal


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


@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this view
def refresh_position_price(request):
    """
    View to refresh position prices of all the wallet of the user by chaining several Celery tasks.
    """
    logger.info(f"Enter in [refresh_position_price]")
    # Get the wallets owned by the user
    # user = get_object_or_404(User, id=request.user.id)
    wallets = Wallet.objects.filter(user=request.user)
    if not wallets:
        logger.warning("No wallets found for the user.")
        return JsonResponse({"status": "No wallets found for the user."}, status=404)
    # Collect all the positions from all wallets
    positions = Position.objects.filter(wallet__in=wallets)
    if not positions:
        logger.warning("No positions found for the user's wallets.")
        return JsonResponse({"status": "No positions found for the user's wallets."}, status=404)
    symbol_set = {
        position.contract.symbol
        for position in positions
        if not position.contract.category == CategoryContractChoices.COLLATERAL
        and not position.contract.category == CategoryContractChoices.SUSPICIOUS
        and "-" not in position.contract.symbol
        and "." not in position.contract.symbol
        # if not position.contract.symbol[0].islower() and "-" not in position.contract.symbol and "." not in position.contract.symbol
    }  # exclusion of all the derivative token (f.e. aPolMIMATIC, amUSDC, etc...)
    # exclusion of all the symbol with a . or - inside (f.e. BSC-Coin, USD.e, etc...)
    symbol_list = list(symbol_set)

    # Start the chain of tasks to refresh position prices
    logger.info(f"Starting position price refresh for user {request.user.id} with {len(symbol_list)} symbols")
    chain_result = chain(
        start_user_resync_task.s(request.user.id),  # Start the user resync task
        group(get_historical_price_from_market_task.s(symbol) for symbol in symbol_list),  # Get historical prices for each symbol
        group(update_contract_information.s(symbol) for symbol in symbol_list),  # Update contract information
        get_price_from_market_task.s(symbol_list),  # Get current prices for all symbols
        group(calculate_wallet_balance_task.s(wallet.id) for wallet in wallets),  # Calculate wallet balances
        group(calculate_blockchain_balance_task.s(wallet.id) for wallet in wallets),  # Calculate blockchain balances
        finish_user_resync_task.s(request.user.id),  # Finish the user resync task
    )()
    logger.info(f"Started refreshing position prices for user {request.user.id}")
    # Return the task ID and status
    return JsonResponse({"task_id": chain_result.id, "status": "Task triggered successfully"})


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
        # if "-" not in position.contract.symbol and "." not in position.contract.symbol
        if not position.contract.category == CategoryContractChoices.COLLATERAL
        and not position.contract.category == CategoryContractChoices.SUSPICIOUS
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
        if not position.contract.category == CategoryContractChoices.COLLATERAL
        and not position.contract.category == CategoryContractChoices.SUSPICIOUS
        and "-" not in position.contract.symbol
        and "." not in position.contract.symbol
        # if not position.contract.symbol[0].islower() and "-" not in position.contract.symbol and "." not in position.contract.symbol
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
            create_transactions_from_metis_erc20_task.s(),
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
            get_metis_token_balance.s(),
        ),
        finish_wallet_download_task.s(wallet_id),
    )()
    wallet_process, created = WalletProcess.objects.get_or_create(wallet=wallet)
    wallet_process.download_task = chain_result.id
    wallet_process.save()
    logger.info(f"Started downloading wallet with id {wallet_id}")
    # return redirect("dashboard")
    return JsonResponse({"task_id": chain_result.id, "status": "Task triggered successfully"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this view
def get_position_capitalgains(request, position_id, last):
    """
    View to get the capital gains for a specific position over the last 'last' days.
    """
    # logger.info(f"Enter in [get_position_capitalgains] for position with id {position_id}")

    # Calculate the date 30 days ago from now
    end_date = timezone.now().date()
    days_ago = end_date - timedelta(days=last)

    # Get timezone (using Europe/Paris based on your "+02:00" offset)
    tz = pytz.timezone("Europe/Paris")

    position = Position.objects.filter(id=position_id).first()
    transactions = Transaction.objects.filter(position=position).filter(date__gte=days_ago).order_by("date")

    # Convert QuerySet to dictionary with date as key
    data_dict = {}
    for obj in transactions:
        date_val = getattr(obj, "date").date()
        data_dict[date_val] = getattr(obj, "running_capital_gain")

    # Create a complete date range with running values
    result = []
    current_value = None

    # Find the last value before our range to initialize (if exists)
    prev_objects = Transaction.objects.filter(position=position).filter(date__lt=days_ago).order_by(f"-date")

    if prev_objects.exists():
        current_value = getattr(prev_objects.first(), "running_capital_gain")

    # Fill in all dates with the running value
    current_date = days_ago
    while current_date <= end_date:
        # If we have data for this date, update the current value
        if current_date in data_dict:
            current_value = data_dict[current_date]

        # Create timezone aware datetime at 4:00 AM
        time_with_tz = tz.localize(datetime.combine(current_date, datetime.min.time()) + timedelta(hours=4))

        # Format the running capital gain as a string with 8 decimal places
        formatted_value = f"{current_value:.8f}" if isinstance(current_value, (int, float)) else str(current_value)

        result.append({"time": time_with_tz.isoformat(), "running_capital_gain": formatted_value})

        current_date += timedelta(days=1)

    return Response(result)


@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this view
def get_wallet_capitalgains(request, wallet_id, last):
    """
    View to get the capital gains for a specific wallet.
    """
    # logger.info(f"Enter in [get_wallet_capitalgains] for wallet with id {wallet_id}")

    # Calculate the date 30 days ago from now
    end_date = timezone.now().date()
    days_ago = end_date - timedelta(days=last)

    # Get timezone (using Europe/Paris based on your "+02:00" offset)
    tz = pytz.timezone("Europe/Paris")

    wallet = get_object_or_404(Wallet, id=wallet_id)
    transactions = get_Transactions_by_Wallet(wallet)
    transactions_in_scope = [t for t in transactions if t.date.date() >= days_ago]

    # Step 1: Group transactions by date and sum gains for each date
    gains_by_date = defaultdict(Decimal)
    for t in transactions_in_scope:
        gains_by_date[t.date.date()] += getattr(t, "capital_gain", Decimal("0"))

    # Step 2: Build running sum of future transaction gains
    # For each date, we need the sum of gains for dates AFTER this date
    # So, we precompute the cumulative sum from future to past

    date_list = []
    current_date = end_date
    while current_date >= days_ago:
        date_list.append(current_date)
        current_date -= timedelta(days=1)

    # To get "future sum" as of each date, iterate date_list in reverse
    future_sum = 0
    future_sums = {}  # date -> sum of capital_gain for transactions after this date
    for date in date_list:
        future_sums[date] = future_sum
        future_sum += gains_by_date.get(date, Decimal("0"))

    # Step 3: For each day, calculate the capital gain as of the end of that day
    result = []
    for date in date_list:
        capital_gain_at_date = wallet.capital_gain - future_sums[date]
        # Create timezone-aware datetime at 4:00 AM
        time_with_tz = tz.localize(datetime.combine(date, datetime.min.time()) + timedelta(hours=4))
        formatted_value = f"{capital_gain_at_date:.8f}"
        result.append({"time": time_with_tz.isoformat(), "running_capital_gain": formatted_value})

    return Response(result)


@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this view
def get_total_capitalgains(request, last):
    """
    View to get the total capital gains for all wallets of the authenticated user.
    """
    # logger.info(f"Enter in [get_wallet_capitalgains] for wallet with id {wallet_id}")

    # Get all the wallets for the authenticated user
    user = get_object_or_404(User, id=request.user.id)
    wallets = Wallet.objects.filter(user=user)

    # Calculate the total capital gain for all wallets
    total_capital_gain = sum(wallet.capital_gain for wallet in wallets)

    # Calculate the date 30 days ago from now
    end_date = timezone.now().date()
    days_ago = end_date - timedelta(days=last)

    # Get timezone (using Europe/Paris based on your "+02:00" offset)
    tz = pytz.timezone("Europe/Paris")

    # Get all the transactions for the wallets in scope and exclude suspicious contracts
    transactions = (
        Transaction.objects.filter(position__wallet__user=request.user)  # Filter transactions for the authenticated user
        .exclude(position__contract__category=CategoryContractChoices.STABLE)  # Exclude stable contracts
        .exclude(position__contract__category=CategoryContractChoices.SUSPICIOUS)  # Exclude suspicious contracts
        .order_by("-date")
    )  # Order by date and limit to the max specified
    transactions_in_scope = [t for t in transactions if t.date.date() >= days_ago]

    # Step 1: Group transactions by date and sum gains for each date
    gains_by_date = defaultdict(Decimal)
    for t in transactions_in_scope:
        gains_by_date[t.date.date()] += getattr(t, "capital_gain", Decimal("0"))

    # Step 2: Build running sum of future transaction gains
    # For each date, we need the sum of gains for dates AFTER this date
    # So, we precompute the cumulative sum from future to past

    date_list = []
    current_date = end_date
    while current_date >= days_ago:
        date_list.append(current_date)
        current_date -= timedelta(days=1)

    # To get "future sum" as of each date, iterate date_list in reverse
    future_sum = 0
    future_sums = {}  # date -> sum of capital_gain for transactions after this date
    for date in date_list:
        future_sums[date] = future_sum
        future_sum += gains_by_date.get(date, Decimal("0"))

    # Step 3: For each day, calculate the capital gain as of the end of that day
    result = []
    for date in date_list:
        capital_gain_at_date = total_capital_gain - future_sums[date]
        # Create timezone-aware datetime at 4:00 AM
        time_with_tz = tz.localize(datetime.combine(date, datetime.min.time()) + timedelta(hours=4))
        formatted_value = f"{capital_gain_at_date:.8f}"
        result.append({"time": time_with_tz.isoformat(), "running_capital_gain": formatted_value})

    return Response(result)


@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensure only authenticated users can access this view
def get_total_unrealizedgains(request):
    """
    View to get the total unrealized gains for all wallets of the authenticated user.
    """
    # logger.info(f"Enter in [get_wallet_capitalgains] for wallet with id {wallet_id}")

    # Get all the wallets for the authenticated user
    user = get_object_or_404(User, id=request.user.id)
    wallets = Wallet.objects.filter(user=user)
    positions = (
        Position.objects.filter(wallet__in=wallets)
        .exclude(contract__category=CategoryContractChoices.STABLE)  # Exclude stable contracts
        .exclude(contract__category=CategoryContractChoices.SUSPICIOUS)  # Exclude suspicious contracts
    )

    unrealized_gain = 0
    for position in positions:
        unrealized_gain += (position.contract.price - position.average_cost) * position.quantity

    return Response([{"total_unrealized_gain": unrealized_gain}])
