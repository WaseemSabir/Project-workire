from random import choices
import os
import json

from django.db.models import Q
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from Company.Serializers import BlogSerializer, JobBlogSerializer
from .models import *


class getallposts(APIView):
    @method_decorator(cache_page(60 * 60 * 24))
    def get(self, request):
        blog = Blog.objects.all()
        blog = BlogSerializer(blog, many=True)
        return Response({'data': blog.data})


class getBlogbyCat((APIView)):
    @method_decorator(cache_page(60 * 60 * 24))
    def get(self, request, *args, **kwargs):
        try:
            Name = self.kwargs.get('Category')
            blog = Blog.objects.filter(category__icontains=Name)
            blog = BlogSerializer(blog, many=True)
            return Response({'data': blog.data})
        except:
            message = {'Invalid Search'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)


def getcat(blog):
    return blog.values('category')


def getdate(blog):
    return blog.values('addDate')


class getBlogbyUrl(APIView):
    @method_decorator(cache_page(60 * 60 * 24))
    def get(self, request, *args, **kwargs):
        try:
            Name = self.kwargs.get('search')
            lookup = Q(BlogUrl__icontains=Name)
            blog = Blog.objects.filter(lookup)
            related_blogs = None
            if len(blog) >= 1:
                categories = getcat(blog)
                related_blogs = Blog.objects.filter(category__in=categories)
                if (len(related_blogs) >= 2):
                    related_blogs = related_blogs[:2]
                else:
                    related_blogs = choices(Blog.objects.all(), k=2)

            related_blogs = BlogSerializer(related_blogs, many=True)
            blog = BlogSerializer(blog, many=True)
            return Response({'data': blog.data, 'related': related_blogs.data})
        except:
            message = {'Invalid Search'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)


class searchbyval(APIView):
    @method_decorator(cache_page(60 * 60 * 24))
    def post(self, request):
        try:
            data = request.data['search']
            lookup = Q(title__icontains=data) | Q(body__icontains=data) | Q(category__icontains=data) | Q(
                BlogUrl__icontains=data) | Q(KeyWord__icontains=data) | Q(Description__icontains=data)
            post = Blog.objects.filter(lookup)
            post = BlogSerializer(post, many=True)
            return Response({'posts': post.data})
        except:
            message = {'Invalid Search'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)


class jobBlogViews(APIView):
    @method_decorator(cache_page(60 * 5))
    def get(self, request):
        try:
            all = JobBlog.objects.all()
            return Response({'data': JobBlogSerializer(all, many=True).data})
        except:
            message = {'Invalid Search'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)


class addJobBlog(APIView):
    def post(self, request):
        # parse from data
        data = request.data.copy()

        token = data.pop('PUBLISHER_TOKEN')[0]
        if token != os.environ.get('PUBLISHER_TOKEN'):
            return Response({'message': 'Invalid Token'}, status=status.HTTP_401_UNAUTHORIZED)

        jobs_table = data.pop('jobs_table')[0]
        jobs_table = json.loads(jobs_table)

        serializer = JobBlogSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        job_blog = serializer.instance

        rows = []
        for job in jobs_table:
            row = JobBlogFeaturedJobs.objects.create(**job)
            rows.append(row)
            job_blog.jobs_table.add(row)

        job_blog.save()
        return Response({'data': JobBlogSerializer(job_blog).data})
