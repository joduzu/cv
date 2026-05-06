"""Utilities for extracting calendar events from Word documents."""

from .parser import CalendarEvent, parse_events_from_docx

__all__ = ["CalendarEvent", "parse_events_from_docx"]
