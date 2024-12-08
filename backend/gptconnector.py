from craigscraper import scrape_craigslist
from openai import OpenAI
from utils import *

def askGPT(request, items):
    request_id, u_id, item_name, user_description, sample_image, last_scan = request
    # user_description = "I am looking for a cabinet for my Gundam model kit collections."
    # sample_image_path = "sample.jpeg"
    # image_urls = [
    #     "https://images.craigslist.org/01010_7PXYUta3QhK_0x40t2_600x450.jpg",
    #     "https://images.craigslist.org/00606_isRFd4rz1PZ_0pL0CI_600x450.jpg"
    # ]

    if sample_image:
        base64_image = sample_image
    else:
        base64_image = None

    # Build the messages list dynamically
    messages = [
        {
            "role": "system",
            "content": [
                {
                    "type": "text",
                    "text": "You are an shopping assistance. The user will first provide the description "
                            "of an item and optionally a picture of it. This does not require a respond. "
                            "After that, the user will be providing different text description and/or pictures of different products, "
                            "and you should rate each item with a score of 0 to 100 in terms of if the product "
                            "is what the customer wants for each of them, and only respond with the item that "
                            "has a score higher than 70. The response should be in json format containing the "
                            "{url the item is from}, {image_url} if any, and the score\n"
                }]
        }
    ]


    # text_description = "I am looking for a cabinet for my Gundam model kit collections and the attached image is what I am looking for"
    first_content = []
    if user_description:
        first_content.append(
            {
                "type": "text",
                "text": user_description
            }
        )
    else:        first_content.append(
        {
            "type": "text",
            "text": f"Looking for a {item_name}"
        }
    )


    # Add the base64-encoded sample image (optional)
    if base64_image:
        first_content.append(
            {
                "type": "image_url",
                "image_url":{
                    # "url": f"data:image/jpeg;base64,{base64_image}"
                    "url": f"{base64_image}"
                }
            }
        )

    product_message = {
        "role": "user",
        "content" : first_content
    }

    messages.append(product_message)
    # Add each image URL to the messages
    for item in items:
        print(item)
        url = item['url']
        image_urls = item.get('image_urls')
        description = item.get('description', None)
        if image_urls:
            messages.append(
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": f"here is image from {url}"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_urls[0]
                            }
                        }
                    ]
                }
            )
        else:
            messages.append(
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": f"here is a text description from {url}"
                        },
                        {
                            "type": "text",
                            "text": description
                        }
                    ]
                }
            )


    client = OpenAI()
    print(messages)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        response_format={
            "type": "text"
        },
        temperature=1,
        max_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    return(response.choices[0].to_dict()['message']['content'])

    #response = [Choice(finish_reason='stop', index=0, logprobs=None, message=ChatCompletionMessage(content='https://images.craigslist.org/01010_7PXYUta3QhK_0x40t2_600x450.jpg: 70, https://images.craigslist.org/00606_isRFd4rz1PZ_0pL0CI_600x450.jpg: 80', refusal=None, role='assistant', audio=None, function_call=None, tool_calls=None))]


#[Choice(finish_reason='stop', index=0, logprobs=None,
# message=ChatCompletionMessage(content='https://images.craigslist.org/01010_7PXYUta3QhK_0x40t2_600x450.jpg: 70,
# https://images.craigslist.org/00606_isRFd4rz1PZ_0pL0CI_600x450.jpg: 80', refusal=None, role='assistant',
# audio=None, function_call=None, tool_calls=None))]







