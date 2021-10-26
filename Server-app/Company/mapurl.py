from django.urls import path
from django.contrib.sitemaps.views import sitemap
from .sitemaps import *

sitemaps = {
    'static':StaticSitemap,
    'job':JobSiteMap,
    'blog':BlogSiteMap,
    'job-category':JobCatSiteMap,
    'job-country':JobCompSiteMap,
    'job-company':JobCountSiteMap,
    'job-position':JobPositionSiteMap,
    'Job-by-position':JobTrendSiteMap,
    'job-by-search':JobTrendSiteMap
}

urlpatterns = [
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap')
]