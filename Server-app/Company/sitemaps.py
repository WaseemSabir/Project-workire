from django.contrib.admin.sites import site
from django.contrib.sitemaps import Sitemap
from django.contrib.sitemaps.views import sitemap
from .models import *
from urllib.parse import quote

class JobSiteMap(Sitemap):
    changefreq = "hourly"
    priority = 1
    protocol = 'https'

    def items(self):
        return Job.objects.all()

    def lastmod(self, obj):
        return obj.PostDate

    def location(self,obj):
        return ('/Job/' + quote(obj.Position))

class BlogSiteMap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    protocol = 'https'

    def items(self):
        return Blog.objects.all()

    def lastmod(self,obj):
        return obj.addDate

    def location(self,obj):
        return '/advice/%s' % (obj.BlogUrl)

class StaticSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.7
    protocol = 'https'

    def items(self):
        return ['','Jobs','Career-development-tools','professional-resume-writing-service', 'about-us', 'contact-us', 'disclaimer','Jobs/All-Categories','Jobs/All-Companies','Jobs/All-Countries']

    def location(self, item):
        return '/%s' % (item)

class BlogCatSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.6
    protocol = 'https'

    def items(self):
        return ['All', 'Interview', 'Job%20Seeking', 'Resume','Self-Improvement','Networking','News']

    def location(self, item):
        return '/blog/%s' % (item)

class JobCatSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.6
    protocol = 'https'

    def items(self):
        return Category.objects.all()

    def location(self,obj):
        return '/Job-category/%s' % (quote(obj.SEO_NAME.replace(' ','-')))

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
        return ["Saudi Arabia","Bahrain","Iraq","United Arab Emirates","Jordan","Kuwait","Qatar","Oman"]

    def location(self,obj):
        return '/Job-country/%s' % (quote(obj.replace(' ','-')))