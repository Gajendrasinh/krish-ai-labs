"""A small, dependency-free TF-IDF retriever over the knowledge base.

This is intentionally not a real vector store — no embeddings API, no
external service, nothing beyond the standard library. It's the retrieval
half of RAG sized for a handful of markdown documents. Swap this module
for a proper embedding-based vector store (e.g. pgvector, Pinecone,
Chroma) if the knowledge base grows past a few dozen documents.
"""

from __future__ import annotations

import math
import re
from collections import Counter
from dataclasses import dataclass

from .knowledge_base import Chunk, load_chunks

_TOKEN_RE = re.compile(r"[a-z0-9]+")

_STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "of", "to", "in", "on", "for",
    "is", "are", "was", "were", "be", "been", "being", "with", "as", "at",
    "by", "from", "that", "this", "it", "its", "we", "our", "you", "your",
    "do", "does", "what", "how", "can", "i", "have", "has",
}


def tokenize(text: str) -> list[str]:
    return [t for t in _TOKEN_RE.findall(text.lower()) if t not in _STOPWORDS]


@dataclass(frozen=True)
class ScoredChunk:
    chunk: Chunk
    score: float


class TfidfRetriever:
    """In-memory TF-IDF index built once at process startup."""

    def __init__(self, chunks: list[Chunk] | None = None):
        self.chunks = chunks if chunks is not None else load_chunks()
        self._doc_tokens = [tokenize(f"{c.heading} {c.text}") for c in self.chunks]
        self._doc_term_counts = [Counter(toks) for toks in self._doc_tokens]

        df: Counter[str] = Counter()
        for toks in self._doc_tokens:
            df.update(set(toks))
        n_docs = max(len(self.chunks), 1)
        self._idf = {
            term: math.log((n_docs + 1) / (count + 1)) + 1.0 for term, count in df.items()
        }

        self._doc_vectors = [
            self._tfidf_vector(counts) for counts in self._doc_term_counts
        ]
        self._doc_norms = [self._norm(vec) for vec in self._doc_vectors]

    def _tfidf_vector(self, term_counts: Counter[str]) -> dict[str, float]:
        return {
            term: count * self._idf.get(term, 0.0) for term, count in term_counts.items()
        }

    @staticmethod
    def _norm(vec: dict[str, float]) -> float:
        return math.sqrt(sum(v * v for v in vec.values())) or 1.0

    def search(self, query: str, top_k: int = 3, min_score: float = 0.05) -> list[ScoredChunk]:
        query_terms = Counter(tokenize(query))
        if not query_terms:
            return []
        query_vec = self._tfidf_vector(query_terms)
        query_norm = self._norm(query_vec)

        scored: list[ScoredChunk] = []
        for chunk, doc_vec, doc_norm in zip(self.chunks, self._doc_vectors, self._doc_norms):
            dot = sum(w * doc_vec.get(term, 0.0) for term, w in query_vec.items())
            if dot <= 0:
                continue
            score = dot / (query_norm * doc_norm)
            if score >= min_score:
                scored.append(ScoredChunk(chunk=chunk, score=score))

        scored.sort(key=lambda s: s.score, reverse=True)
        return scored[:top_k]
