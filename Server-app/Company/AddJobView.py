from typing import Dict, Optional

from Company.models import *
from Company.Serializers import *
from datetime import datetime, timedelta
import xml.etree.ElementTree as ET
import requests
from io import BytesIO
from zipfile import ZipFile
import os
from apscheduler.schedulers.background import BackgroundScheduler
from django.conf import settings
from django.utils.dateparse import parse_datetime
from django.utils.timezone import is_aware, make_aware
from django.utils.text import slugify
from indexing.utils import *

from Company.utils import send_job_processed_email

toggle_site_to_index_from_urls_list = 0


class JobParsingError(Exception):
    pass


# Helper Functions
def read_tag(tags_list) -> Dict[str, str]:
    lookup = {}
    for tag in tags_list:
        if not tag.text:
            lookup[tag.text] = tag.text
        else:
            lookup[tag.text] = ""

    return lookup


def parse_xml_file(file) -> list:
    tree = ET.parse(file)
    root = tree.getroot()

    elements = []
    for elem in root:
        elements.append(read_tag(elem))

    return elements


# reads xml file from url and parses the data
def parse_xml_from_url(url, count, abs_path) -> list:
    try:
        os.remove(os.path.join(abs_path, 'Jobs.xml'))
        content = requests.get(url)
        f = ZipFile(BytesIO(content.content))
        f.extractall(path=abs_path, )

        data = None
        for i in f.namelist():
            data = parse_xml_file(os.path.join(abs_path, i))

        return data
    except Exception as e:
        raise JobParsingError(f"{count}. Exception: Failed to read xml from url\n", e, '\n')


# Takes company and job data objects and tries to save them in db
def save_job(i, company, count) -> Job:
    try:
        job = Job(
            Company=company,
            AdvertiserName=i['AdvertiserName'], AdvertiserType=i['AdvertiserType'],
            SenderReference=i['SenderReference'],
            DisplayReference=i['DisplayReference'], PostDate=i['PostDate'], Classification=i['Classification'],
            SubClassification=i['SubClassification'], Position=i['Position'], Description=i['Description'],
            Country=i['Country'], Location=i['Location'], Area=i['Area'],
            PostalCode=i['PostalCode'], ApplicationURL=i['ApplicationURL'], DescriptionURL=i['DescriptionURL'],
            Language=i['Language'],
            ContactName=i['ContactName'], EmploymentType=i['EmploymentType'], StartDate=i['StartDate'],
            Duration=i['Duration'], WorkHours=i['WorkHours'], SalaryCurrency=i['SalaryCurrency'],
            SalaryMinimum=i['SalaryMinimum'], SalaryMaximum=i['SalaryMaximum'], SalaryPeriod=i['SalaryPeriod'],
            SalaryAdditional=i['SalaryAdditional'], JobSource=i['JobSource'], JobSourceURL=i['JobSourceURL'],
            VideoLinkURL=i['VideoLinkURL'], AdditionalClassification1=i['AdditionalClassification1'],
            AdditionalClassification2=i['AdditionalClassification2'],
            AdditionalClassification3=i['AdditionalClassification3'],
            AdditionalClassification4=i['AdditionalClassification4'],
            LogoURL=company.logo, JobType=i['JobType'],
            Region=count
        )
        job.save()
        job.slug = slugify(job.Position) + '-' + str(job.id)  # save slug
        job.save()
        return job

    except Exception as e:
        raise JobParsingError(f"{count}. Exception: Failed to save a job\n", e, '\n')


def correctly_parse_datetime(date_iso: str) -> datetime:
    try:
        to_ret = parse_datetime(date_iso)

        if is_aware(to_ret):
            return to_ret
        else:
            return make_aware(to_ret)

    except:
        return datetime.now()


# Takes one job data and process it and triggers save_job func
def process_job_data(i, count) -> Job:
    try:
        i['PostDate'] = correctly_parse_datetime(i['PostDate'])
        i['StartDate'] = correctly_parse_datetime(i['StartDate'])

        if not Company.objects.filter(Name=i['AdvertiserName']).exists():
            if i['LogoURL'] == "":
                company = Company(Name=i['AdvertiserName'], Location=i['Location'], WebSite=i['DescriptionURL'],
                                  About=i['AdvertiserType'], Categories=i['Classification'])
                company.save()
            else:
                company = Company(Name=i['AdvertiserName'], Location=i['Location'], WebSite=i['DescriptionURL'],
                                  About=i['AdvertiserType'], logo=i['LogoURL'], Categories=i['Classification'])
                company.save()

        if not Category.objects.filter(Name=i['Classification']):
            category = Category(Name=i['Classification'])
            category.save()

        company = Company.objects.filter(Name=i['AdvertiserName']).first()
        return save_job(i, company, count)

    except Exception as e:
        raise JobParsingError(f"{count}. Exception: Failed to process job data\n", e, '\n')


