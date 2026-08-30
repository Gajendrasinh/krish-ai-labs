# Krish AI Labs — Chat backend

A small FastAPI service backing the AI chat widget on the [website](../site). It's a genuine
(if intentionally small) RAG agent:

- **Retrieval** (`app/retriever.py`) — a dependency-free TF-IDF index over the site's own content
  (`data/kb/*.md`, one chunk per `##` section). No embeddings API, no vector database — good
  enough for a handful of documents. Swap it for a real vector store (pgvector, Pinecone, Chroma)
  if the knowledge base grows.
- **Agent** (`app/agent.py`) — a Claude tool-use loop (Anthropic Python SDK, model
  `claude-opus-5`) where the only tool is `search_knowledge_base`. Claude decides when to search
  and how to phrase the query, then answers grounded in what it found, citing which page(s) it
  used.
- **API** (`app/main.py`) — one endpoint, matching the contract the website's `ChatWidget.jsx`
  already expects:

  ```
  POST /api/chat
  Request  { message: string, history: { role: 'user' | 'assistant', content: string }[] }
  Response { reply: string, sources: { source: string, heading: string }[], mode: 'agent' | 'retrieval_only' }
  GET  /health -> { status: 'ok', mode: 'agent' | 'retrieval_only' }
  ```

## Two modes, no key required to start

If `ANTHROPIC_API_KEY` (or `ANTHROPIC_AUTH_TOKEN`) isn't set, the backend runs in
**retrieval-only mode**: it still answers from the knowledge base (best-matching section, no LLM
call), and says so in the reply. Set the key and it switches to the full agent automatically — no
code change needed. This means the service is runnable and testable right away; add a key when
you have one.

## Run locally

```sh
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env   # fill in ANTHROPIC_API_KEY when you have one

uvicorn app.main:app --reload --port 8000
```

```sh
curl -s http://127.0.0.1:8000/health

curl -s -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What AI agent services do you offer?", "history": []}'
```

## Tests

```sh
pytest
```

Tests run without any credentials (retrieval-only path) — `test_retriever.py` checks the TF-IDF
index finds the right sections for a few sample queries, `test_api.py` checks the FastAPI
contract end to end.

## Deploy

```sh
docker build -t krish-ai-labs-backend .
docker run -p 8000:8000 -e ANTHROPIC_API_KEY=sk-ant-... krish-ai-labs-backend
```

Any host that runs a container or a Python ASGI app works (Fly.io, Render, Railway, Cloud Run,
ECS, etc). Set `ALLOWED_ORIGINS` to the real website origin before going to production — it
defaults to `*` (open) for local dev.

## Wiring up the website

Point `CHAT_ENDPOINT` in `site/src/components/ChatWidget.jsx` at this service's `/api/chat` URL
(and delete `site/dev/chatStubPlugin.js` once this is live — it was only a placeholder).

## Extending the knowledge base

Drop more `.md` files into `data/kb/`, using `##` headings to mark retrievable sections — no code
change needed, `knowledge_base.py` loads every file in that directory at process startup.
