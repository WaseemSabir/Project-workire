from django.contrib.sitemaps import Sitemap
from django.http import HttpResponse
from .models import *
from urllib.parse import quote
from xml.dom import minidom
from datetime import date
from django.db.models import Count


def site_map_index(request):
    server = "https://workire.com/"
    root = minidom.Document()
    xml = root.createElement('sitemapindex') 
    xml.setAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    root.appendChild(xml)
    
    today = date.today()
    first_day_of_month = today.replace(day=1)
    yesterday = today.replace(day=today.day-1)

    sitemaps = {
        "sitemap.xml": first_day_of_month.strftime("%Y-%m-%d"),
        "sitemap-job1.xml": yesterday.strftime("%Y-%m-%d"),
        "sitemap-job2.xml": yesterday.strftime("%Y-%m-%d"),
        "sitemap-mega3.xml":yesterday.strftime("%Y-%m-%d")
    }
    
    for name, value in sitemaps.items():
        sitemapChild = root.createElement('sitemap')
        locChild = root.createElement('loc')
        locChild.appendChild(root.createTextNode(server + name))
        lastmod = root.createElement('lastmod')
        lastmod.appendChild(root.createTextNode(value))
        sitemapChild.appendChild(locChild)
        sitemapChild.appendChild(lastmod)
        xml.appendChild(sitemapChild)
    
    xml_str = root.toprettyxml(indent ="\t")

    return HttpResponse(xml_str, content_type='text/xml')

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
    priority = 1
    protocol = 'https'

    def items(self):
        return ['','Jobs','career-advice','Career-development-tools','professional-resume-writing-service', 'about-us', 'contact-us', 'disclaimer','Jobs/All-Categories','Jobs/All-Companies','Jobs/All-Countries','Jobs/All-Positions','Jobs/Trending-Search']

    def location(self, item):
        return '/%s' % (item)

class JobSiteMap1(Sitemap):
    changefreq = "hourly"
    priority = 0.8
    protocol = 'https'

    def items(self):
        return Job.objects.all()[:25000]

    def lastmod(self, obj):
        return obj.PostDate

    def location(self,obj):
        return (f'/Job/{quote(obj.Position).replace("/","%2F")}/{obj.id}')

class JobSiteMap2(Sitemap):
    changefreq = "hourly"
    priority = 0.8
    protocol = 'https'

    def items(self):
        return Job.objects.all()[25000:]

    def lastmod(self, obj):
        return obj.PostDate

    def location(self,obj):
        return (f'/Job/{quote(obj.Position).replace("/","%2F")}/{obj.id}')

class BlogSiteMap(Sitemap):
    changefreq = "weekly"
    priority = 0.7
    protocol = 'https'

    def items(self):
        return Blog.objects.all()

    def lastmod(self,obj):
        return obj.addDate

    def location(self,obj):
        return '/career-advice/%s' % (obj.BlogUrl)

class JobCatSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.5
    protocol = 'https'

    def items(self):
        return Category.objects.exclude(SEO_NAME=None)

    def location(self,obj):
        return '/Job-category/%s' % (quote(obj.SEO_NAME))

class JobCompSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.5
    protocol = 'https'

    def items(self):
        # Only Show companies that has jobs in sitemap
        companies_with_jobs = Job.objects.values('Company').annotate(Count('Company')).order_by('Company__count').reverse().values('Company')

        company_ids = [comp['Company'] for comp in companies_with_jobs]
        return Company.objects.filter(id__in=company_ids).all()

    def location(self,obj):
        return '/Job-company/%s' % (quote(obj.Name.replace("/","%2F")))

class JobCountSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.5
    protocol = 'https'

    def items(self):
        return getCountList(getCountries())

    def location(self,obj):
        return '/Job-country/%s' % (quote(obj))

class JobPositionSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.5
    protocol = 'https'

    def items(self):
        return Designation.objects.all()

    def location(self,obj):
        return '/Job-by-position/%s' % (quote(obj.designation.replace("/","%2F")))

class JobTrendSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.5
    protocol = 'https'

    def items(self):
        return TrendingSearch.objects.all()

    def location(self,obj):
        return '/trending-search/%s' % (quote(obj.url))