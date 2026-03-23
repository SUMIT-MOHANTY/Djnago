from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.users import UserViewSet
from .views.banking import AccountViewSet
from .views.insurance import PolicyViewSet
from .views.ledger import TransactionViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'accounts', AccountViewSet)
router.register(r'policies', PolicyViewSet)
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
from .views import ledger as ledger_views

router.register(r'ledger', ledger_views.LedgerViewSet, basename='ledger')
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'ledger', LedgerViewSet, basename='ledger')
urlpatterns = router.urls
