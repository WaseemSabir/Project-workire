from django.urls import path
from . import views
from . import AddJobView
from . import BlogView

urlpatterns = [
    path('getID/<int:id>', views.getId.as_view()),  # get company by Id

    path('getName/<str:Name>', views.getName.as_view()),  # get company by name

    path('getAllCompany', views.getAll.as_view()),  # get all comapnies data

    path('addNewCompany', views.addNewCompany.as_view()),

    path('getAllCategories', views.getAllCategories.as_view()),

    path('getAllCountries', views.getAllCountries.as_view()),

    path('getAllCompanies', views.getAllCompanies.as_view()),

    path('Country/<str:Country>', views.getjobCountry.as_view()),

    path('job/<str:id>', views.getJobsName.as_view()),

    path('getJobByTitle', views.getJobByTitle.as_view()),

    path('Category/<str:Category>', views.getJobsCategory.as_view()),

    path('search', AddJobView.Search.as_view()), #search jobs

    path('fullsearch', AddJobView.FullSearch.as_view()), #full search jobs

    # path('addJobs', AddJobView.addJobs.as_view()), #add jobs
 
    path('getallposts', BlogView.getallposts.as_view()), #get all posts

    path('getBlogCat/<str:Category>', BlogView.getBlogbyCat.as_view()), #

    path('getBlogURL/<str:search>', BlogView.getBlogbyUrl.as_view()),

    path('searchPosts', BlogView.searchbyval.as_view()),

    path('seoCat', BlogView.seoCat.as_view()),

    path('seoCatBySeo', BlogView.seoCatBySeo.as_view()),

    path('getAllSeoCat', BlogView.getAllSeoCat.as_view()),

    path('featured', AddJobView.featured.as_view()),

    path('getTrendingSearch', views.getTrendingSearch.as_view()),

    path('getCountries', views.getCountries.as_view()),

    path('getDesignation', views.getDesignantion.as_view())
]
