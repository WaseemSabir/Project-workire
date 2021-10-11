from django.shortcuts import render
from .models import *
from .Serializers import *
from datetime import datetime
import xml.etree.ElementTree as ET
import requests
from io import BytesIO
from zipfile import ZipFile
import os
from apscheduler.schedulers.background import BackgroundScheduler
from django.core.management.color import no_style
from django.db import connection
from dateutil.parser import parse
from .globalFunc import save_count, get_count

# Helper Functions
def read_tag(list):
    l = {}
    for i in list:
        if i.text != None:
            l[i.tag] = i.text
        else:
            l[i.tag] = ""
    return l

def read_xml(file):
    tree = ET.parse(file)
    root = tree.getroot()
    l = []
    for elem in root:
        l.append(read_tag(elem))
    return l

# reads xml file from url
def read_xml_from_url(url, count, abs_path):
    try:
        print(f"{count}. Checking for xml file in ...")
        os.remove(f'{abs_path}/Jobs.xml')
        print(f"{count}. Found and deleted the previous XML file...")
    except:
        print(f"{count}. No XML file found! Carrying on...")

    try:
        print(f"{count}. Now getting the XML files")
        content = requests.get(url)
        f = ZipFile(BytesIO(content.content))
        print(f"{count}. Reterieved ...")
        f.extractall(path=abs_path,)
        print(f"{count}. Extracted ...")

        data = None
        for i in f.namelist():
            print(f"{count}. Trying to read file")
            data = (read_xml(abs_path+i))
        print(f"{count}. file read successfully...")
        
        return data

    except Exception as e:
        print(f"{count}. unable to retreive or read XML file... ")
        print(f"{count}. Exception : ",e)
        return {}


# Takes company and job data objects and tries to save them in db
def save_job(i,company, count):
    try:
        job = Job(
                    Company=company,
                    AdvertiserName=i['AdvertiserName'],  AdvertiserType=i['AdvertiserType'], SenderReference=i['SenderReference'],
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
                    AdditionalClassification2=i['AdditionalClassification2'], AdditionalClassification3=i['AdditionalClassification3'],
                    AdditionalClassification4=i['AdditionalClassification4'],
                    LogoURL=company.logo, JobType=i['JobType'],
                    Region=count
                )
        job.save()
        return True
    except:
        return False

# Takes one job data and process it and triggers save_job func
def process_job_data(i, count):
    try:
        try:
            datatime = i['PostDate'].split("T")
            datatime[0] = datatime[0].split("-")
            datatime[1] = datatime[1].split(":")
            i['PostDate'] = datetime(int(datatime[0][0]), int(datatime[0][1]), int(datatime[0][2]), int(datatime[1][0]), int(datatime[1][1]), int(datatime[1][2]))
        except:
            i['PostDate'] = datetime.now()

        if i['StartDate'] == "":
            i["StartDate"] = datetime.now()
        else:
            try:
                start = parse(i['StartDate'])
            except:
                i['StartDate'] = datetime.now()

        if not Company.objects.filter(Name=i['AdvertiserName']).exists():
            if i['LogoURL'] == "":
                company = Company(Name=i['AdvertiserName'], Location=i['Location'],WebSite=i['DescriptionURL'], About=i['AdvertiserType'], Categories=i['Classification'])
                company.save()
            else:
                company = Company(Name=i['AdvertiserName'], Location=i['Location'],WebSite=i['DescriptionURL'], About=i['AdvertiserType'], logo=i['LogoURL'], Categories=i['Classification'])
                company.save()

        if not Category.objects.filter(Name=i['Classification']):
            category = Category(Name=i['Classification'])
            category.save()

        company = Company.objects.filter(Name=i['AdvertiserName'])[0]
        saved = save_job(i,company, count)
        if not saved:
            print(f"{count}. Exception: Failed to save a job via save_job\n")
    
    except Exception as e:
        print(f"{count}. Exception: Failed to save a job\n",e,'\n')

def delete_jobs(count, data):
    try:
        jobs = Job.objects.filter(Region=count)
        for i in jobs:
            isIn = False
            error = False
            try:
                for j in data:
                    if j['DisplayReference'] == i.DisplayReference:
                        isIn = True
            except Exception as e:
                error = True
                print(f"{count}: Error in deleting one in loop\n", e)

            try:
                if not isIn and not error:
                    i.delete()
            except Exception as e:
                error = True
                print(f"{count}: Error in deleting one in delete instance\n", e)

        print(f"{count}: Deleted all posible jobs not in use anymore:: Success")
    except Exception as e:
        print(f'{count} : Mega Exception: failed to delete jobs\n', e)

def post():
    try:
        urls = ["https://www.jobg8.com/fileserver/jobs.aspx?username=c052j!9B8EF0&password=fhj479!_569E032&accountnumber=818829&filename=Jobs.zip","https://www.jobg8.com/fileserver/jobs.aspx?username=7CBB9D3C5D&password=5BFE685C0F&accountnumber=819521&filename=Jobs.zip"]

        count = get_count()

        curr_link = count % len(urls)

        # To-do : to make paths dynamic 
        abs_path = '/home/ubuntu/Project-workire/Server-app'

        data = read_xml_from_url(urls[curr_link], count, abs_path)
        for job in data:
            check = Job.objects.filter(DisplayReference=job['DisplayReference'])
            if not len(check):
                process_job_data(job,count)

        delete_jobs(count, data)
        save_count(count+1)

    except Exception as e:
        print("Mega Exception: Post function errored out!\n", e)
    

def start():
    if os.environ.get('RUN_MAIN') != 'true':
        scheduler = BackgroundScheduler()
        scheduler.add_job(post, 'interval', minutes = 2*60)
        scheduler.start()