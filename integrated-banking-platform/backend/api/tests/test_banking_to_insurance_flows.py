import pytest
from decimal import Decimal
from api.models import banking, insurance, ledger

@pytest.mark.django_db
def test_premium_deduction_reduces_balance_and_creates_ledger(seeded_data, api_client, auth_headers):
    cust = seeded_data["customer1"]
    acc = seeded_data["accounts"]["cust1"][0]
    enroll = insurance.PolicyEnrollment.objects.filter(customer=cust).first()
    before = acc.balance

    url = "/api/v1/banking/transfers/"
    headers = auth_headers(cust.email)
    resp = api_client.post(url, {
        "from_account": acc.id,
        "to_account": 999,  # placeholder for insurer internal
        "amount": str(enroll.policy.premium),
        "note": "Premium"
    }, **headers)
    assert resp.status_code == 201
    acc.refresh_from_db()
    assert acc.balance == before - enroll.policy.premium

    assert ledger.Ledger.objects.filter(reference=resp.data["id"]).exists()
