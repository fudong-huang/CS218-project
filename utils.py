import mysql.connector
import base64

def db_connect():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Hadoop123!",
        database="craig"
    )
    return conn

def queryRequest(cursor):
    query = "SELECT requestId, uId, item_name, description, pic, last_scan FROM request"
    cursor.execute(query)
    results = cursor.fetchall()
    return results

# Function to encode the image to base64
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")