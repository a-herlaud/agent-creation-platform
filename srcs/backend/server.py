from fastapi import FastAPI

app = FastAPI(title="Agent Platform - Backend")

@app.get("/health")
async def health():
    """Endpoint to check backend server is up"""
    return {"status": "ok", "service": "agent platform backend up"}

app.post("/agents/contract")
async def contract_creation(request):
    """Endpoint for the RH contract agent"""
    return {"status": "ok", "service": "agent platform backend up"}
