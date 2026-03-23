from rest_framework import serializers
from api.models import Policy

class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = ['id', 'user', 'premium', 'created_at']
