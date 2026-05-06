"""Calendar link generation utilities."""

from .calendar_urls import (
    CalendarEvent,
    build_google_calendar_url,
    build_outlook_calendar_url,
)

__all__ = [
    "CalendarEvent",
    "build_google_calendar_url",
    "build_outlook_calendar_url",
]
