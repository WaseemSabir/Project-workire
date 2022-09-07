from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from django.http import JsonResponse
# Create your views here.
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated  # <-- Here
from django.contrib.auth.hashers import make_password
from .Serializers import *
from rest_framework import status


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['name'] = self.user.username
        data['email'] = self.user.email
        profile = Profile.objects.get(user=self.user)
        data['targetJob'] = profile.targetJob
        data['targetField'] = profile.targetField
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class getUserdata(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
            prof = ProfileSerializer(profile, many=False)
            return Response({'userData': prof.data})
        except:
            message = {'detail': 'Unvalid User'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)


class SignUp(APIView):
    def post(self, request):
        data = request.data
        try:
            user = User.objects.create(
                username=data['email'],
                first_name=data['fname'],
                last_name=data['lname'],
                email=data['email'],
                password=make_password(data['pass'])
            )
            profile = Profile(user=user, targetJob=data['job'], targetField=data['field'])
            profile.save()
            prof = ProfileSerializer(profile, many=False)
            return Response({'UserData': prof.data})
        except:
            message = {'detail': 'User with this email already exists'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
