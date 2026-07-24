from fastapi import FastAPI
from sqlalchemy import String, Integer, Text, JSON, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
import os

app = FastAPI(title="Agent Platform - Backend")

@app.get("/health")
async def health():
    """Endpoint to check backend server is up"""
    return {"status": "ok", "service": "agent platform backend up"}

app.post("/agents/contract")
async def contract_creation(request):
    """Endpoint for the RH contract agent"""
    return {"status": "ok", "service": "agent platform backend up"}

db_user = os.getenv("DB_AUTH_USER")
db_pwd = os.getenv("DB_AUTH_PWD")
db_name = os.getenv("DB_AUTH_NAME")

DATABASE_URL = f"postgresql://{db_user}:{db_pwd}@database:5432/{db_name}"

engine = create_engine(DATABASE_URL, echo=True)

# class ListOfStatus():
#     PROD: "production"
#     TEST: "production"
#     ARCHIVE: "archive"

# class ModelHandled():
#     CLAUDE_SONNET: "sonnet"
#     CLAUDE_FABLE: "fable"
#     GEMINI: "gemini"
#     CHATGPT: "gpt"
#     QWEN: "qwen"

class Base(DeclarativeBase):
    pass

class Prompt(Base):
    __tablename__ = "prompts"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    version: Mapped[int] = mapped_column(Integer, primary_key=True)

    template: Mapped[str] = mapped_column(Text)
    variables: Mapped[list[str]] = mapped_column(JSON)
    model_hint: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(20))

Base.metadata.create_all(engine)