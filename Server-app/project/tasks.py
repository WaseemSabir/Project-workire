from datetime import timedelta

from celery import shared_task
from celery.utils.log import get_task_logger

from indexing.utils import notify_google
from django.conf import settings
from project.abstractions.AutoResetCount import AutoResetCounter
from project.abstractions.PeristentQueue import PersistentQueue
from project.add_jobs.AddJobView import add_jobs

logger = get_task_logger(__name__)


@shared_task
def fetch_gulf_jobs():
    add_jobs(
        region_num=0,
        region="Gulf Region",
        zipped_xml_url=("https://www.jobg8.com/fileserver/jobs.aspx?username=c052j!9B8EF0"
                        "&password=fhj479!_569E032&accountnumber=818829&filename=Jobs.zip")
    )


@shared_task
def fetch_uk_jobs():
    add_jobs(
        region_num=1,
        region="Uk Region",
        zipped_xml_url=(
            "https://www.jobg8.com/fileserver/jobs.aspx?username=7CBB9D3C5D"
            "&password=5BFE685C0F&accountnumber=819521&filename=Jobs.zip")
    )


@shared_task
def process_scheduled_google_notifications():
    GOOGLE_API_QUOTA = 20000

    queue = PersistentQueue(queue_name="google_notif_queue")
    counter = AutoResetCounter(count_name="google_notif_count", reset_after=timedelta(days=1))

    if counter.count >= GOOGLE_API_QUOTA:
        print("Ran out of quota")
        return

    if queue.is_empty():
        print("Queue is empty!")
        return

    # max fifty per minute or how much quota is remaining
    print("Total in queue: ", queue.size)
    to_process_no = 50
    data = queue.dequeue_many(no_of_items=to_process_no)
    notify_google(notifications=data)
    queue.persist()
    counter.increment(by=to_process_no)
    print(f"Processed {to_process_no}. Counter: {counter.count}. queued: {queue.size}")
    return
