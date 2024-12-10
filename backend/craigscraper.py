import time

import requests
from bs4 import BeautifulSoup
from datetime import datetime
import sys
import os

# Add the CraigslistScraper-master folder to sys.path
sys.path.append(os.path.abspath("CraigslistScraper-master"))

# Now you can import the package/module
import craigslistscraper as cs

def scrape_craigslist(item_name, city="sfbay"):
    search = cs.Search(
        query=item_name,
        city=city
    )
    items = []
    # Fetch the HTML from the server
    status = search.fetch()
    if status != 200:
        raise Exception(f"Unable to fetch search with status <{status}>.")
    for ad in search.ads[0:15]:
        time.sleep(1)
        # Fetch additional information about each ad
        status = ad.fetch()
        if status != 200:
            print(f"Unable to fetch ad '{ad.title}' with status <{status}>.")
            continue

        # Extract ad details
        # dict_keys(['url', 'price', 'title', 'd_pid', 'description', 'image_urls', 'attributes'])
        data = ad.to_dict()
        url = data['url']
        response = requests.get(url)
        if response.status_code != 200:
            print(f"Failed to fetch page. Status code: {response.status_code}")
            continue

        soup = BeautifulSoup(response.text, 'html.parser')
        # itemTime = soup.find('time', class_='date').text.strip()
        # if itemTime:
        #     if  isNewItem(itemTime, lastSearchTime):
        #         # print(f'{data["url"]}, {itemTime}, {lastSearchTime}')
        #         items.append(data)
        if not data['image_urls']:
            image_urls = []
            img_tags = soup.find_all("img")
            for img_tag in img_tags:
                image_urls.append(img_tag['src'])
            if image_urls:
                data['image_urls'] = image_urls
            else:
                data['image_urls'] = ['https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png']
        items.append(data)

    print(f"New items found : {len(items)}")
    return items

##
# def isNewItem(itemTime, lastSearchTime):
#     dt1 = datetime.strptime(itemTime, "%Y-%m-%d %H:%M")
#     dt2 = datetime.strptime(lastSearchTime, "%Y-%m-%d %H:%M:%S")
#     return dt1 > dt2

# items = scrape_craigslist("display cabinet")
# for item in items:
#     print(f'{item["url"]} : {item["image_urls"]}')