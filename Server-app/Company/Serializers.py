from django.db.models import fields
from rest_framework import serializers
from .models import *


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class JobFeaturedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['Position', 'AdvertiserName', 'Country', 'Location', 'slug']


class TrendingSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrendingSearch
        fields = '__all__'


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Countries
        fields = '__all__'


class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = '__all__'


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = '__all__'


class CatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class JobBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobBlog
        fields = '__all__'
        depth = 1
