from craigscraper import *
from gptconnector import askGPT
from utils import *
import json

from datetime import datetime
# item_name = 'display cabinet'
# user_description = "I am looking for a cabinet for my Gundam model kit collections."
# sample_image_path = "sample_2.jpeg"
# request = [1,1,item_name, user_description, sample_image_path, '2024-12-02 11:45:51']


# conn = mysql.connector.connect(
#     host="localhost",
#     user="root",
#     password="Hadoop123!",
#     database="craig"
# )
# cursor = conn.cursor()
# cursor.execute("show databases")
# print(cursor.fetchall())

with db_connect() as conn:
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM requests")
        requests = cursor.fetchall()

        for request in requests:
            print(request)
            request_id, u_id, item_name, user_description, sample_image_path, lastSearchTime = request
            lastSearchTime = lastSearchTime.strftime("%Y-%m-%d %H:%M:%S")
            print(f"Submitting request on {item_name} with {lastSearchTime}")
            items = scrape_craigslist(item_name=item_name, lastSearchTime= lastSearchTime)
            # for item in items:
            #     print(f'{item["url"]} : {item["image_urls"]}')
            results = askGPT(request, items).replace('json', '').replace('`', '')
            with open('response_data.txt', 'w') as file:
                file.write(results)
            results = json.loads(results)
            print(results)

            for result in results:
                url = result["url"]
                image_url = result["image_url"]
                score = result["score"]
                # Insert the data into the 'results' table
                insert_query = """
                            INSERT INTO results (url, image_url, score)
                            VALUES ( %s, %s, %s)
                            """
                cursor.execute(insert_query, (url, image_url, score))
                conn.commit()






