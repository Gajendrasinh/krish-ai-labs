"""The RAG agent: a Claude tool-use loop where the only tool is retrieval
over the Krish AI Labs knowledge base (see retriever.py). Claude decides
when to search and how to phrase the query; this module just runs the
request/tool/result loop and hands back the final answer plus the sources
Claude actually used.

Falls back to a retrieval-only mode (no LLM call) when no Anthropic
credential is configured, so the backend is testable end to end before a
real API key exists — see config.has_api_key().
"""

from __future__ import annotations

import json
import re

from . import config
from .retriever import TfidfRetriever
from .schemas import ChatMessage, ChatResponse, Source

SYSTEM_PROMPT = """\
You are the AI assistant embedded on the Krish AI Labs website and mobile app. \
Krish AI Labs is a software development and IT consultancy studio (tagline: \
"Building Intelligent Software for the Future") offering AI & GenAI development, \
full-stack software development, AI agents & automation, RAG & LLM applications, \
cloud solutions, and technical consulting, for both enterprise and startup clients.

Use the search_knowledge_base tool to look up anything about Krish AI Labs — \
services, sample projects, the founder, pricing/contact info — before answering. \
Don't rely on assumptions about the company; ground factual claims in what the \
tool returns. If the knowledge base doesn't cover something, say so plainly and \
point the visitor to the Contact page (hello@krishailabs.com) instead of guessing.

Keep answers conversational and short — a few sentences, not an essay. This is a \
chat widget, not a report. If asked something unrelated to Krish AI Labs or its \
services, politely redirect to what you can help with.\
"""

SEARCH_TOOL = {
    "name": "search_knowledge_base",
    "description": (
        "Search Krish AI Labs' own site content (services, portfolio, about, "
        "contact) for sections relevant to a query. Returns the best-matching "
        "sections with their source page and heading."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "A short search query capturing what the visitor wants to know.",
            }
        },
        "required": ["query"],
        "additionalProperties": False,
    },
}

MAX_TOOL_ITERATIONS = 4


class ChatAgent:
    def __init__(self, retriever: TfidfRetriever | None = None):
        self.retriever = retriever or TfidfRetriever()

    def _run_search_tool(self, query: str) -> tuple[str, list[Source]]:
        hits = self.retriever.search(query)
        sources = [Source(source=h.chunk.source, heading=h.chunk.heading) for h in hits]
        if not hits:
            return "No matching content found in the knowledge base.", []
        payload = [
            {"source": h.chunk.source, "heading": h.chunk.heading, "text": h.chunk.text}
            for h in hits
        ]
        return json.dumps(payload), sources

    def _retrieval_only_reply(self, message: str) -> ChatResponse:
        hits = self.retriever.search(message)
        if not hits:
            return ChatResponse(
                reply=(
                    "I'm running in retrieval-only mode right now (no AI model configured "
                    "yet) and couldn't find anything matching that in our site content. "
                    "Try asking about our services, portfolio, or how to get in touch — or "
                    "email hello@krishailabs.com directly."
                ),
                mode="retrieval_only",
            )
        top = hits[0].chunk
        body = re.sub(r"^##\s+.*\n", "", top.text).strip()
        reply = (
            f"(Retrieval-only mode — no AI model configured yet, so this is the closest "
            f"matching section rather than a generated answer.)\n\n"
            f"From “{top.heading}” ({top.source}):\n{body}"
        )
        sources = [Source(source=h.chunk.source, heading=h.chunk.heading) for h in hits]
        return ChatResponse(reply=reply, sources=sources, mode="retrieval_only")

    def reply(self, message: str, history: list[ChatMessage]) -> ChatResponse:
        if not config.has_api_key():
            return self._retrieval_only_reply(message)

        # Imported lazily so the module (and retrieval-only mode) has no hard
        # dependency on the `anthropic` package being importable/configured.
        import anthropic

        client = anthropic.Anthropic()
        messages: list[dict] = [
            {"role": m.role, "content": m.content} for m in history
        ] + [{"role": "user", "content": message}]

        all_sources: list[Source] = []
        seen_sources: set[tuple[str, str]] = set()

        for _ in range(MAX_TOOL_ITERATIONS):
            response = client.messages.create(
                model=config.MODEL,
                max_tokens=1024,
                system=SYSTEM_PROMPT,
                tools=[SEARCH_TOOL],
                # Routine, latency-sensitive Q&A — low effort keeps this snappy
                # and cheap; raise it if answer quality needs more reasoning.
                output_config={"effort": "low"},
                messages=messages,
            )

            if response.stop_reason != "tool_use":
                text = "".join(b.text for b in response.content if b.type == "text").strip()
                if not text:
                    text = "Sorry, I wasn't able to put together an answer for that."
                return ChatResponse(reply=text, sources=all_sources, mode="agent")

            messages.append({"role": "assistant", "content": response.content})

            tool_results = []
            for block in response.content:
                if block.type != "tool_use":
                    continue
                if block.name == "search_knowledge_base":
                    query = block.input.get("query", "") if isinstance(block.input, dict) else ""
                    result_text, sources = self._run_search_tool(query)
                    for s in sources:
                        key = (s.source, s.heading)
                        if key not in seen_sources:
                            seen_sources.add(key)
                            all_sources.append(s)
                    tool_results.append(
                        {"type": "tool_result", "tool_use_id": block.id, "content": result_text}
                    )
                else:
                    tool_results.append(
                        {
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": f"Unknown tool: {block.name}",
                            "is_error": True,
                        }
                    )
            messages.append({"role": "user", "content": tool_results})

        return ChatResponse(
            reply="I looked into that but couldn't wrap up an answer in time — could you rephrase or ask something more specific?",
            sources=all_sources,
            mode="agent",
        )
