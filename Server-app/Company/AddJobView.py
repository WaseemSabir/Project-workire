from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .Serializers import *
from rest_framework import status
from datetime import datetime, time, timedelta
import xml.etree.ElementTree as ET
import time
from django.db.models import Q
from django.db.models import Count
import requests
from io import BytesIO
from zipfile import ZipFile
import os
from apscheduler.schedulers.background import BackgroundScheduler
from django.core.management.color import no_style
from django.db import connection

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

def post():
    urls = ["https://www.jobg8.com/fileserver/jobs.aspx?username=c052j!9B8EF0&password=fhj479!_569E032&accountnumber=818829&filename=Jobs.zip","https://www.jobg8.com/fileserver/jobs.aspx?username=7CBB9D3C5D&password=5BFE685C0F&accountnumber=819521&filename=Jobs.zip"]

    count = 1
    # abs_path = '/home/wolfie/Desktop/WokireBackend/Server/Server-app/'
    abs_path = '/home/ubuntu/Project-workire/Server-app/'

    for url in urls:
        
        fileErr = False
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
            
        except Exception as e:
            fileErr = True
            print(f"{count}. unable to retreive or read XML file... ")
            print(f"{count}. Exception : ",e)

        if not fileErr:  
            try:
                if count==1:
                    print(f"{count}. Deleting enteries in database...")
                    k = Job.objects.all().delete()
                    time.sleep(10)
                    print(f"{count}. Deleted, Reseting keys now...")
                    sequence_sql = connection.ops.sequence_reset_sql(no_style(), [Job])
                    with connection.cursor() as cursor:
                        for sql in sequence_sql:
                            cursor.execute(sql)
                    print(f"{count}. Reseted Keys successfully !")
            except:
                print(f"{count}. Failed to reset keys !")

            try:
                for i in data:
                    try:
                        datatime = i['PostDate'].split("T")
                        datatime[0] = datatime[0].split("-")
                        datatime[1] = datatime[1].split(":")
                        i['PostDate'] = datetime(int(datatime[0][0]), int(datatime[0][1]), int(datatime[0][2]),
                                                            int(datatime[1][0]), int(datatime[1][1]), int(datatime[1][2]))
                        if i['StartDate'] == "":
                            i["StartDate"] = None
                        if not Company.objects.filter(Name=i['AdvertiserName']).exists():
                            if i['LogoURL'] == "":
                                company = Company(Name=i['AdvertiserName'], Location=i['Location'],
                                                    WebSite=i['DescriptionURL'], About=i['AdvertiserType'], Categories=i['Classification']
                                                    )
                                company.save()
                            else:
                                company = Company(Name=i['AdvertiserName'], Location=i['Location'],
                                                    WebSite=i['DescriptionURL'], About=i['AdvertiserType'], logo=i['LogoURL'], Categories=i['Classification']
                                                    )
                                company.save()
                        else:
                            company = Company.objects.filter(Name=i['AdvertiserName'])[0]

                        if not Category.objects.filter(Name=i['Classification']):
                            category = Category(Name=i['Classification'])
                            category.save()
                            
                        if not Company.objects.filter(Name=i['AdvertiserName']).exists():
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
                                AdditionalClassification4=i['AdditionalClassification4'], JobType=i['JobType']
                            )
                            job.save()
                        else:
                            company = Company.objects.filter(Name=i['AdvertiserName'])[0]
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
                                LogoURL=company.logo, JobType=i['JobType']
                            )
                            job.save()
                    except Exception as e:
                        print(f"{count}. Exception: Failed to save a job\n",e,'\n')
                print(f'{count}. All Jobs saved Sucessfully')
            except Exception as e:
                print(f"{count}. Mega Exception: Failed to save all jobs\n",e,'\n')
        count +=1

def getCount(cat,job):
    a = job.values(cat).order_by().annotate(Count(cat))
    beta ={}
    for i in a:
        k=[]
        for j in i.keys():
            k.append(i[j])
        beta[k[0]] = k[1]
    return beta

