from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Django stores hashed password
    created_at = models.DateTimeField(auto_now_add=True)
