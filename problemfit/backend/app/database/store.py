from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4


class JsonStore:
    def __init__(self, path: Path):
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)

    @property
    def mode(self) -> str:
        return "local_json"

    def _read(self) -> dict[str, Any]:
        if not self.path.exists():
            return {"profiles": {}, "saved_analyses": []}
        return json.loads(self.path.read_text(encoding="utf-8"))

    def _write(self, data: dict[str, Any]) -> None:
        self.path.write_text(json.dumps(data, indent=2), encoding="utf-8")

    def save_profile(self, user_id: str, known_topics: list[str], preferred_language: str | None = None) -> dict[str, Any]:
        data = self._read()
        profile = {
            "user_id": user_id,
            "known_topics": sorted(set(known_topics)),
            "preferred_language": preferred_language,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        data.setdefault("profiles", {})[user_id] = profile
        self._write(data)
        return profile

    def get_profile(self, user_id: str) -> dict[str, Any]:
        data = self._read()
        return data.get("profiles", {}).get(
            user_id,
            {"user_id": user_id, "known_topics": [], "preferred_language": None, "updated_at": None},
        )

    def save_analysis(self, user_id: str, title: str, problem_text: str, analysis: dict[str, Any]) -> dict[str, Any]:
        data = self._read()
        saved = {
            "id": str(uuid4()),
            "user_id": user_id,
            "title": title,
            "problem_text": problem_text,
            "analysis": analysis,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        data.setdefault("saved_analyses", []).insert(0, saved)
        self._write(data)
        return saved

    def list_saved_analyses(self, user_id: str) -> list[dict[str, Any]]:
        data = self._read()
        return [item for item in data.get("saved_analyses", []) if item.get("user_id") == user_id]


class MongoStore:
    def __init__(self, uri: str, db_name: str):
        from pymongo import MongoClient

        self.client = MongoClient(uri, serverSelectionTimeoutMS=3000)
        self.db = self.client[db_name]
        self.client.admin.command("ping")

    @property
    def mode(self) -> str:
        return "mongodb"

    def save_profile(self, user_id: str, known_topics: list[str], preferred_language: str | None = None) -> dict[str, Any]:
        profile = {
            "user_id": user_id,
            "known_topics": sorted(set(known_topics)),
            "preferred_language": preferred_language,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        self.db.profiles.update_one({"user_id": user_id}, {"$set": profile}, upsert=True)
        return profile

    def get_profile(self, user_id: str) -> dict[str, Any]:
        profile = self.db.profiles.find_one({"user_id": user_id}, {"_id": 0})
        return profile or {"user_id": user_id, "known_topics": [], "preferred_language": None, "updated_at": None}

    def save_analysis(self, user_id: str, title: str, problem_text: str, analysis: dict[str, Any]) -> dict[str, Any]:
        saved = {
            "id": str(uuid4()),
            "user_id": user_id,
            "title": title,
            "problem_text": problem_text,
            "analysis": analysis,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        self.db.saved_analyses.insert_one(saved)
        saved.pop("_id", None)
        return saved

    def list_saved_analyses(self, user_id: str) -> list[dict[str, Any]]:
        return list(self.db.saved_analyses.find({"user_id": user_id}, {"_id": 0}).sort("created_at", -1))


def build_store() -> JsonStore | MongoStore:
    uri = os.getenv("MONGODB_URI")
    if uri:
        try:
            return MongoStore(uri, os.getenv("MONGODB_DB", "problemfit"))
        except Exception:
            # Demo mode should stay alive even if Atlas is unavailable.
            pass
    return JsonStore(Path(__file__).resolve().parent / "local_store.json")
