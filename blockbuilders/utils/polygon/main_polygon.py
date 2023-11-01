
from blockbuilders.utils.polygon.parser_polygon import parse_contract_list, parse_transaction_list
from blockbuilders.utils.scraper import fetch_page

def process_pages(i, explorer_page_url, tokentxns_list, tokentxns_list_unfiltered, contract_list):
    explorer_url_loop = explorer_page_url + str(i+1)
    # scrap
    yc_web_page_loop_wallet = fetch_page(explorer_url_loop)
    # parse
    # parse_transaction_list(yc_web_page_loop_wallet, logger, tokentxns_list, tokentxns_list_unfiltered, i)
    parse_contract_list(yc_web_page_loop_wallet, contract_list, i)