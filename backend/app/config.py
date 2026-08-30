"""Environment-driven settings. No secrets are hardcoded — ANTHROPIC_API_KEY
is read by the `anthropic` SDK directly from the environment; we only check
whether it's present to decide which mode to run in."""

from __future__ import annotations

import os

MODEL = os.environ.get("CHAT_MODEL", "claude-opus-5")
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("ALLOWED_ORIGINS", "*").split(",")
    if origin.strip()
]
PORT = int(os.environ.get("PORT", "8000"))


def has_api_key() -> bool:
    """True if the anthropic SDK has *some* credential to resolve (API key,
    auth token, or an `ant auth login` profile isn't checked here — just the
    common env-var case, which is enough to pick agent vs. retrieval-only
    mode without importing the SDK at module load time)."""
    return bool(os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("ANTHROPIC_AUTH_TOKEN"))
