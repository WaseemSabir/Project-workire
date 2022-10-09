from Company.Serializers import *
from datetime import datetime, timedelta
from django.conf import settings
import os

from Company.utils import send_job_processed_email, save_job, send_email_to_dev
from indexing.utils import schedule_google_notification, NotificationType
from project.utils import correctly_parse_datetime, parse_xml_file, fetch_and_extract_zip_from_url, slugs_to_job_urls
from project.add_jobs.exceptions import JobParsingError


def process_and_save_job_data(job_data: dict, region_num: int) -> Job:
    """
    Process job data so that it is savable!
    such as parse date, and find or create company!
    and then save the job
    """
    job_data['PostDate'] = correctly_parse_datetime(job_data['PostDate'])
    job_data['StartDate'] = correctly_parse_datetime(job_data['StartDate'])

    if not Company.objects.filter(Name=job_data['AdvertiserName']).exists():
        if job_data['LogoURL'] == "":
            company = Company(Name=job_data['AdvertiserName'], Location=job_data['Location'],
                              WebSite=job_data['DescriptionURL'],
                              About=job_data['AdvertiserType'], Categories=job_data['Classification'])
            company.save()
        else:
            company = Company(Name=job_data['AdvertiserName'], Location=job_data['Location'],
                              WebSite=job_data['DescriptionURL'],
                              About=job_data['AdvertiserType'], logo=job_data['LogoURL'],
                              Categories=job_data['Classification'])
            company.save()

    if not Category.objects.filter(Name=job_data['Classification']):
        category = Category(Name=job_data['Classification'])
        category.save()

    company = Company.objects.filter(Name=job_data['AdvertiserName']).first()
    return save_job(job_data, company, region_num)


def delete_jobs(region_num: int, data: list) -> list:
    """
    Delete jobs from database that are not in provided data for that region.
    """
    deleted_jobs_slugs = []
    sender_reference_lookup = {
        new_job['SenderReference']: True
        for new_job in data
    }

    db_jobs = Job.objects.filter(Region=region_num).all()
    for db_job in db_jobs:
        if not sender_reference_lookup.get(db_job.SenderReference, False):
            slug = db_job.slug
            db_job.delete()
            deleted_jobs_slugs.append(slug)

    return deleted_jobs_slugs


def delete_really_old_jobs(region_num: int):
    """
    Delete jobs that are really old and would probably not applicable anymore.
    the number of days determining if a job is old, is in settings!
    """
    temp_days = settings.DELETE_JOBS_OLDER_THAN_DAYS
    days = temp_days if temp_days else 120
    deleted_jobs_slugs = []

    jobs = Job.objects.filter(PostDate__lte=datetime.now() - timedelta(days=days), Region=region_num).all()
    for job in jobs:
        slug = job.slug
        job.delete()
        deleted_jobs_slugs.append(slug)
    return deleted_jobs_slugs


def add_jobs(region: str, region_num: int, zipped_xml_url: str):
    """
    Fetch XML, parse & process the xml data and add/delete jobs from db in that region according
    to the data. Informs the admin about the job import and google about all new or deleted urls.
    """
    abs_path = settings.BASE_DIR

    # remove file if already exists
    try:
        os.remove(os.path.join(abs_path, 'Jobs.xml'))
    except FileNotFoundError:
        pass

    try:
        xml_file = fetch_and_extract_zip_from_url(url=zipped_xml_url, abs_path=abs_path)
        data = parse_xml_file(xml_file)
        if not data:
            raise Exception("No data found.")
    except Exception as e:
        send_email_to_dev(
            subject="Job Processing Error",
            body=f"""
                Server Time: {datetime.now()}
                Region: {region}
                Error: {e}
            """
        )
        return

    # delete jobs not in data
    deleted_jobs_slugs = []
    try:
        deleted_jobs_slugs = delete_jobs(region_num=region_num, data=data)
        urls = slugs_to_job_urls(slugs=deleted_jobs_slugs)
        schedule_google_notification(urls=urls, notif_type=NotificationType.URL_DELETED)
    except JobParsingError as e:
        # send and move on
        send_email_to_dev(
            subject="Job Deletion Error",
            body=f"""
                Server Time: {datetime.now()}
                Region: {region}
                Error: {e}
            """
        )

    # add new jobs in database
    new_jobs_slugs = []
    failed_jobs = 0
    last_exception = None

    for job_data in data:
        job_exists = Job.objects.filter(SenderReference=job_data['SenderReference']).exists()
        if not job_exists:
            try:
                new_job = process_and_save_job_data(job_data=job_data, region_num=region_num)
                new_jobs_slugs.append(new_job.slug)
            except Exception as e:
                failed_jobs += 1
                last_exception = str(e)

    try:
        urls = slugs_to_job_urls(slugs=new_jobs_slugs)
        schedule_google_notification(urls=urls, notif_type=NotificationType.URL_UPDATED)
    except Exception as e:
        send_email_to_dev(
            subject="Job Updated Notification Failed",
            body=f"""
                Server Time: {datetime.now()}
                Region: {region}
                Error: {e}
            """
        )

    if failed_jobs > 10:
        send_email_to_dev(
            subject="Job Saving Failed",
            body=f"""
                Server Time: {datetime.now()}
                Region: {region}
                Error: {last_exception}
            """
        )

    # send report to admin
    try:
        total_jobs = Job.objects.all().count()
        new_jobs = len(new_jobs_slugs)
        deleted_jobs = len(deleted_jobs_slugs)
        send_job_processed_email(deleted_jobs, new_jobs, total_jobs, region)
    except Exception as e:
        print(e)
