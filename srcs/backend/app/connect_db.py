from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import os

db_user = os.getenv("DB_AUTH_USER")
db_pwd = os.getenv("DB_AUTH_PWD")
db_name = os.getenv("DB_AUTH_NAME")

print(db_user)
print(db_pwd)
DATABASE_URL = f"postgresql://{db_user}:{db_pwd}@database:5432/{db_name}"

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()