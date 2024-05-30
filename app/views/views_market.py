import asyncio
import logging, os

from app.models import Contract
from app.utils.market_data import get_crypto_price

from datetime import date
from datetime import timedelta

logger = logging.getLogger("blockbuilders")

from aiohttp import ClientSession
from asgiref.sync import sync_to_async


@sync_to_async
def set_price(contract: Contract, ticker):
    try:
        contract.price = float(ticker['bid'])
        contract.previous_day_price = float(ticker['open'])
        contract.previous_day = date.today() - timedelta(days = 1)
        contract.save()
    except TypeError:
        logger.info(f"Error Type with {contract.symbol}.")
        contract.price = float(0)
        contract.previous_day_price = float(0)
        contract.previous_day = date.today() - timedelta(days = 1)
        contract.save()


async def get_price_from_market(symbol):
    tasks = []
    async with ClientSession() as session:
        task = asyncio.ensure_future(get_crypto_price(symbol))
        tasks.append(task)
        responses = await asyncio.gather(*tasks)
    return responses
