from __future__ import annotations

import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from . import config
from .agent import ChatAgent
from .schemas import ChatRequest, ChatResponse

logger = logging.getLogger("krish_ai_labs.chat")

app = FastAPI(title="Krish AI Labs Chat API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

# Built once at process startup — the TF-IDF index and the Anthropic client
# (if configured) are reused across requests rather than rebuilt per call.
agent = ChatAgent()


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "mode": "agent" if config.has_api_key() else "retrieval_only"}


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    try:
        return agent.reply(req.message, req.history)
    except Exception:  # noqa: BLE001 — surface a clean 502 instead of a stack trace to clients
        logger.exception("chat request failed")
        raise HTTPException(status_code=502, detail="The chat backend hit an error. Please try again.")
