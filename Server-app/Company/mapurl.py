from django.urls import path
from django.contrib.sitemaps.views import sitemap
from .sitemaps import *

basicSitemaps = {
    'static':StaticSitemap,
    'blog':BlogSiteMap,
    'job-position':JobPositionSiteMap,
    'trending-search':JobTrendSiteMap
}

jobSitemap1 = {
    'job':JobSiteMap1,
}

jobSitemap2 = {
    'job':JobSiteMap2,
}

mega3Sitemap = {
    'job-category':JobCatSiteMap,
    'job-country':JobCompSiteMap,
    'job-company':JobCountSiteMap,
}

urlpatterns = [
    path('sitemap_index.xml', site_map_index),
    path('sitemap.xml', sitemap, {'sitemaps': basicSitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('sitemap-job1.xml', sitemap, {'sitemaps': jobSitemap1}, name='django.contrib.sitemaps.views.sitemap'),
    path('sitemap-job2.xml', sitemap, {'sitemaps': jobSitemap2}, name='django.contrib.sitemaps.views.sitemap'),
    path('sitemap-mega3.xml', sitemap, {'sitemaps': mega3Sitemap}, name='django.contrib.sitemaps.views.sitemap'),
]