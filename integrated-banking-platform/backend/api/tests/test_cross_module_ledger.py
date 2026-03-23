import pytest
from decimal import Decimal
from api.models import ledger as ledger_models

@pytest.mark.django_db
def test_transfer_then_loan_appends_two_ledger_rows(seeded_data, api_client, auth_headers):
    acc = seeded_data["accounts"]["cust1"][0]
    headers = auth_headers(acc.user.email)
    url = "/api/v1/banking/transfers/"
    resp = api_client.post(url, {
        "from_account": acc.id,
        "to_account": seeded_data["accounts"]["cust2"][0].id,
        "amount": "50.00"
    }, **headers)
    assert resp.status_code == 201
    transfer_id = resp.data["id"]

    resp = api_client.post("/api/v1/banking/loans/", {
        "account": acc.id,
        "principal": "200.00",
        "duration_months": 6,
        "interest_rate": "5.0"
    }, **headers)
    assert resp.status_code == 201
    loan_id = resp.data["id"]

    rows = ledger_models.Ledger.objects.all()
    refs = [r.reference for r in rows]
    assert transfer_id in refs
    assert loan_id in refs
