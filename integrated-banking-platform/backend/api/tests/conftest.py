import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .factories import (
    UserFactory,
    AccountFactory,
    TransferFactory,
    PolicyFactory,
    PolicyEnrollmentFactory,
    ClaimFactory
)

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def auth_headers():
    def _make(email, password="pass123"):
        client = APIClient()
        resp = client.post("/api/v1/auth/login/", {"email": email, "password": password})
        token = resp.data["access"]
        return {"HTTP_AUTHORIZATION": f"Bearer {token}"}
    return _make

@pytest.fixture
def seeded_data(db):
    # create users
    customer1 = UserFactory(role="customer", email="cust1@example.com")
    customer2 = UserFactory(role="customer", email="cust2@example.com")
    bank_staff = UserFactory(role="bank_staff", email="staff@example.com")
    insurer = UserFactory(role="insurer", email="insurer@example.com")

    # accounts
    acc11 = AccountFactory(user=customer1)
    acc12 = AccountFactory(user=customer1)
    acc13 = AccountFactory(user=customer1)
    acc21 = AccountFactory(user=customer2)
    acc22 = AccountFactory(user=customer2)
    acc23 = AccountFactory(user=customer2)

    # policies
    pol1 = PolicyFactory()
    pol2 = PolicyFactory()
    PolicyEnrollmentFactory(policy=pol1, customer=customer1, premium_account=acc11)
    PolicyEnrollmentFactory(policy=pol2, customer=customer2, premium_account=acc21)

    # transfers
    TransferFactory(from_account=acc11, to_account=acc21)
    TransferFactory(from_account=acc12, to_account=acc22)
    TransferFactory(from_account=acc13, to_account=acc23)

    # claims
    claim1 = ClaimFactory(policy_enrollment__customer=customer1, bank_account=acc11)
    claim2 = ClaimFactory(policy_enrollment__customer=customer2, bank_account=acc21)

    return {
        "customer1": customer1,
        "customer2": customer2,
        "bank_staff": bank_staff,
        "insurer": insurer,
        "accounts": {"cust1": [acc11, acc12, acc13], "cust2": [acc21, acc22, acc23]},
        "policies": [pol1, pol2],
    }
