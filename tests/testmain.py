import pytest
from fastapi.testclient import TestClient
from main import app, create_db_and_tables, get_session, generate_token, ChangePasswordRequest
from user import User
from compte import Compte
from transaction import Transaction
from beneficiary import Beneficiary
from register import Register
from deposit import Deposit
from send_money import SendMoney
from cancel import Cancel
from account import Account_add, Account_delete
from beneficiary_add import Beneficiary_add

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    create_db_and_tables()
    yield

def test_create_db_and_tables():
    pass

def test_generate_token():
    user = User(id=1, email="test@example.com", mdp="hashed_password")
    token = generate_token(user)
    assert token is not None

def test_create_compte():
    account = Account_add(name="TestAccount", accountType="Savings")
    token = generate_token(User(id=1, email="test@example.com", mdp="hashed_p@55word"))
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/account_add/", json=account.model_dump(), headers=headers)
    assert response.status_code == 200
    assert "iban" in response.json()

def test_delete_compte():
    account = Account_delete(iban="FRc13b9639443286ce2566", password="hashed_p@55word")
    token = generate_token(User(id=1, email="test@example.com", mdp="hashed_p@55word"))
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/account_close/", json=account.model_dump(), headers=headers)
    assert response.status_code == 200

def test_register():
    register_data = Register(email="test5@example.com", mdp="hashed_p@55word")
    response = client.post("/register", json=register_data.dict())
    assert response.status_code == 200
    assert "token" in response.json()

def test_login():
    user_data = {"email": "test@example.com", "mdp": "hashed_p@55word"}
    response = client.post("/login", json=user_data)
    assert response.status_code == 200
    assert "token" in response.json()

def test_me():
    token = generate_token(User(id=1, email="test@example.com", mdp="hashed_password"))
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/me", headers=headers)
    assert response.status_code == 200

def test_deposit():
    deposit_data = Deposit(amount=100, iban_dest="FR1234567890")
    token = generate_token(User(id=1, email="test@example.com", mdp="hashed_password"))
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/deposit", json=deposit_data.dict(), headers=headers)
    assert response.status_code == 200

def test_send_money():
    send_money_data = SendMoney(amount=50, iban_orig="FR1234567890", iban_dest="FR0987654321")
    token = generate_token(User(id=1, email="test@example.com", mdp="hashed_password"))
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/send_money", json=send_money_data.dict(), headers=headers)
    assert response.status_code == 200

def test_cancel_transaction():
    cancel_data = Cancel(id=4)
    token = generate_token(User(id=3, email="test3@example.com", mdp="hashed_p@55word"))
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/cancel_transaction", json=cancel_data.model_dump(), headers=headers)
    assert response.status_code == 200

def test_create_beneficiary():
    beneficiary_data = Beneficiary_add(iban="FR0987654321", nom="Beneficiary")
    token = generate_token(User(id=1, email="test@example.com", mdp="hashed_password"))
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/beneficiary_add/", json=beneficiary_data.dict(), headers=headers)
    assert response.status_code == 200

def test_read_beneficiaries():
    token = generate_token(User(id=1, email="test@example.com", mdp="hashed_password"))
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/beneficiaries/", headers=headers)
    assert response.status_code == 200

def test_change_password():
    change_password_data = ChangePasswordRequest(currentPassword="old_password", new_password="new_password")
    token = generate_token(User(id=1, email="test@example.com", mdp="hashed_password"))
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/change_password/", json=change_password_data.dict(), headers=headers)
    assert response.status_code == 200