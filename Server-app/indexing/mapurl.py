from django.urls import path
from django.contrib.sitemaps.views import sitemap
from indexing.views import *

basicSitemaps = {
    'static': StaticSitemap,
    'blog': BlogSiteMap,
    'job-position': JobPositionSiteMap,
    'trending-search': JobTrendSiteMap
}

mega3Sitemap = {
    'job-category': JobCatSiteMap,
    'job-country': JobCompSiteMap,
    'job-company': JobCountSiteMap,
}

urlpatterns = [
    path('sitemap_index.xml', site_map_index),
    path('sitemap.xml', sitemap, {'sitemaps': basicSitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('sitemap-mega3.xml', sitemap, {'sitemaps': mega3Sitemap}, name='django.contrib.sitemaps.views.sitemap'),
]
