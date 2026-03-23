from rest_framework import viewsets
from api.models import Account
from api.serializers.banking import AccountSerializer

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
