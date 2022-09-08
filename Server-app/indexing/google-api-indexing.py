import json
from enum import Enum
from time import sleep
from typing import List

from oauth2client.service_account import ServiceAccountCredentials
import httplib2

SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"

"""
APIs Implementation for Google API Indexing, mostly used for Job Posting/Single Job Page
"""


def create_http_client() -> httplib2.Http:
    JSON_KEY_FILE = "workire-361818-eca3cbc08fb3.json"
    credentials = ServiceAccountCredentials.from_json_keyfile_name(JSON_KEY_FILE, scopes=SCOPES)
    return credentials.authorize(httplib2.Http())


class NotificationType(Enum):
    URL_UPDATED = "URL_UPDATED"
    URL_DELETED = "URL_DELETED"


def notify_google(url: str, notification_type: NotificationType, retry_attempt: int = 0) -> None:
    http_client = create_http_client()
    body = {
        "url": url,
        "type": notification_type.value
    }

    response, content = http_client.request(
        uri=ENDPOINT,
        method="POST",
        headers={"Content-Type": "application/json"},
        body=json.dumps(body)
    )

    # Retry 3 times if the request failed
    if response.status != 200 and retry_attempt < 3:
        # wait a few seconds and try again
        sleep(3)
        notify_google(url, notification_type, retry_attempt + 1)


def notify_google_about_new_urls(urls: List[str]) -> None:
    for url in urls:
        notify_google(url, NotificationType.URL_UPDATED)


def notify_google_about_deleted_urls(urls: List[str]) -> None:
    for url in urls:
        notify_google(url, NotificationType.URL_DELETED)
