from django.db import models
from api.models import User

class Policy(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='policies')
    premium = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
