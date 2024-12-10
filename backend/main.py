###Need to modify search.py with if not price skip from craiglistscraper to skip wanted post
###Need to update last scan time

import json

from urllib3 import request

from craigscraper import scrape_craigslist
from gptconnector import askGPT
from utils import db_connect

def get_request_from_db(cursor, request_id):
    """Fetch a specific request by its ID from the database and reset the status if 'completed'."""
    # Fetch the request by ID
    cursor.execute("SELECT * FROM requests WHERE request_id = %s", (request_id,))
    scan_request = cursor.fetchone()

    if scan_request:
        # If the request status is 'completed', change it back to 'pending'
        request_id, u_id, item_name, user_description, sample_image, status = scan_request
        if status == 'completed':
            update_query = """
            UPDATE requests
            SET status = 'pending'
            WHERE request_id = %s;
            """
            cursor.execute(update_query, (request_id,))
            print(f"Request {request_id} status changed from 'completed' to 'pending'.")

    return scan_request


def update_request_status(cursor, request_id, status):
    """Update the status of a request in the database."""
    update_query = """
    UPDATE requests
    SET status = %s
    WHERE request_id = %s;
    """
    cursor.execute(update_query, (status, request_id))

def insert_result_into_db(cursor, request_id, url, image_url, score):
    """Insert a result into the 'results' table."""
    insert_query = """
    INSERT INTO results (request_id, url, image_url, score)
    VALUES (%s, %s, %s, %s)
    """
    cursor.execute(insert_query, (request_id, url, image_url, score))

def process_request(cursor, request):
    """Process each request from the database."""
    request_id, u_id, item_name, user_description, sample_image, status = request
    print(f"Submitting request for {item_name}")

    # Scrape Craigslist for items
    items = scrape_craigslist(item_name=item_name)
    print(f"Found {len(items)} items for {item_name}")

    items_dict = {item['url']: item for item in items}

    # Ask GPT for results
    results = askGPT(request, items)
    cleaned_results = clean_gpt_response(results)

    # Write and parse results from GPT
    write_results_to_file(cleaned_results)
    results_list = parse_results(cleaned_results)

    # Process each result
    for result in results_list:
        process_result(cursor, request_id, result, items_dict)

def clean_gpt_response(results):
    """Clean and prepare GPT results for further processing."""
    results = results.replace('json', '').replace('`', '')
    return results

def write_results_to_file(results):
    """Write the cleaned results to a file."""
    with open('response_data.json', 'w') as file:
        file.write(results)

def parse_results(results):
    """Parse the results string into a list of results."""
    try:
        return json.loads(results)
    except json.JSONDecodeError:
        print("Error parsing JSON from GPT response.")
        return []

def process_result(cursor, request_id, result, items_dict):
    """Process each individual result."""
    print(f"Processing result: {result}")
    url = result["url"]
    if url in items_dict:
        image_url = items_dict[url]["image_urls"][0]
        score = result["score"]

        # Insert result into 'results' table
        insert_result_into_db(cursor, request_id, url, image_url, score)

        # Update request status to 'completed'
        update_request_status(cursor, request_id, "completed")

def lambda_handler(event, context):
    """Lambda function handler."""
    try:
        request_id = event.get('request_id')
        if not request_id:
            return {
                'statusCode': 400,
                'body': json.dumps('Request ID is required.')
            }
        conn = db_connect()
        cursor = conn.cursor()
        scan_request = get_request_from_db(cursor, request_id)
        # print(scan_request)
        if not scan_request:
            return {
                'statusCode': 404,
                'body': json.dumps(f"Request with ID {request_id} not found.")
            }

        # Process the request
        process_request(cursor, scan_request)
        # Commit changes to the database
        conn.commit()

        return {
            'statusCode': 200,
            'body': json.dumps('Processing completed successfully')
        }

    except Exception as e:
        print(f"Error occurred: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error occurred: {str(e)}")
        }

event = {
    "request_id": 1
}

lambda_handler(event, "")




