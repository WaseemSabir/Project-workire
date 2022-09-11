# Create your views here.
from django.contrib.sitemaps import Sitemap
from django.http import HttpResponse
from Company.models import *
from urllib.parse import quote
from xml.dom import minidom
from datetime import date
from django.db.models import Count
from django.db.models import Q


"""
Includes views that make and return sitemap xml data
"""


def site_map_index(request):
    server = "https://workire.com/"
    root = minidom.Document()
    xml = root.createElement('sitemapindex')
    xml.setAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    root.appendChild(xml)

    today = date.today()
    first_day_of_month = today.replace(day=1)
    yesterday = today.replace(day=today.day - 1)

    sitemaps = {
        "sitemap.xml": first_day_of_month.strftime("%Y-%m-%d"),
        "sitemap-mega3.xml": yesterday.strftime("%Y-%m-%d")
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

    xml_str = root.toprettyxml(indent="\t")

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

    # only keep the countries with minimum 3 jobs in sitemap
    has_jobs = []
    for one in modifiedList:
        splitted = one.split('-')
        lookup = Q()
        if len(splitted)==1:
            lookup = lookup | Q(Country__icontains=splitted[0])
        elif len(splitted)==2:
            lookup = lookup | Q(Country__icontains=splitted[0]) | Q(Location__icontains=splitted[1])

        if Job.objects.filter(lookup).count() > 3:
            has_jobs.append(one)

    return has_jobs


class StaticSitemap(Sitemap):
    changefreq = "daily"
    priority = 1
    protocol = 'https'

    def items(self):
        return ['', 'Jobs', 'career-advice', 'Career-development-tools', 'about-us', 'contact-us',
                'Jobs/All-Categories', 'Jobs/All-Companies', 'Jobs/All-Countries', 'Jobs/All-Positions',
                'Jobs/Trending-Search']

    def location(self, item):
        return '/%s' % (item)


class BlogSiteMap(Sitemap):
    changefreq = "weekly"
    priority = 0.7
    protocol = 'https'

    def items(self):
        return Blog.objects.all()

    def lastmod(self, obj):
        return obj.addDate

    def location(self, obj):
        return '/career-advice/%s' % (obj.BlogUrl)


class JobCatSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.7
    protocol = 'https'

    def items(self):
        return Category.objects.exclude(SEO_NAME=None)

    def location(self, obj):
        return '/Job-category/%s' % (quote(obj.SEO_NAME))


class JobCompSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.5
    protocol = 'https'

    def items(self):
        # Only Show companies that has jobs in sitemap
        companies_with_jobs = Job.objects.values('Company').annotate(Count('Company')).filter(
            Company__count__gte=10).order_by('Company__count').reverse().values('Company')

        company_ids = [comp['Company'] for comp in companies_with_jobs]
        return Company.objects.filter(id__in=company_ids).all()

    def location(self, obj):
        return '/Job-company/%s' % (quote(obj.Name.replace("/", "%2F")))


class JobCountSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.6
    protocol = 'https'

    def items(self):
        return getCountList(getCountries())

    def location(self, obj):
        return '/Job-country/%s' % (quote(obj))


class JobPositionSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.7
    protocol = 'https'

    def items(self):
        return Designation.objects.all()

    def location(self, obj):
        return '/Job-by-position/%s' % (quote(obj.designation.replace("/", "%2F")))


class JobTrendSiteMap(Sitemap):
    changefreq = "daily"
    priority = 1
    protocol = 'https'

    def items(self):
        return TrendingSearch.objects.all()

    def location(self, obj):
        return '/trending-search/%s' % (quote(obj.url))
