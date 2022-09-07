from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    targetJob = models.CharField(max_length=100, null=True)
    targetField = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.user.username
