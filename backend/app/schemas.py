from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    history: list[ChatMessage] = Field(default_factory=list)


class Source(BaseModel):
    source: str
    heading: str


class ChatResponse(BaseModel):
    reply: str
    sources: list[Source] = Field(default_factory=list)
    mode: Literal["agent", "retrieval_only"] = "agent"
