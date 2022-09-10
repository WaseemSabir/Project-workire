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


def notify_google(url: str, notification_type: NotificationType, retry_attempt: int = 0) -> bool:
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
        sleep(5)
        # whether any of the tries ended being successful
        return (False or notify_google(url, notification_type, retry_attempt + 1))
    else:
        return True


def notify_google_in_batch_single_jobs_page(slugs: List[str], typ: NotificationType) -> None:
    done = 0
    err = 0

    for slug in slugs:
        url = f"https://workire.com/job/{slug}"
        successful = notify_google(url, NotificationType.URL_UPDATED)
        if successful:
            done += 1
        else:
            err +=1

    report = f"""
        Notfication Type: {typ.value}
        Successful: {done}
        Errored: {err}
        Total: {len(slugs)}
    """
    print(report)


def notify_google_about_new_urls(slugs: List[str]) -> None:
    notify_google_in_batch_single_jobs_page(slugs, NotificationType.URL_UPDATED)


def notify_google_about_deleted_urls(slugs: List[str]) -> None:
    notify_google_in_batch_single_jobs_page(slugs, NotificationType.URL_DELETED)
