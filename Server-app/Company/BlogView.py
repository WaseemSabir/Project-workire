from django.db import connections
from Company.Serializers import BlogSerializer,CatSerializer
from django.urls.conf import path
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from rest_framework import status
from django.db.models import Q
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

class getallposts(APIView):
    @method_decorator(cache_page(60*60*24))
    def get(self,request):
        blog = Blog.objects.all()
        blog = BlogSerializer(blog, many = True)
        return Response({'data':blog.data})

class getBlogbyCat((APIView)):
    @method_decorator(cache_page(60*60*24))
    def get(self, request, *args, **kwargs):
        try:
            Name = self.kwargs.get('Category')
            blog = Blog.objects.filter(category__icontains = Name)
            blog = BlogSerializer(blog, many = True)
            return Response({'data':blog.data})
        except:
            message = {'Invalid Search'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST) 

def getcat(blog):
    return blog.values('category')
    
def getdate(blog):
    return blog.values('addDate')

class getBlogbyUrl(APIView):
    @method_decorator(cache_page(60*60*24))
    def get(self, request, *args, **kwargs):
        try:
            Name = self.kwargs.get('search')
            lookup = Q(BlogUrl__icontains=Name)
            blog = Blog.objects.filter(lookup)
            blog1 = None
            if len(blog)<3 and len(blog)>=1:
                categories = getcat(blog)
                blog1 = Blog.objects.filter(category__in = categories)
                if(len(blog1)<3):
                    blog1 = blog1[:3]
                else:
                    blog1 = Blog.objects.all()[:3]

            blog1 = BlogSerializer(blog1, many = True)
            blog = BlogSerializer(blog, many = True)
            return Response({'data':blog.data,'related':blog1.data})
        except:
            message = {'Invalid Search'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)  

class searchbyval(APIView):
    @method_decorator(cache_page(60*60*24))
    def post(self,request):
        try:
            data = request.data['search']
            lookup = Q(title__icontains=data) |  Q(body__icontains=data) |  Q(category__icontains=data) |  Q(BlogUrl__icontains=data) | Q(KeyWord__icontains=data) | Q(Description__icontains=data)
            post = Blog.objects.filter(lookup)
            post = BlogSerializer(post, many =True)
            return  Response({'posts':post.data})
        except:
            message = {'Invalid Search'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)