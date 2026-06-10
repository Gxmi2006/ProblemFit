from __future__ import annotations

import re
import unicodedata


def normalize_text(text: str) -> str:
    text = unicodedata.normalize("NFKD", text or "")
    text = text.lower()
    text = re.sub(r"10\s*\^\s*9\s*\+\s*7", "10^9+7", text)
    text = re.sub(r"[^a-z0-9+#_]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def tokenize(text: str) -> set[str]:
    return {token for token in normalize_text(text).split() if len(token) > 1}


def statement_quality_multiplier(text: str) -> float:
    tokens = normalize_text(text).split()
    if len(tokens) < 18:
        return 0.72
    if len(tokens) < 35:
        return 0.86
    return 1.0
