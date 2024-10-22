import logging
logger = logging.getLogger("blockbuilders")

from app.models import ContractCalculator, Position, PositionCalculator, Transaction, TransactionCalculator, Wallet
from django.contrib.auth.decorators import login_required

@login_required
def calculate_wallet_positions(wallet : Wallet):
    positions = Position.objects.filter(wallet=wallet)

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
        reference_average_cost = (
            TransactionCalculator(last_transaction).calculate_average_cost()
            if last_transaction and last_transaction.running_quantity != 0
            else 0
        )

        position_amount = position_calculator.calculate_amount()
        progress_percentage = position_amount / position.wallet.balance * 100 if position.wallet.balance != 0 else 0

        unrealized_gain = (
            (position.contract.price - reference_average_cost) / reference_average_cost * 100
            if round(position_amount, 2) > 0 and reference_average_cost != 0
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
            "avg_cost": position.average_cost,
            "created_at": position.created_at,
            "daily_price_delta": daily_price_delta,
            "weekly_price_delta": weekly_price_delta,
            "monthly_price_delta": monthly_price_delta,
            "unrealized_gain": unrealized_gain,
            "realized_gain": realized_gain,
            "progress_percentage": progress_percentage,
        }

        positions_with_calculator.append(position_data)
       
    return positions_with_calculator, total_realized_gain, total_unrealized_gain