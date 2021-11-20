from enum import unique
from functools import reduce
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .Serializers import *
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.db.models import Q
from django.db.models import Count
from datetime import datetime, timedelta
import operator

class getCompanyById(APIView):
    @method_decorator(cache_page(60*60*2))
    def get(self, request, *args, **kwargs):
        id = self.kwargs.get('id')
        try:
            company_id = Company.objects.get(id=id)
            data = CompanySerializer(company_id, many=False)
            return Response({'company': data.data})
        except:
            message = {'detail': 'Company by Id don\'t exists'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

class getCompanyByName(APIView):
    @method_decorator(cache_page(60*60*2))
    def get(self, request, *args, **kwargs):
        Name = self.kwargs.get('Name')
        try:
            company_id = Company.objects.get(Name=Name)
            data = CompanySerializer(company_id, many=False)
            return Response({'company': data.data})

        except:
            message = {'detail': 'Company by this Name don\'t exists'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

class getAllCompaniesWithCountFirst100(APIView):
    @method_decorator(cache_page(60*60*2))
    def get(self, request):
        a = Job.objects.values('AdvertiserName').annotate(Count('AdvertiserName')).order_by('AdvertiserName__count').reverse()[:100]
        return Response({'data':a})

class getAllCompaniesWithCountFirst100More(APIView):
    @method_decorator(cache_page(60*60*2))
    def post(self, request):
        page = int(request.data['more'])
        a = Job.objects.values('AdvertiserName').annotate(Count('AdvertiserName')).order_by('AdvertiserName__count').reverse()[page*100:page*100+100]
        return Response({'data':a})

class addNewCompany(APIView):
    def post(self, request):
        data = request.data
        try:
            company = Company(
                Name=data['Name'],
                Location=data['Location'],
                WebSite=data['WebSite'],
                About=data['About'],
                logo=data['logo'],
                TeamSize=data['team'],
                Categories=data['cat'],
            )
            company.save()
            company = CompanySerializer(company, many=False)
            return Response({'savedData': company.data})
        except:
            message = {'detail': 'Company by this Name Already Exists!!'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

class getAllCategories(APIView):
    @method_decorator(cache_page(60*60*2))
    def get(self, request):
        categories = Job.objects.all().values('Classification')
        if categories is not None:
            l = []
            for i in categories:
                l.append(i['Classification'])
            list = set(l)
            cat = {}
            for i in list:
                cat[i] = l.count(i)
            return Response({'data': cat})
        return Response({'data': None})

class getAllCountries(APIView):
    @method_decorator(cache_page(60*60*2))
    def get(self, request):
        countries = Job.objects.all().values('Country')
        if countries is not None:
            l = []
            for i in countries:
                l.append(i['Country'])
            list = set(l)
            cat = {}
            for i in list:
                cat[i] = l.count(i)
            return Response({'data': cat})
        return Response({'data': None})

class getAllCompanies(APIView):
    @method_decorator(cache_page(60*60*2))
    def get(self, request):
        company = Job.objects.all().values('AdvertiserName', 'LogoURL')[:100]
        if company is not None:
            l = []
            for i in company:
                if len(l)<100:
                    l.append((i['AdvertiserName'], i['LogoURL']))
                else:
                    break
            list = set(l)
            cat = {}
            for i in list:
                cat[i[0]] = [l.count(i), i[1]]
            return Response({'data': cat})
        return Response({'data': None})

class getFeaturedCompany(APIView):
    @method_decorator(cache_page(60*60*1))
    def get(self, request):
        company = Company.objects.exclude(logo__icontains='default.jpg').order_by('?')[:12]
        company = CompanySerializer(company, many=True)
        return Response({'data': company.data})

class getjobByCountry(APIView):
    @method_decorator(cache_page(60*60*2))
    def get(self, request, *args, **kwargs):
        Name = self.kwargs.get('Country')
        jobs = None
        jobs = Job.objects.filter(Country=Name)
        jobs = JobSerializer(jobs, many=True)
        return Response({'Jobs': jobs.data})

class getJobByID(APIView):
    @method_decorator(cache_page(60*60*2))
    def get(self, request, *args, **kwargs):
        Name = self.kwargs.get('id')
        k = int(Name)
        jobs = Job.objects.filter(id=k)
        jobs = JobSerializer(jobs, many=True)
        return Response({'Jobs': jobs.data})

class getJobByTitle(APIView):
    @method_decorator(cache_page(60*60*2))
    def post(self, request):
        Name = request.data['title']
        jobs = Job.objects.filter(Position=Name)
        jobs = JobSerializer(jobs, many=True)
        return Response({'Jobs': jobs.data})

class getJobByCategory(APIView):
    @method_decorator(cache_page(60*60*2))
    def get(self, request, *args, **kwargs):
        Name = self.kwargs.get('Category')
        jobs = Job.objects.filter(Classification=Name)
        jobs = JobSerializer(jobs, many=True)
        return Response({'Jobs': jobs.data})

class getTrendingSearch(APIView):
    @method_decorator(cache_page(60*60*2))
    def get(self, request):
        search = TrendingSearch.objects.all()
        search = TrendingSearchSerializer(search,many=True)
        return Response(search.data)

class getCountries(APIView):
    @method_decorator(cache_page(60*60*2))
    def get(self, request):
        countries = Countries.objects.all()
        countries = CountrySerializer(countries,many=True)
        return Response(countries.data)

class getDesignantion(APIView):
    @method_decorator(cache_page(60*60*2))
    def get(self, request):
        desg = Designation.objects.all()
        desg = DesignationSerializer(desg,many=True)
        return Response(desg.data)

class Search(APIView):
    @method_decorator(cache_page(60*60*2))
    def post(self, request):
        try:
            data = request.data
            search = filter(isNotEmptyString, data['search'].split(","))
            Country = filter(isNotEmptyString, request.data['country'].split(","))
            category = filter(isNotEmptyString, request.data['category'].split(","))
            companies = filter(isNotEmptyString, request.data['company'].split(","))

            days = int(request.data['days'])
            page = int(data['page'])
            location = []

            lookup = Q()

            for i in search:
                lookup = lookup | Q(AdvertiserName__icontains=i) | Q(Classification__icontains=i) | Q(Position__icontains=i)

            lookup2 = [lookup]

            pureCountry = []
            for i in Country:
                temp = i.split('-')
                if len(temp)>1:
                    location.append(temp[0])
                    pureCountry.append(temp[1])
                else:
                    pureCountry.append(i)

            lookup = Q()
            for i in pureCountry:
                lookup = lookup | Q(Country__icontains=i)

            lookup2.append(lookup)
            
            lookup = Q()
            for i in location:
                lookup = lookup | Q(Location__icontains=i)

            lookup2.append(lookup)
            
            lookup = Q()
            for i in companies:
                lookup = lookup | Q(AdvertiserName__icontains=i)

            lookup2.append(lookup)

            lookup = Q()
            for i in category:
                temp = i
                cat_seo = Category.objects.filter(SEO_NAME=i)
                if len(cat_seo):
                    temp = cat_seo[0].Name
                lookup = lookup | Q(Classification__icontains=temp)

            lookup2.append(lookup)

            if days != 0:
                d = datetime.today() - timedelta(days=days)
                lookup2.append(Q(PostDate__gte = d))

            count = Job.objects.filter(reduce(operator.and_, lookup2)).count()
            job = Job.objects.filter(reduce(operator.and_, lookup2))[(page-1)*10:(page*10)]

            job = JobSerializer(job, many=True)
            return Response({'count':count,'data':job.data})

        except:
                message = {'detail': 'Search Query not valid'}
                return Response(message, status=status.HTTP_400_BAD_REQUEST)

class getFilterSuggestions(APIView):
    @method_decorator(cache_page(60*60*2))
    def get(self, request, *args, **kwargs):
        try:
            try:
                search = self.kwargs.get('search').split(",")
            except:
                search = []

            search = filter(isNotEmptyString, search)

            lookup = Q()

            for i in search:
                lookup = lookup | Q(AdvertiserName__icontains=i) | Q(AdvertiserType__icontains=i) | Q(Classification__icontains=i) | Q(Position__icontains=i) | Q(Description__icontains=i) | Q(Country__icontains=i) | Q(Location__icontains=i)

            job = Job.objects.filter(lookup)

            Countrycount = getOrderedCatByCount("Country",job)
            companiescount = getOrderedCatByCount("AdvertiserName",job)
            categorycount = getOrderedCatByCount("Classification",job)

            return Response({'Countrycount':Countrycount,'categorycount':categorycount,'companiescount':companiescount})

        except:
            message = {'detail': 'invalid request'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

class featured(APIView):
    @method_decorator(cache_page(30))
    def post(self, request):
            try:
                data = request.data
                search = data['search']
                lookup = Q(AdvertiserName__icontains=search) | Q(AdvertiserType__icontains=search) | Q(Classification__icontains=search) | Q(
                        Position__icontains=search) | Q(Description__icontains=search) | Q(Country__icontains=search) | Q(Location__icontains=search)
                job = Job.objects.filter(lookup)[:4]
                job = JobFeaturedSerializer(job, many=True)
                return Response({'job':job.data})
                
            except:
                message = {'Invalid Search'}
                return Response(message, status=status.HTTP_400_BAD_REQUEST)

class seoCat(APIView):
    @method_decorator(cache_page(60*60*2))
    def post(self,request):
        try:
            Name = request.data['category']
            lookup = Q(Name__icontains=Name)
            cat = Category.objects.filter(lookup)
            cat = CatSerializer(cat, many = True)
            return Response({'category':cat.data})
        except:
            message = {'Invalid Category'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)  

class seoCatBySeo(APIView):
    @method_decorator(cache_page(60*60*2))
    def post(self,request):
        try:
            Name = request.data['category']
            lookup = Q(SEO_NAME__icontains=Name)
            cat = Category.objects.filter(lookup)
            cat = CatSerializer(cat, many = True)
            return Response({'category':cat.data})
        except:
            message = {'Invalid Category'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

class getAllSeoCat(APIView):
    @method_decorator(cache_page(60*60*2))
    def get(self, request, *args, **kwargs):
        try:
            cat = Category.objects.exclude(SEO_NAME=None)
            cat = CatSerializer(cat, many = True)
            return Response({'category':cat.data})
        except:
            message = {'Invalid Request'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

class FeaturedJobFrontPage(APIView):
    @method_decorator(cache_page(60*60*1))
    def get(self, request, *args, **kwargs):
            try:
                country = self.kwargs.get('country')
                job = Job.objects.filter(Country__icontains=country)[:6]
                count = Job.objects.all().count()
                if len(job)!=6:
                    job =Job.objects.all()[:6]
                
                job = JobSerializer(job, many=True)
                return Response({'count':count,'data':job.data})
            except:
                message = {'Invalid Request'}
                return Response(message, status=status.HTTP_400_BAD_REQUEST)

# Helper Functions
def getOrderedCatByCount(cat,job):
    a = job.values(cat).annotate(Count(cat)).order_by('{}__count'.format(cat)).reverse()[:25]
    beta ={}
    for i in a:
        k=[]
        for j in i.keys():
            k.append(i[j])
        beta[k[0]] = k[1]
    return beta

def isNotEmptyString(str):
    if len(str):
        return True
    else:
        return False

# Bot Views
class FullSearch(APIView):
    @method_decorator(cache_page(60*60*2))
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
            
        Countrycount = getOrderedCatByCount("Country",job)
        companiescount = getOrderedCatByCount("AdvertiserName",job)
        categorycount = getOrderedCatByCount("Classification",job)
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