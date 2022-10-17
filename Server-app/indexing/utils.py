from typing import Dict, List
from enum import Enum
import os

import httplib2
from googleapiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials

from project.abstractions.PeristentQueue import PersistentQueue
from django.conf import settings

"""
APIs Implementation for Google API Indexing, mostly used for Job Posting/Single Job Page
"""
SCOPES = [ "https://www.googleapis.com/auth/indexing" ]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"

class NotificationType(Enum):
    URL_UPDATED = "URL_UPDATED"
    URL_DELETED = "URL_DELETED"


def notify_google(notifications: List[Dict[str, NotificationType]]):
    json_key_file = "workire-361818-7fbb73a8edaa.json"
    full_path = os.path.join(settings.BASE_DIR, json_key_file)

    credentials = ServiceAccountCredentials.from_json_keyfile_name(full_path, scopes=SCOPES)
    http = credentials.authorize(httplib2.Http())

    service = build('indexing', 'v3', credentials=credentials, cache_discovery=False)
    global successful
    successful = 0

    def insert_event(request_id, response, exception):
        global successful
        if exception is None:
            successful +=1 
        else:
            print(exception)

    batch = service.new_batch_http_request(callback=insert_event)

    for notif in notifications:
        body = {
            "url": notif.get("url"),
            "type": notif.get("notification_type").value if notif.get("notification_type") else None
        }
        batch.add(service.urlNotifications().publish(body=body))

    batch.execute(http=http)
    print(f"Successful {successful}/{len(notifications)}")


def schedule_google_notification(urls: List[str], notif_type: NotificationType):
    queue = PersistentQueue(queue_name="google_notif_queue")
    for url in urls:
        queue.enqueue({
            "url": url,
            "notification_type": notif_type
        })