class Search(APIView):
    def post(self, request):
        data = request.data
        search = data['search']
        if search != "":
            try:
                lookup = Q(AdvertiserName__icontains=search) | Q(AdvertiserType__icontains=search) | Q(Classification__icontains=search) | Q(
                    Position__icontains=search) | Q(Description__icontains=search) | Q(Country__icontains=search) | Q(Location__icontains=search)
                job = Job.objects.filter(lookup).distinct().order_by('-id')
            except:
                message = {'detail': 'Error in query'}
                return Response(message, status=status.HTTP_400_BAD_REQUEST)
        else:
            job = Job.objects.all()
            
        Countrycount = getCount("Country",job)
        companiescount = getCount("AdvertiserName",job)
        categorycount = getCount("Classification",job)
        Country = request.data['Country'].split(",")
        category = request.data['category'].split(",")
        companies = request.data['companies'].split(",")
        days = int(request.data['day'])
        page = int(data['page'])
        location = []

        if Country != [""]:
            for i in Country:
                if len(i.split('-'))>1:
                    location.append(i.split('-')[0])
            lookup = Q(Country__icontains=Country[0])
            for i in Country:
                lookup = lookup |  Q(Country__icontains=i)
            for i in location:
                lookup = lookup | Q(Location__icontains=i)
            job = job.filter(lookup)

        if companies != [""]:
            lookup = Q(AdvertiserName__icontains=companies[0])
            for i in companies:
                lookup =lookup |  Q(AdvertiserName__icontains=i)
            job = job.filter(lookup)

        if category != [""]:
            lookup = Q(Classification__icontains=category[0])
            for i in category:
                lookup =lookup |  Q(Classification__icontains=i)
            job = job.filter(lookup)
        if days != 0:
            d = datetime.today() - timedelta(days=days)
            job = job.filter(PostDate__gte = d)

        totalCount = len(job)

        if page*10>totalCount:
            job = job[(page-1)*10:totalCount]
        else:
            job = job[(((page-1)*10)+2):((page*10)+1)]

        job = JobSerializer(job, many=True)
        return Response({'Countrycount':Countrycount,'categorycount':categorycount,'companiescount':companiescount,'count':totalCount,'data':job.data})

class FullSearch(APIView):
    def post(self, request):
        data = request.data
        search = data['search']
        if search != "":
            try:
                lookup = Q(AdvertiserName__icontains=search) | Q(AdvertiserType__icontains=search) | Q(Classification__icontains=search) | Q(
                    Position__icontains=search) | Q(Description__icontains=search) | Q(Country__icontains=search) | Q(Location__icontains=search)
                job = Job.objects.filter(lookup).distinct().order_by('-id')
            except:
                message = {'detail': 'Error in query'}
                return Response(message, status=status.HTTP_400_BAD_REQUEST)
        else:
            job = Job.objects.all()
            
        Countrycount = getCount("Country",job)
        companiescount = getCount("AdvertiserName",job)
        categorycount = getCount("Classification",job)
        Country = request.data['Country'].split(",")
        category = request.data['category'].split(",")
        companies = request.data['companies'].split(",")
        days = int(request.data['day'])
        location = []

        if Country != [""]:
            for i in Country:
                if len(i.split('-'))>1:
                    location.append(i.split('-')[0])
            lookup = Q(Country__icontains=Country[0])
            for i in Country:
                lookup = lookup |  Q(Country__icontains=i)
            for i in location:
                lookup = lookup | Q(Location__icontains=i)
            job = job.filter(lookup)

        if companies != [""]:
            lookup = Q(AdvertiserName__icontains=companies[0])
            for i in companies:
                lookup =lookup |  Q(AdvertiserName__icontains=i)
            job = job.filter(lookup)

        if category != [""]:
            lookup = Q(Classification__icontains=category[0])
            for i in category:
                lookup =lookup |  Q(Classification__icontains=i)
            job = job.filter(lookup)
        if days != 0:
            d = datetime.today() - timedelta(days=days)
            job = job.filter(PostDate__gte = d)

        totalCount = len(job)

        job = JobSerializer(job, many=True)
        return Response({'Countrycount':Countrycount,'categorycount':categorycount,'companiescount':companiescount,'count':totalCount,'data':job.data})

class featured(APIView):
    def post(self, request):
            try:
                data = request.data
                search = data['search']
                if(search!=""):
                    lookup = Q(AdvertiserName__icontains=search) | Q(AdvertiserType__icontains=search) | Q(Classification__icontains=search) | Q(
                            Position__icontains=search) | Q(Description__icontains=search) | Q(Country__icontains=search) | Q(Location__icontains=search)
                    j = Job.objects.filter(lookup)
                    count = 0
                    for i in j:
                        count+=1
                    if count<4:
                        j = Job.objects.all()
                else:
                    j = Job.objects.all()

                j = j.order_by("?")[:4]
                j = JobSerializer(j, many=True)
                return Response({'job':j.data})
            except:
                message = {'Invalid Search'}
                return Response(message, status=status.HTTP_400_BAD_REQUEST)  

def start():
    if os.environ.get('RUN_MAIN') != 'true':
        scheduler = BackgroundScheduler()
        scheduler.add_job(post, 'interval', minutes = 240)
        scheduler.start()
