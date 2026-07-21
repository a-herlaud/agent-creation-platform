from fastapi import FastAPI

app = FastAPI(title="Agent Platform - Backend")

@app.get("/health")
async def health():
    """Endpoint de santé pour vérifier que le serveur est actif"""
    return {"status": "ok", "service": "agent platform backend up"}