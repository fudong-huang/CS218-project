import sys
import os
from utils import *
# Add the CraigslistScraper-master folder to sys.path
sys.path.append(os.path.abspath("CraigslistScraper-master"))
import craigslistscraper as cs


image_path = "sample_picture/sample.jpeg"
output_path = "sample_picture/test_db.jpeg"
base_image = encode_image("sample_picture/sample_3.jpeg")
encoded_string_file = "encode_string.txt"
def decode_image(encoded_data, output_path):
    """
    Decodes a base64-encoded string and writes it to a file.
    Args:
        encoded_data (str): Base64-encoded image data.
        output_path (str): Path to save the decoded image file.
    """
    with open(output_path, "wb") as file:
        file.write(base64.b64decode(encoded_data))
with db_connect() as conn:
    with conn.cursor() as cursor:
        # # Encode the image and insert into the database
        # encoded_image = encode_image(image_path)
        # with open(encoded_string_file, "w") as file:
        #     file.write(encoded_image)
        # insert_query = "INSERT INTO pic (code) VALUES (%s)"
        # cursor.execute(insert_query, (encoded_image,))
        # conn.commit()
        # print("Image successfully encoded and saved to the database.")

        # Fetch the encoded image back from the database
        select_query = "SELECT code FROM pic LIMIT 1"  # Get the most recent entry
        cursor.execute(select_query)
        result = cursor.fetchone()  # Fetch the first row
        print(result)
        if result:
            retrieved_image = result[0]  # Base64-encoded image data
            decode_image(retrieved_image, output_path)
            # print(f"Image successfully retrieved and saved as {output_path}")
        else:
            print("No image found in the database.")



#
# search = cs.Search(
#     query='display cabinet',
#     city='sfbay'
# )
#
# status = search.fetch()
#
# for ad in search.ads[0:30]:
#     print(ad.to_dict())
#
# [][0]
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


# from utils import *
#
# with db_connect() as conn:
#     with conn.cursor() as cursor:
#         update_query = """
#                     UPDATE requests
#                     SET last_scan = NOW()
#                     WHERE requestId = %s;
#                     """
#
#         cursor.execute(update_query, ("16",))
#         conn.commit()