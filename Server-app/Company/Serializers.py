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
        fields = ['id','Position','AdvertiserName','PostDate','Classification','Description','Country','Location','EmploymentType','WorkHours','Area','PostalCode','SalaryCurrency','SalaryMinimum','SalaryMaximum','SalaryPeriod','LogoURL']

class JobFeaturedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['Position','AdvertiserName','Country','Location']

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