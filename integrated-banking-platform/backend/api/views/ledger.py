from rest_framework import viewsets
from api.models import Transaction
from api.serializers.ledger import TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
