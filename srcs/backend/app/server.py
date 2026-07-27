from fastapi import FastAPI, Depends
from sqlalchemy import String, Integer, Text, JSON
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from pydantic import BaseModel
from connect_db import get_db, engine

app = FastAPI(title="Agent Platform - Backend")

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

class PromptTemplate(BaseModel):
    id: str
    version: int
    template: str
    variables: list[str]
    model_hint: str
    status: str

@app.get("/health")
def health():
    """Endpoint to check backend server is up"""
    return {"status": "ok", "service": "agent platform backend up"}

@app.post("/api/prompts")
async def contract_creation(request: PromptTemplate, db: Session = Depends(get_db)):
    """Endpoint for the RH contract agent"""

    prompt = Prompt(
        id=request.id,
        version=request.version,
        template=request.template,
        variables=request.variables,
        model_hint=request.model_hint,
        status=request.status,
    )

    db.add(prompt)
    db.commit()

    return prompt






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



