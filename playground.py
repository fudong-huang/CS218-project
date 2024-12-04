import json
from utils import *
# JSON string (with multiple items)
json_string = '''
[
    {
        "url": "https://sfbay.craigslist.org/nby/fuo/d/petaluma-antique-oak-display-cabinet/7807250457.html",
        "image_url": "https://images.craigslist.org/00p0p_9Z4cUM8Vo5l_600x450.jpg",
        "score": 75
    },
    {
        "url": "https://sfbay.craigslist.org/eby/fuo/d/alameda-world-market-curio-display/7806870457.html",
        "image_url": "https://images.craigslist.org/00m0m_aOPjtx68vgu_600x450.jpg",
        "score": 80
    }
]
'''

# Convert the string to a Python list of dictionaries

# data = json.loads(json_string.replace('json', '').replace('`', ''))

# Loop through each item and extract the information

with db_connect() as conn:
    with conn.cursor() as cursor:
        results = json.loads(json_string)
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
