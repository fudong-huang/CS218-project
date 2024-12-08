###Need to modify search.py with if not price skip from craiglistscraper to skip wanted post
###Need to update last scan time
from random import sample

from craigscraper import *
from gptconnector import askGPT
from utils import *
import json

with db_connect() as conn:
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM requests")
        requests = cursor.fetchall()

        for request in requests:
            request_id, u_id, item_name, user_description, sample_image, lastSearchTime = request
            lastSearchTime = lastSearchTime.strftime("%Y-%m-%d %H:%M:%S")
            print(f"Submitting request on {item_name} with {lastSearchTime}")
            items = scrape_craigslist(item_name=item_name, lastSearchTime= lastSearchTime)
            for item in items:
                print(f'{item["url"]} : {item["image_urls"]}')
            items_dict = {item['url']: item for item in items}
            results = askGPT(request, items)
            with open('response_data.json', 'w') as file:
                file.write(results)
            results = results.replace('json', '').replace('`', '')
            results = json.loads(results)
            print(results)
            if not isinstance(results, list):
                results = [results]
            for result in results:
                url = result["url"]
                if url in items_dict:
                    image_url = items_dict[url]["image_urls"][0]
                    score = result["score"]
                    # Insert the data into the 'results' table
                    insert_query = """
                                INSERT INTO results (request_id, url, image_url, score)
                                VALUES (%s,  %s, %s, %s)
                                """
                    cursor.execute(insert_query, (request_id, url, image_url, score))

                    update_query = """
                    UPDATE requests
                    SET last_scan = NOW()
                    WHERE request_id = %s;
                    """
                    cursor.execute(update_query, (request_id,))
                    conn.commit()




