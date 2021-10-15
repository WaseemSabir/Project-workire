from .models import *
from .Serializers import *
from datetime import datetime
import xml.etree.ElementTree as ET
import requests
from io import BytesIO
from zipfile import ZipFile
import os
from apscheduler.schedulers.background import BackgroundScheduler
from django.conf import settings
from django.utils.dateparse import parse_datetime
from django.utils.timezone import is_aware, make_aware
from django.conf import Settings

class Counter:
    def __init__(self):
        self.count = 0

    def increment(self):
        self.count = self.count +1
    
    def getcount(self):
        return self.count

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
        os.remove(os.path.join(abs_path,'Jobs.xml'))
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
            data = read_xml(os.path.join(abs_path,i))
        print(f"{count}. file read successfully...")
        
        return data,False

    except Exception as e:
        print(f"{count}. unable to retreive or read XML file... ")
        print(f"{count}. Exception : ",e)
        return None,True


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
    except Exception as e:
        print(f"{count}: Exception while saving : ", e)


def fix_date_time(date):
    to_ret = datetime.now()
    try:
        try:
            to_ret = parse_datetime(date)
        except Exception as e:
            print("Ran into exception (in fix_date_time): ", e)
            to_ret = datetime.now()

        if is_aware(to_ret):
            return to_ret
        else:
            return make_aware(to_ret)
    except Exception as e:
        print("Exception: (in fix_date_time) :: ", e)
        return datetime.now()

# Takes one job data and process it and triggers save_job func
def process_job_data(i, count):
    try:
        i['PostDate'] = fix_date_time(i['PostDate'])
        i['StartDate'] = fix_date_time(i['StartDate'])

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
        save_job(i,company, count)
    
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

def post(count_inst):
    try:
        urls = ["https://www.jobg8.com/fileserver/jobs.aspx?username=c052j!9B8EF0&password=fhj479!_569E032&accountnumber=818829&filename=Jobs.zip","https://www.jobg8.com/fileserver/jobs.aspx?username=7CBB9D3C5D&password=5BFE685C0F&accountnumber=819521&filename=Jobs.zip"]

        count = count_inst.getcount()

        curr_link = count % len(urls)

        abs_path = settings.BASE_DIR

        data, file_read_err = read_xml_from_url(urls[curr_link], curr_link, abs_path)
        for job in data:
            check = Job.objects.filter(DisplayReference=job['DisplayReference'])
            if not len(check):
                process_job_data(job,curr_link)
        
        if not file_read_err:
            delete_jobs(curr_link, data)

        count_inst.increment()

    except Exception as e:
        print("Mega Exception: Post function errored out!\n", e)
    

def start():
    if os.environ.get('RUN_MAIN') != 'true':
        my_count = Counter()
        scheduler = BackgroundScheduler()
        scheduler.add_job(post(my_count), 'interval', minutes = 60*2)
        scheduler.start()