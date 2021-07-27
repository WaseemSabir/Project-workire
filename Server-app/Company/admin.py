from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Company)
admin.site.register(Job)
admin.site.register(Blog)
admin.site.register(Category)