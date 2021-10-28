from typing import Counter
from django.contrib.admin.sites import site
from django.contrib.sitemaps import Sitemap
from django.contrib.sitemaps.views import sitemap
from .models import *
from urllib.parse import quote
from Company.Serializers import CatSerializer
from rest_framework.response import Response

def getCountries():
    count = Countries.objects.all()
    c = {}
    for i in count:
        c[i.Country] = i.cities.split(',')
    return c

def getCountList(count):
    modifiedList = []
    for country in count:
        modifiedList.append(country)
        for city in count[country]:
            temp = city + '-' + country
            modifiedList.append(temp)
    return modifiedList

class StaticSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.7
    protocol = 'https'

    def items(self):
        return ['','Jobs','career-advice','Career-development-tools','professional-resume-writing-service', 'about-us', 'contact-us', 'disclaimer','Jobs/All-Categories','Jobs/All-Companies','Jobs/All-Countries','Jobs/All-Positions','Jobs/Trending-Search']

    def location(self, item):
        return '/%s' % (item)

class JobSiteMap1(Sitemap):
    changefreq = "hourly"
    priority = 1
    protocol = 'https'

    def items(self):
        return Job.objects.all()[:25000]

    def lastmod(self, obj):
        return obj.PostDate

    def location(self,obj):
        return ('/Job/' + quote(obj.Position).replace("/","%2F"))

class JobSiteMap2(Sitemap):
    changefreq = "hourly"
    priority = 1
    protocol = 'https'

    def items(self):
        return Job.objects.all()[25000:]

    def lastmod(self, obj):
        return obj.PostDate

    def location(self,obj):
        return ('/Job/' + quote(obj.Position).replace("/","%2F"))

class BlogSiteMap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    protocol = 'https'

    def items(self):
        return Blog.objects.all()

    def lastmod(self,obj):
        return obj.addDate

    def location(self,obj):
        return '/career-advice/%s' % (obj.BlogUrl)

class JobCatSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.6
    protocol = 'https'

    def items(self):
        return Category.objects.exclude(SEO_NAME=None)

    def location(self,obj):
        return '/Job-category/%s' % (quote(obj.SEO_NAME))

class JobCompSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.6
    protocol = 'https'

    def items(self):
        return Company.objects.all()

    def location(self,obj):
        return '/Job-company/%s' % (quote(obj.Name.replace(' ','-')))

class JobCountSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.6
    protocol = 'https'

    def items(self):
        return getCountList(getCountries())

    def location(self,obj):
        return '/Job-country/%s' % (quote(obj))

class JobPositionSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.6
    protocol = 'https'

    def items(self):
        return Designation.objects.all()

    def location(self,obj):
        return '/Job-by-position/%s' % (quote(obj.designation))

class JobTrendSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.6
    protocol = 'https'

    def items(self):
        return TrendingSearch.objects.all()

    def location(self,obj):
        return '/trending-search/%s' % (quote(obj.url))