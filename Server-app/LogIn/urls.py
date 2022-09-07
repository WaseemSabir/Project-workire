from django.contrib import admin
from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenVerifyView,
)

urlpatterns = [
    path('api/token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api', views.SignUp.as_view(), name='url'),
    path('api/getUser/', views.getUserdata.as_view(), name='getUser'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
