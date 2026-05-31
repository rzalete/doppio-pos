from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User

db = SessionLocal()

admin = User(
    name="Admin",
    email="admin@doppio.com",
    password_hash=hash_password("admin123"),
    role="admin",
)

cashier = User(
    name="Cashier One",
    email="cashier@doppio.com",
    password_hash=hash_password("cashier123"),
    role="cashier",
)

db.add(admin)
db.add(cashier)
db.commit()
db.close()

print("Seeded admin and cashier users.")