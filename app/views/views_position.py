import logging

from celery import chain, chord, group

from app.tasks import (
    calculate_wallet_balance_task,
    delete_position_task,
    get_full_init_historical_price_from_market_task,
    get_historical_price_from_market_task,
    get_price_from_market_task,
    update_contract_information,
)

logger = logging.getLogger("blockbuilders")

from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, render, redirect

from django.contrib.auth.decorators import login_required

from app.models import (
    ContractCalculator,
    Position,
    PositionCalculator,
    Transaction,
    TransactionCalculator,
    UserSetting,
    Wallet,
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
    positions = Position.objects.filter(wallet=wallet)

    user_setting, created = UserSetting.objects.get_or_create(user=request.user)
    user_setting.save()

    logger.info("Number of positions found : " + str(positions.count()))
    logger.info("User Setting - show_positions_above_threshold : " + str(user_setting.show_positions_above_threshold))

    positions_with_calculator = []
    total_realized_gain = 0
    total_unrealized_gain = 0

    for position in positions:
        position_calculator = PositionCalculator(position)
        contract_calculator = ContractCalculator(position.contract)

        daily_price_delta = contract_calculator.calculate_daily_price_delta()
        weekly_price_delta = contract_calculator.calculate_weekly_price_delta()
        monthly_price_delta = contract_calculator.calculate_monthly_price_delta()

        last_transaction = Transaction.objects.filter(position=position).order_by("-date").first()
        reference_avg_cost = (
            TransactionCalculator(last_transaction).calculate_avg_cost()
            if last_transaction and last_transaction.running_quantity != 0
            else 0
        )

        position_amount = position_calculator.calculate_amount()
        progress_percentage = position_amount / position.wallet.balance * 100 if position.wallet.balance != 0 else 0

        unrealized_gain = (
            (position.contract.price - reference_avg_cost) / reference_avg_cost * 100
            if round(position_amount, 2) > 0 and reference_avg_cost != 0
            else 0
        )
        total_unrealized_gain += unrealized_gain

        # Calculate realized gain for the position
        realized_gain = sum(
            TransactionCalculator(transaction).calculate_capital_gain()
            for transaction in Transaction.objects.filter(position=position)
        )
        total_realized_gain += realized_gain

        position_data = {
            "id": position.id,
            "wallet": position.wallet,
            "contract": position.contract,
            "quantity": position.quantity,
            "amount": position_amount,
            "avg_cost": position.avg_cost,
            "created_at": position.created_at,
            "daily_price_delta": daily_price_delta,
            "weekly_price_delta": weekly_price_delta,
            "monthly_price_delta": monthly_price_delta,
            "unrealized_gain": unrealized_gain,
            "realized_gain": realized_gain,
            "progress_percentage": progress_percentage,
        }

        # if the user only wants to see positions above the $0.5 threshold --> filter
        if user_setting and user_setting.show_positions_above_threshold:
            if position_amount > 0.5:
                positions_with_calculator.append(position_data)
        else:
            positions_with_calculator.append(position_data)

    sorted_positions_desc = sorted(positions_with_calculator, key=lambda x: x["amount"], reverse=True)

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


@login_required
def refresh_wallet_position_price(request, wallet_id: int):
    """
    View to refresh position prices of a wallet by chaining several Celery tasks.
    """
    wallet = get_object_or_404(Wallet, id=wallet_id)
    positions = Position.objects.filter(wallet=wallet)
    symbol_set = {
        position.contract.symbol for position in positions if not position.contract.symbol[0].islower()
    }  # exclusion of all the derivative token (f.e. aPolMIMATIC, amUSDC, etc...)
    symbol_list = list(symbol_set)

    for symbol in symbol_list:
        chain(get_historical_price_from_market_task.s(symbol), update_contract_information.s(symbol))()

    chain_result = chain(
        get_price_from_market_task.s(symbol_list),
        calculate_wallet_balance_task.s(wallet_id),
    )()

    logger.info(f"Started getting position prices for wallet with id {wallet_id}")
    return redirect("dashboard")


@login_required
def refresh_full_historical_position_price(request, wallet_id: int):
    """
    View to refresh full position prices of a wallet by chaining several Celery tasks.
    """
    wallet = get_object_or_404(Wallet, id=wallet_id)
    positions = Position.objects.filter(wallet=wallet)
    symbol_set = {
        position.contract.symbol for position in positions if not position.contract.symbol[0].islower()
    }  # exclusion of all the derivative token (f.e. aPolMIMATIC, amUSDC, etc...)
    symbol_list = list(symbol_set)

    for symbol in symbol_list:
        chain(get_full_init_historical_price_from_market_task.s(symbol))()

    logger.info(f"Started getting full position prices for wallet with id {wallet_id}")
    return redirect("dashboard")
