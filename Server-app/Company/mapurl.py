from django.urls import path
from django.contrib.sitemaps.views import sitemap
from .sitemaps import *

sitemaps = {
    'job':JobSiteMap,
    'blog':BlogSiteMap,
    'static':StaticSitemap,
    'blogCat':BlogCatSitemap,
    'job-category':JobCatSiteMap,
    'job-country':JobCompSiteMap,
    'job-company':JobCountSiteMap
}

urlpatterns = [
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap')
]