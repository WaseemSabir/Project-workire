from typing import Dict, List
from enum import Enum

import httplib2
from googleapiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials

from project.abstractions.PeristentQueue import PersistentQueue

"""
APIs Implementation for Google API Indexing, mostly used for Job Posting/Single Job Page
"""
SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/batch"


class NotificationType(Enum):
    URL_UPDATED = "URL_UPDATED"
    URL_DELETED = "URL_DELETED"


def notify_google(notifications: List[Dict[str, NotificationType]]):
    json_key_file = "workire-361818-eca3cbc08fb3.json"
    credentials = ServiceAccountCredentials.from_json_keyfile_name(json_key_file, scopes=SCOPES)

    http = credentials.authorize(httplib2.Http())

    service = build('indexing', 'v3', credentials=credentials)

    def insert_event(request_id, response, exception):
        if exception is None:
            print("Success", response)
        else:
            print(request_id, response, exception)

    batch = service.new_batch_http_request(callback=insert_event)

    for notif in notifications:
        body = {
            "url": notif.get("url"),
            "type": notif.get("notification_type").value if notif.get("notification_type") else None
        }
        batch.add(service.urlNotifications().publish(body=body))

    batch.execute(http=http)


def schedule_google_notification(urls: List[str], notif_type: NotificationType):
    queue = PersistentQueue(queue_name="google_notif_queue")
    for url in urls:
        queue.enqueue({
            "url": url,
            "notification_type": notif_type
        })
