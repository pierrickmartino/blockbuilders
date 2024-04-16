
# https://github.com/ccxt/ccxt/tree/master/python

#import ccxt
import asyncio
import ccxt.async_support as ccxt
from blockbuilders.settings.base import BINANCE_API_KEY, BINANCE_SECRET_KEY

print('CCXT Version:', ccxt.__version__)

exchange_id = 'binance'
exchange_class = getattr(ccxt, exchange_id)
exchange = exchange_class({
    'apiKey': BINANCE_API_KEY,
    'secret': BINANCE_SECRET_KEY,
})

async def get_top50_tickers():

    blacklist_stable_string = "BUSD|CUSD|CUSDT|DAI|PAXG|SUSD|TUSD|USDC|USDN|USDP|USDT|VAI|UST|USTC|AUSD"
    blacklist_other_string = "1EARTH|ILA|BOBA|CTXC|CWAR|HBAR|NMR|OMG|ONG|ARDR|DMTR|MLS|TORN|LUNA|BTS|QKC|COS|ACA|FTT|SRM|YFII|SNM|BNX|ANC|AION|MIR|BNX|STG|HNT|WABI|QLC|NEBL|AUTO|VGX|PEPE"
    blacklist_fan_string = "ACM|AFA|ALA|ALL|ALPINE|APL|ASR|ATM|BAR|CAI|CHZ|CITY|FOR|GAL|GOZ|IBFK|JUV|LEG|LOCK-1|NAVI|NMR|NOV|PFL|PSG|ROUSH|STV|TH|TRA|UCH|UFC|YBO"
    
    blacklist_stable = blacklist_stable_string.split("|")
    blacklist_other = blacklist_other_string.split("|")
    blacklist_fan = blacklist_fan_string.split("|")

    blacklist_startedwith = blacklist_fan + blacklist_other + blacklist_stable

    await exchange.load_markets()
    
    symbols = list(exchange.markets.keys())
    print(len(symbols))
    symbols_filtered = [x for x in symbols if x[-4:] == "USDT"]
    print(len(symbols_filtered))
    symbols_filtered_2 = [x for x in symbols_filtered if x[-5:] != ":USDT"]
    print(len(symbols_filtered_2))
    symbols_filtered_3 = [x for x in symbols_filtered_2 if x.replace("/USDT", "") not in blacklist_startedwith]
    print(len(symbols_filtered_3))
    symbols_filtered_4 = [x for x in symbols_filtered_3 if x.replace("/USDT", "")[-2:] != "UP"]
    print(len(symbols_filtered_4))
    symbols_filtered_5 = [x for x in symbols_filtered_4 if x.replace("/USDT", "")[-4:] not in ["DOWN", "BULL", "BEAR", "HALF"]]
    print(len(symbols_filtered_5))
    
    # get all tickers sorted by quote volume : volume of quote currency traded for last 24 hours
    #tickers = sorted(exchange.fetch_tickers().values(),key=lambda x: x['quoteVolume'], reverse=True)
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    tickers = await asyncio.run(sorted(exchange.fetch_tickers().values(),key=lambda x: x['quoteVolume'], reverse=True))

    final_tickers = [ticker for ticker in tickers if ticker['quoteVolume'] != 0 and ticker['symbol'] in symbols_filtered_5]
    print(final_tickers[:20])

    return final_tickers[:20]


async def get_crypto_price(symbol):
    try:
        task = asyncio.create_task (exchange.fetch_ticker(symbol=symbol.upper()))
        ticker = await task

        await exchange.close()
     
        result = float(ticker['bid'])
        print(str(result) + ' - ' + ticker['symbol'])
        return result
    except Exception as e:
        print(e)
        return float(0)
        

# {
#     'symbol':        string symbol of the market ('BTC/USD', 'ETH/BTC', ...)
#     'info':        { the original non-modified unparsed reply from exchange API },
#     'timestamp':     int (64-bit Unix Timestamp in milliseconds since Epoch 1 Jan 1970)
#     'datetime':      ISO8601 datetime string with milliseconds
#     'high':          float, // highest price
#     'low':           float, // lowest price
#     'bid':           float, // current best bid (buy) price
#     'bidVolume':     float, // current best bid (buy) amount (may be missing or undefined)
#     'ask':           float, // current best ask (sell) price
#     'askVolume':     float, // current best ask (sell) amount (may be missing or undefined)
#     'vwap':          float, // volume weighed average price
#     'open':          float, // opening price
#     'close':         float, // price of last trade (closing price for current period)
#     'last':          float, // same as `close`, duplicated for convenience
#     'previousClose': float, // closing price for the previous period
#     'change':        float, // absolute change, `last - open`
#     'percentage':    float, // relative change, `(change/open) * 100`
#     'average':       float, // average price, `(last + open) / 2`
#     'baseVolume':    float, // volume of base currency traded for last 24 hours
#     'quoteVolume':   float, // volume of quote currency traded for last 24 hours
# }