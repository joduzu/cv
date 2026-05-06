"""Command-line entry point for the DOCX calendar event parser."""

from __future__ import annotations

import argparse
from dataclasses import asdict
from datetime import datetime
import json

from .parser import CalendarEvent, parse_events_from_docx


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Extract calendar event candidates from a .docx file.",
    )
    parser.add_argument("docx_path", help="Path to the .docx file to inspect.")
    args = parser.parse_args()

    events = parse_events_from_docx(args.docx_path)
    print(json.dumps([_event_to_json(event) for event in events], ensure_ascii=False, indent=2))


def _event_to_json(event: CalendarEvent) -> dict[str, object]:
    payload = asdict(event)
    for key, value in payload.items():
        if isinstance(value, datetime):
            payload[key] = value.isoformat()
    return payload


if __name__ == "__main__":
    main()
