import cloudscraper 
# https://pypi.org/project/cloudscraper/

def fetch_page(explorer_url):
    url = f"{explorer_url}"
    scraper = cloudscraper.create_scraper()
    response = scraper.get(url)

    if response.status_code == 200:
        return response.text
    else:
        # Handle errors, e.g., by raising an exception
        raise Exception(str(response.status_code) + f" - Failed to fetch data from " + url)