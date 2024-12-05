# import craigslistscraper as cs
#
# search = cs.Search(
#     query='display cabinet',
#     city='sfbay'
# )
#
# status = search.fetch()
#
# for ad in search.ads[0:100]:
#     print(ad.to_dict())
#
# from bs4 import BeautifulSoup
# import requests
#
# response = requests.get("https://sfbay.craigslist.org/sfc/hsh/d/san-francisco-fj-outdoors-patio-table/7801027995.html")
# if response.status_code != 200:
#     print(f"Failed to fetch page. Status code: {response.status_code}")
#
# soup = BeautifulSoup(response.text, 'html.parser')
# img_tags = soup.find_all("img")
# img_urls = []
# for img_tag in img_tags:
#     print(img_tag['src'])
# 
# import json
# with open('response_data.json', 'r') as file:
#     results = file.read()
# results = results.replace('json', '').replace('`', '')
# results = json.loads(results)
# # print(results)
# 
# items = [
#     {"url": "https://sfbay.craigslist.org/sfc/fuo/d/daly-city-display-cabinet/7807706949.html", "image_urls": "Example", "type": "website"},
#     {"url": "https://sfbay.craigslist.org/nby/clt/d/petaluma-display-cabinet/7807108043.html", "image_urls": "Another", "type": "website"}
# ]
# items_dict = {item['url']: item for item in items}
# 
# 
# for result in results:
#     url = result["url"]
#     image_url = items_dict[url]["image_urls"]
#     score = result["score"]

from utils import *

with db_connect() as conn:
    with conn.cursor() as cursor:
        update_query = """
                    UPDATE requests
                    SET last_scan = NOW()
                    WHERE requestId = %s;
                    """

        cursor.execute(update_query, ("16",))
        conn.commit()