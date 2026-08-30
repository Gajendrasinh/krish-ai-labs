"""API-level tests. Run without ANTHROPIC_API_KEY set, so the agent runs in
retrieval-only mode — these don't exercise the real LLM call, just the
FastAPI contract and the retrieval fallback path."""

import os

os.environ.pop("ANTHROPIC_API_KEY", None)
os.environ.pop("ANTHROPIC_AUTH_TOKEN", None)

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok", "mode": "retrieval_only"}


def test_chat_retrieval_only_mode():
    res = client.post("/api/chat", json={"message": "What services do you offer?", "history": []})
    assert res.status_code == 200
    body = res.json()
    assert isinstance(body["reply"], str) and body["reply"]
    assert body["mode"] == "retrieval_only"


def test_chat_rejects_empty_message():
    res = client.post("/api/chat", json={"message": "", "history": []})
    assert res.status_code == 422


def test_chat_accepts_history():
    res = client.post(
        "/api/chat",
        json={
            "message": "And what about pricing?",
            "history": [
                {"role": "user", "content": "What services do you offer?"},
                {"role": "assistant", "content": "We offer AI and full-stack development."},
            ],
        },
    )
    assert res.status_code == 200
