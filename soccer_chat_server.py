#!/usr/bin/env python3
"""
Local API bridge for the portfolio Soccer page.

It reuses your existing soccer-ai project:
  /Users/andrewchoi/Desktop/CS/soccer-ai

Run:
  python3 soccer_chat_server.py
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any


SOCCER_AI_DIR = Path("/Users/andrewchoi/Desktop/CS/soccer-ai")


if not SOCCER_AI_DIR.exists():
    raise FileNotFoundError(f"Soccer AI directory not found: {SOCCER_AI_DIR}")

# Make your soccer-ai modules importable and keep their relative file loads working.
sys.path.insert(0, str(SOCCER_AI_DIR))
os.chdir(SOCCER_AI_DIR)

from chat import SYSTEM_PROMPT, ask_ollama, build_context  # noqa: E402


_system_prompt_cache: str | None = None


def get_system_prompt(force_refresh: bool = False) -> str:
    global _system_prompt_cache
    if force_refresh or _system_prompt_cache is None:
        _system_prompt_cache = SYSTEM_PROMPT.format(context=build_context("", 90))
    return _system_prompt_cache


def normalize_history(history: Any) -> list[dict[str, str]]:
    if not isinstance(history, list):
        return []

    cleaned: list[dict[str, str]] = []
    for item in history:
        if not isinstance(item, dict):
            continue
        role = str(item.get("role", "")).strip().lower()
        content = str(item.get("content", "")).strip()
        if role not in {"user", "assistant"}:
            continue
        if not content:
            continue
        cleaned.append({"role": role, "content": content})
    return cleaned[-20:]


class SoccerAIHandler(BaseHTTPRequestHandler):
    server_version = "SoccerAIHTTP/1.0"

    def _send_json(self, status_code: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/api/health":
            self._send_json(
                200,
                {
                    "ok": True,
                    "service": "soccer-ai-chat",
                    "soccer_ai_dir": str(SOCCER_AI_DIR),
                },
            )
            return

        self._send_json(404, {"ok": False, "error": "Not found"})

    def do_POST(self) -> None:  # noqa: N802
        if self.path == "/api/refresh":
            try:
                get_system_prompt(force_refresh=True)
                self._send_json(200, {"ok": True, "refreshed": True})
            except Exception as exc:  # pragma: no cover - runtime path
                self._send_json(500, {"ok": False, "error": str(exc)})
            return

        if self.path != "/api/chat":
            self._send_json(404, {"ok": False, "error": "Not found"})
            return

        try:
            raw_len = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            raw_len = 0

        body = self.rfile.read(max(raw_len, 0))
        try:
            data = json.loads(body.decode("utf-8") if body else "{}")
        except json.JSONDecodeError:
            self._send_json(400, {"ok": False, "error": "Invalid JSON payload"})
            return

        message = str(data.get("message", "")).strip()
        if not message:
            self._send_json(400, {"ok": False, "error": "message is required"})
            return

        history = normalize_history(data.get("history", []))
        history.append({"role": "user", "content": message})

        try:
            system_prompt = get_system_prompt()
            reply = ask_ollama(system_prompt, history)
        except Exception as exc:  # pragma: no cover - runtime path
            self._send_json(500, {"ok": False, "error": str(exc)})
            return

        self._send_json(200, {"ok": True, "reply": str(reply)})


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Soccer AI chat API bridge")
    parser.add_argument("--host", default="127.0.0.1", help="Bind host (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=5051, help="Bind port (default: 5051)")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    get_system_prompt(force_refresh=True)

    server = ThreadingHTTPServer((args.host, args.port), SoccerAIHandler)
    print(f"[soccer-ai] server running on http://{args.host}:{args.port}")
    print("[soccer-ai] endpoints: /api/health, /api/chat, /api/refresh")
    print("[soccer-ai] using project:", SOCCER_AI_DIR)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[soccer-ai] shutting down...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
