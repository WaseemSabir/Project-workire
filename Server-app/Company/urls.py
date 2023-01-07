from django.urls import path
from . import JobViews
from . import BlogView

urlpatterns = [
    # Job View Patterns

    path('getID/<int:id>', JobViews.getCompanyById.as_view()),  # get company by Id

    # get company by name
    path('getName/<str:Name>', JobViews.getCompanyByName.as_view()),

    # get all comapnies data
    path('getAllCompany', JobViews.getAllCompaniesWithCountFirst100.as_view()),

    # get all comapnies more
    path('getAllCompanyMore', JobViews.getAllCompaniesWithCountFirst100More.as_view()),

    # Get all categories from Jobs
    path('getAllCategories', JobViews.getAllCategories.as_view()),

    # Get all Countries from Jobs
    path('getAllCountries', JobViews.getAllCountries.as_view()),

    # Get all Comapnies from Jobs
    path('getAllCompanies', JobViews.getAllCompanies.as_view()),

    path('job/<str:id>', JobViews.getJobByID.as_view()),  # Get Job via Job ID

    # Get Job by matching title
    path('getJobByTitle', JobViews.getJobByTitle.as_view()),

    path('search', JobViews.Search.as_view()),  # search jobs

    path('fullsearch', JobViews.FullSearch.as_view()),  # full search jobs

    path('featured', JobViews.featured.as_view()),

    path('getTrendingSearch', JobViews.getTrendingSearch.as_view()),

    path('getCountries', JobViews.getCountries.as_view()),

    path('getDesignation', JobViews.getDesignantion.as_view()),

    path('seoCat', JobViews.seoCat.as_view()),

    path('seoCatBySeo', JobViews.seoCatBySeo.as_view()),

    path('getAllSeoCat', JobViews.getAllSeoCat.as_view()),

    path('getFeaturedCompanies', JobViews.getFeaturedCompany.as_view()),

    path('getFilterSuggestions', JobViews.getFilterSuggestions.as_view()),

    path('getFilterSuggestions/<str:search>',
         JobViews.getFilterSuggestions.as_view()),

    path('FeaturedJobFrontPage/<str:country>',
         JobViews.FeaturedJobFrontPage.as_view()),

    path('TotalJobCount', JobViews.TotalCount.as_view()),

    path('JobSeoObject', JobViews.SeoObjectView.as_view()),

    # Blog View Patterns

    path('getallposts', BlogView.getallposts.as_view()),  # get all posts

    path('getBlogCat/<str:Category>', BlogView.getBlogbyCat.as_view()),  #

    path('getBlogURL/<str:search>', BlogView.getBlogbyUrl.as_view()),

    path('searchPosts', BlogView.searchbyval.as_view()),
    path('jobBlogs', BlogView.jobBlogViews.as_view()),
    path('addJobBlog', BlogView.addJobBlog.as_view()),
    path('getJobBlogBySlug/<str:slug>', BlogView.getJobBlogBySlug.as_view()),
    path('searchJobBlogs/<str:search>', BlogView.searchJobBlog.as_view()),
]

# Un-used API Views

# path('addJobs', AddJobView.addJobs.as_view()), #add jobs

# path('Category/<str:Category>', JobViews.getJobByCategory.as_view()), # Get Jobs By Category

# path('addNewCompany', JobViews.addNewCompany.as_view()),   #add new Company via API point, No authorisation

# path('Country/<str:Country>', JobViews.getjobByCountry.as_view()), # Get Jobs in a country
