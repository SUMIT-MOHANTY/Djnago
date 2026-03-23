import factory
from django.contrib.auth import get_user_model
from api.models import banking, insurance
from decimal import Decimal

User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    first_name = "John"
    last_name = "Doe"
    password = factory.PostGenerationMethodCall('set_password', 'pass123')
    role = "customer"

class AccountFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = banking.Account

    user = factory.SubFactory(UserFactory)
    account_no = factory.Sequence(lambda n: f"ACC{n:08d}")
    type = "savings"
    balance = Decimal("1000.00")
    currency = "USD"

class TransferFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = banking.Transfer

    from_account = factory.SubFactory(AccountFactory)
    to_account = factory.SubFactory(AccountFactory)
    amount = Decimal("100.00")
    status = "complete"
    note = "test transfer"

class PolicyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = insurance.Policy

    name = factory.Sequence(lambda n: f"Policy {n}")
    category = "life"
    premium = Decimal("30.00")
    coverage = Decimal("10000.00")
    tenure_months = 12

class PolicyEnrollmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = insurance.PolicyEnrollment

    policy = factory.SubFactory(PolicyFactory)
    customer = factory.SubFactory(UserFactory)
    premium_account = factory.SubFactory(AccountFactory)
    status = "active"

class ClaimFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = insurance.Claim

    policy_enrollment = factory.SubFactory(PolicyEnrollmentFactory)
    claimed_amount = Decimal("500.00")
    status = "pending"
    description = "accident"
    bank_account = factory.SubFactory(AccountFactory)
