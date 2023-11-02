from datetime import datetime
import re
import lxml
# import cchardet
from bs4 import BeautifulSoup
from collections import ChainMap
from blockbuilders.utils.scraper import fetch_page
from blockbuilders.utils.utils import find_between_strings

# def process_pages(i, explorer_page_url, tokentxns_list, tokentxns_list_unfiltered, contract_list):
    # explorer_url_loop = explorer_page_url + str(i+1)
    # scrap
    # yc_web_page_loop_wallet = fetch_page(explorer_url_loop)
    # parse
    # parse_transaction_list(yc_web_page_loop_wallet, logger, tokentxns_list, tokentxns_list_unfiltered, i)
    # parse_contract_list(yc_web_page_loop_wallet, contract_list, i)

def parse_transaction_pagination(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    page = 1

    for span in soup.find_all(name="span", class_='page-link text-nowrap'):
        page = find_between_strings(span.get_text(), "Page 1 of ", "", 0)
    return page


def parse_transaction_counter(html_content):
    badge_counter = 1
    
    try:
        badge_counter = html_content.find('span', class_='badge badge-pill badge-secondary align-midle').text
    except:
        badge_counter = 1
    
    return badge_counter


def parse_transaction_header(html_content):
    
    transaction_data = {'Timestamp': ''}
    transaction_data_fees = {'Transaction Fees': '0'}
    transaction_data_matic = {'MATIC Price': '0'}

    # Identify the HTML elements containing transaction data and extract it
    transaction_elements = html_content.find_all('div', attrs={"id": "ContentPlaceHolder1_divTimeStamp"})
    for element in transaction_elements:
        transaction_data = {'Timestamp': element.find('div', class_='col-md-9').text}

    transaction_elements = html_content.find_all('div', attrs={"id": "ContentPlaceHolder1_divTxFee"})
    for element in transaction_elements:
        transaction_data_fees = {'Transaction Fees': element.find('span', attrs={"id": "ContentPlaceHolder1_spanTxFee"}).text}

    transaction_elements = html_content.find_all('div', attrs={"id": "ContentPlaceHolder1_closingEtherPrice"})
    for element in transaction_elements:
        transaction_data_matic = {'MATIC Price': element.find('span', attrs={"id": "ContentPlaceHolder1_spanClosingPrice"}).text}

    return dict(ChainMap(transaction_data, transaction_data_fees, transaction_data_matic))

def parse_transaction_detail(html_content, tx_hash, tx_header, wallet):
    
    # Identify the HTML elements containing transaction data and extract it
    transaction_elements = html_content.find_all('li', class_=re.compile("media align-items-baseline mb", re.I)) 

    tx_list = []

    # logger.info(transaction_elements)
    for element in transaction_elements:
        # if a span with this class exists, it means that we are in the right list
        if element.find('span', class_='hash-tag text-truncate hash-tag-custom-from tooltip-address'):
            if element.find('button'):
                transaction_data = {
                    'From' : element.find('span', class_='hash-tag text-truncate hash-tag-custom-from tooltip-address').text,
                    'To' : element.find('span', class_='hash-tag text-truncate hash-tag-custom-to tooltip-address').text,
                    'Qty' : element.find('span', attrs={"data-original-title": re.compile("Current Price", re.I)}).text,
                    'Estimated Value Transfer ($)' : element.find('button').get('value'),
                    'Estimated Value Now ($)' : element.find('button').text,
                    'Token' : element.find_all('a')[-1].get_text()
                }
            else:
                # logger.info(tx_hash)
                # 0xe97f79923f1e416b09f550ca1cc3cb717ee9e9124533d9d527770a1a329552d2
                # 0x37b8455fb41afaca3b76acc5c19ba4024af905a38ccc747229dbfd6c0bb394f4
                # 0x27a20c9eb1ec5dfe0e7519fd60241678c066fbcfa04f937b82eb520a930113de
                # 0x84c1149edd70b07d1a893b2847a26f171ce2cb84f892b39feac44a3649611a62
                # 0x3caee0a555393bb445a7f16d334a7614802281f710471197e7b7eed74585e69b
                transaction_data = {
                    'From' : element.find('span', class_='hash-tag text-truncate hash-tag-custom-from tooltip-address').text,
                    'To' : element.find('span', class_='hash-tag text-truncate hash-tag-custom-to tooltip-address').text,
                    'Qty' : element.find_all('span', class_='mr-1')[-1].get_text(),
                    'Estimated Value Transfer ($)' : '0',
                    'Estimated Value Now ($)' : '0',
                    'Token' : element.find_all('a')[-1].get_text()
                }
        else:
            transaction_data = {
                'ERROR' : 'Wrong Section'
            } 

        tx_full = dict(ChainMap(tx_header, transaction_data, tx_hash))
        
        if wallet in tx_full.values():
                
            # Clean data
            tx_full['Timestamp'] = tx_full['Timestamp'].replace("\n", "")
            if tx_full['Qty'] != '0' : tx_full['Qty'] = find_between_strings(tx_full['Qty'], "", " (", 0).replace(",", "")
            
            if tx_full['Estimated Value Transfer ($)'] != '0' : tx_full['Estimated Value Transfer ($)'] = find_between_strings(tx_full['Estimated Value Transfer ($)'], "$", ")", 0).replace(",", "")
            if tx_full['Estimated Value Now ($)'] != '0' : tx_full['Estimated Value Now ($)'] = find_between_strings(tx_full['Estimated Value Now ($)'], "$", ")", 0).replace(",", "")
            if tx_full['MATIC Price'] != '0' : tx_full['MATIC Price'] = find_between_strings(tx_full['MATIC Price'], "$", " / MATIC", 0).replace(",", "")
            if tx_full['Transaction Fees'] != '0' : tx_full['Transaction Fees'] = find_between_strings(tx_full['Transaction Fees'], "", " MATIC", 0).replace(",", "")

            date_format = '%b-%d-%Y %I:%M:%S %p +%Z' #Jul-25-2023 07:47:46 AM +UTC
            tx_full['Timestamp'] = datetime.strptime(find_between_strings(tx_full['Timestamp'], "(", ")", 0), date_format)

            # Type data
            tx_full['Qty'] = float(tx_full['Qty']) * -1 if tx_full['From'] == wallet else float(tx_full['Qty'])
            tx_full['Estimated Value Transfer ($)'] = float(tx_full['Estimated Value Transfer ($)'])
            tx_full['Estimated Value Now ($)'] = float(tx_full['Estimated Value Now ($)'])
            tx_full['MATIC Price'] = float(tx_full['MATIC Price'])
            tx_full['Transaction Fees'] = float (tx_full['Transaction Fees'])

            tx_list.append(tx_full)
            
    return tx_list

def parse_transaction_list(html_content, logger, tokentxns_list, tokentxns_list_unfiltered, index_page):
    soup_loop = BeautifulSoup(html_content, 'lxml')
    logger.info("Start Loop on page : " + str(index_page + 1))
    print("Start Loop on page : " + str(index_page + 1))

    for link in soup_loop.find_all(name="a", class_='myFnExpandBox_searchVal'):
        tx_id = link.get_text()
        tokentxns_list_unfiltered.append(tx_id)

        if tx_id not in tokentxns_list:
            tokentxns_list.append(tx_id)

        logger.info('#' + str(len(tokentxns_list_unfiltered)) + ' : ' + str(tx_id))

    return tokentxns_list, tokentxns_list_unfiltered

def parse_contract_list(html_content, contract_list, index_page):
    soup_loop = BeautifulSoup(html_content, 'lxml')
    print("Start Loop on page : " + str(index_page + 1))

    for link in soup_loop.find_all(name="a", class_='d-flex align-items-center gap-1 link-dark'):
        contract_url = find_between_strings(link.get("href"), "/token/", "?a=", 0)
        if contract_url not in contract_list:
            contract_list.append(contract_url)

    return contract_list