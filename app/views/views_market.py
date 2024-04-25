import asyncio
import logging, os

from app.models import Contract
from app.utils.market_data import get_crypto_price

logger = logging.getLogger("blockbuilders")

from aiohttp import ClientSession
from asgiref.sync import sync_to_async

logger.info("Number of CPU : " + str(os.cpu_count()))


@sync_to_async
def set_price(contract: Contract, price):
    contract.price = price
    contract.save()


async def get_price_from_market(symbol):
    tasks = []
    async with ClientSession() as session:
        task = asyncio.ensure_future(get_crypto_price(symbol))
        tasks.append(task)
        responses = await asyncio.gather(*tasks)
    return responses
