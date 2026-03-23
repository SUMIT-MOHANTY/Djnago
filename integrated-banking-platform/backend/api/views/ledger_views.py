from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
from backend.api.models.ledger import Ledger
from backend.api.serializers.ledger import LedgerSerializer
import logging

logger = logging.getLogger(__name__)

class LedgerViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only viewset for ledger entries"""
    queryset = Ledger.objects.all().order_by('timestamp')
    serializer_class = LedgerSerializer

    @action(detail=False, methods=['get'])
    def page(self, request):
        """Custom paginated endpoint for ledger"""
        from rest_framework.pagination import PageNumberPagination

        paginator = PageNumberPagination()
        paginator.page_size = min(int(request.query_params.get('limit', 50)), 500)
        paginator.page = request.query_params.get('page', 1)

        queryset = self.get_queryset()

        from_tx = request.query_params.get('from_tx')
        if from_tx:
            queryset = queryset.filter(tx_id__gte=from_tx)

        to_tx = request.query_params.get('to_tx')
        if to_tx:
            queryset = queryset.filter(tx_id__lte=to_tx)

        paginated = paginator.paginate_queryset(queryset, request)
        serializer = self.get_serializer(paginated, many=True)

        return paginator.get_paginated_response(serializer.data)

    def create(self, request, *args, **kwargs):
        return Response(
            {"error": "Method not allowed"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def update(self, request, *args, **kwargs):
        return Response(
            {"error": "Method not allowed"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def destroy(self, request, *args, **kwargs):
        return Response(
            {"error": "Method not allowed"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