def delete_jobs(count, data, deleted_jobs_slugs):
    try:
        display_reference_lookup = {
            new_job['DisplayReference']: True
            for new_job in data
        }

        db_jobs = Job.objects.filter(Region=count).all()
        for db_job in db_jobs:
            if not display_reference_lookup.get(db_job.DisplayReference, False):
                slug = db_job.slug
                db_job.delete()
                deleted_jobs_slugs.append(slug)

    except Exception as e:
        raise JobParsingError(f"{count}. Exception: Failed to delete jobs\n", e, '\n')


def delete_jobs_older_than_days(count, deleted_jobs_slugs):
    temp_days = settings.DELETE_JOBS_OLDER_THAN_DAYS
    days = temp_days if temp_days else 120

    try:
        jobs = Job.objects.filter(PostDate__lte=datetime.now() - timedelta(days=days)).all()
        for job in jobs:
            slug = job.slug
            job.delete()
            deleted_jobs_slugs.append(slug)

    except Exception as e:
        raise JobParsingError(f"{count}. Exception: Failed to delete jobs older than {days} days\n", e, '\n')


def fetch_xml_and_add_jobs_in_db():
    try:
        urls = [
            "https://www.jobg8.com/fileserver/jobs.aspx?username=c052j!9B8EF0&password=fhj479!_569E032&accountnumber=818829&filename=Jobs.zip",
            "https://www.jobg8.com/fileserver/jobs.aspx?username=7CBB9D3C5D&password=5BFE685C0F&accountnumber=819521&filename=Jobs.zip"
        ]
        regions = [
            "Gulf",
            "UK"
        ]

        global toggle_site_to_index_from_urls_list
        curr_url = urls[toggle_site_to_index_from_urls_list]

        # Used to save the region of the job (region is used while deleting the jobs)
        url_no_in_list = toggle_site_to_index_from_urls_list

        # read and parse the xml file from url
        abs_path = settings.BASE_DIR
        data = parse_xml_from_url(curr_url, url_no_in_list, abs_path)

        # delete jobs that are no longer in xml file
        deleted_jobs_slugs = []
        try:
            delete_jobs(url_no_in_list, data, deleted_jobs_slugs)
        except JobParsingError as e:
            print(e)

        # delete jobs older than 120 days
        try:
            delete_jobs_older_than_days(url_no_in_list, deleted_jobs_slugs)
        except JobParsingError as e:
            print(e)

        # add jobs that are not in db
        new_jobs_slugs = []
        for job in data:
            job_exists = Job.objects.filter(DisplayReference=job['DisplayReference']).first()
            if not job_exists:
                try:
                    job = process_job_data(job, url_no_in_list)
                    new_jobs_slugs.append(job.slug)
                except JobParsingError as e:
                    print(e)

        # send email to admin
        total_jobs = Job.objects.all().count()
        new_jobs = len(new_jobs_slugs)
        deleted_jobs = len(deleted_jobs_slugs)

        send_job_processed_email(deleted_jobs, new_jobs, total_jobs, regions[url_no_in_list])

        # notify google about new pages
        try:
            notify_google_about_deleted_urls(deleted_jobs_slugs)
            notify_google_about_new_urls(new_jobs_slugs)
        except Exception as e:
            print(f"Exception: Failed to notify google about new pages\n", e, '\n')

        # Move to next url for next iteration (scheduled), but if we are at the end, go to the first one
        toggle_site_to_index_from_urls_list += 1
        toggle_site_to_index_from_urls_list %= len(urls)

    except Exception as e:
        print("Mega Exception: Post function errored out!\n", e)


def start():
    if os.environ.get('RUN_MAIN') != 'true':
        scheduler = BackgroundScheduler()
        scheduler.add_job(fetch_xml_and_add_jobs_in_db, 'interval', minutes=60 * 2)  # every 2 hours
        scheduler.start()
