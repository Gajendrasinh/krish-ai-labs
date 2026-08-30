"""Loads the site's knowledge base markdown files and splits them into
retrievable chunks (one chunk per `##` section, keeping the source's `#`
title as context)."""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

KB_DIR = Path(__file__).resolve().parent.parent / "data" / "kb"

_SECTION_RE = re.compile(r"^##\s+(.*)$", re.MULTILINE)


@dataclass(frozen=True)
class Chunk:
    """One retrievable piece of the knowledge base."""

    source: str  # e.g. "services.md"
    heading: str  # e.g. "RAG & LLM Applications"
    text: str  # section body, including the heading


def _split_sections(doc_title: str, body: str) -> list[tuple[str, str]]:
    """Split a markdown document on `##` headings. Returns (heading, text) pairs."""
    matches = list(_SECTION_RE.finditer(body))
    if not matches:
        return [(doc_title, body.strip())]

    sections = []
    for i, m in enumerate(matches):
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
        heading = m.group(1).strip()
        text = body[start:end].strip()
        sections.append((heading, text))
    return sections


def load_chunks() -> list[Chunk]:
    """Read every .md file in data/kb/ and split it into Chunks."""
    chunks: list[Chunk] = []
    for path in sorted(KB_DIR.glob("*.md")):
        raw = path.read_text(encoding="utf-8")
        title_match = re.match(r"^#\s+(.*)$", raw, re.MULTILINE)
        doc_title = title_match.group(1).strip() if title_match else path.stem
        for heading, text in _split_sections(doc_title, raw):
            chunks.append(Chunk(source=path.name, heading=heading, text=text))
    return chunks
