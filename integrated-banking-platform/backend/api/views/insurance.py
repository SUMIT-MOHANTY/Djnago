from rest_framework import viewsets
from api.models import Policy
from api.serializers.insurance import PolicySerializer

class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
