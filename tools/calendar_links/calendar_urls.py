"""Utilities for building calendar event creation URLs."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, time, timezone
from typing import Any
from urllib.parse import urlencode
from zoneinfo import ZoneInfo

GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/render"
OUTLOOK_CALENDAR_URL = "https://outlook.live.com/calendar/0/deeplink/compose"
DEFAULT_TIMEZONE = "UTC"


@dataclass(frozen=True)
class CalendarEvent:
    """Calendar event data used to build provider-specific creation links.

    ``start`` and ``end`` may be timezone-aware datetimes, naive datetimes, or
    dates. Naive datetimes are interpreted in ``timezone``. Date values are
    treated as all-day boundaries.
    """

    title: str
    start: datetime | date
    end: datetime | date
    description: str = ""
    location: str = ""
    timezone: str = DEFAULT_TIMEZONE


def build_google_calendar_url(event: CalendarEvent) -> str:
    """Build a Google Calendar event creation URL for ``event``.

    Google Calendar expects compact UTC date-time ranges in the ``dates``
    parameter. The event timezone is still sent as ``ctz`` so the composer opens
    in the configured timezone.
    """

    tz_name = _event_timezone_name(event)
    params = {
        "action": "TEMPLATE",
        "text": _event_title(event),
        "dates": _google_dates(event, tz_name),
        "details": _event_description(event),
        "location": _event_location(event),
        "ctz": tz_name,
    }
    return f"{GOOGLE_CALENDAR_URL}?{urlencode(params)}"


def build_outlook_calendar_url(event: CalendarEvent) -> str:
    """Build an Outlook web event creation URL for ``event``.

    Outlook web accepts ISO 8601 date-time values. Values are normalized to the
    configured event timezone, preserving the local wall-clock time Outlook will
    display in the compose form.
    """

    tz_name = _event_timezone_name(event)
    params = {
        "path": "/calendar/action/compose",
        "rru": "addevent",
        "subject": _event_title(event),
        "startdt": _outlook_datetime(_event_start(event), tz_name),
        "enddt": _outlook_datetime(_event_end(event), tz_name),
        "body": _event_description(event),
        "location": _event_location(event),
    }
    return f"{OUTLOOK_CALENDAR_URL}?{urlencode(params)}"


def _event_title(event: Any) -> str:
    return str(_first_present(event, "title", "text", "subject", "summary", default=""))


def _event_description(event: Any) -> str:
    return str(_first_present(event, "description", "details", "body", default=""))


def _event_location(event: Any) -> str:
    return str(_first_present(event, "location", default=""))


def _event_timezone_name(event: Any) -> str:
    tz = _first_present(event, "timezone", "time_zone", "tz", "ctz", default=DEFAULT_TIMEZONE)

    if isinstance(tz, ZoneInfo):
        return tz.key
    if isinstance(tz, timezone):
        return tz.tzname(None) or DEFAULT_TIMEZONE

    tz_name = str(tz or DEFAULT_TIMEZONE)
    # Validate named timezones early so malformed links are not generated.
    _zoneinfo(tz_name)
    return tz_name


def _event_start(event: Any) -> datetime | date:
    return _first_present(event, "start", "start_datetime", "start_dt", "begin")


def _event_end(event: Any) -> datetime | date:
    return _first_present(event, "end", "end_datetime", "end_dt", "finish")


def _first_present(event: Any, *names: str, default: Any = None) -> Any:
    for name in names:
        if hasattr(event, name):
            value = getattr(event, name)
            if value is not None:
                return value
    if default is not None:
        return default
    raise AttributeError(f"CalendarEvent is missing one of: {', '.join(names)}")


def _google_dates(event: Any, tz_name: str) -> str:
    start = _event_start(event)
    end = _event_end(event)

    if _is_all_day_value(start) and _is_all_day_value(end):
        return f"{_as_date(start).strftime('%Y%m%d')}/{_as_date(end).strftime('%Y%m%d')}"

    start_utc = _as_aware_datetime(start, tz_name).astimezone(timezone.utc)
    end_utc = _as_aware_datetime(end, tz_name).astimezone(timezone.utc)
    return f"{_format_google_utc(start_utc)}/{_format_google_utc(end_utc)}"


def _outlook_datetime(value: datetime | date, tz_name: str) -> str:
    if isinstance(value, datetime):
        return _as_aware_datetime(value, tz_name).astimezone(_zoneinfo(tz_name)).isoformat()

    return datetime.combine(value, time.min, tzinfo=_zoneinfo(tz_name)).isoformat()


def _as_aware_datetime(value: datetime | date, tz_name: str) -> datetime:
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=_zoneinfo(tz_name))
        return value

    if isinstance(value, date):
        return datetime.combine(value, time.min, tzinfo=_zoneinfo(tz_name))

    raise TypeError("Calendar event start/end values must be datetime or date instances")


def _as_date(value: datetime | date) -> date:
    return value.date() if isinstance(value, datetime) else value


def _is_all_day_value(value: Any) -> bool:
    return isinstance(value, date) and not isinstance(value, datetime)


def _format_google_utc(value: datetime) -> str:
    return value.strftime("%Y%m%dT%H%M%SZ")


def _zoneinfo(tz_name: str) -> ZoneInfo:
    if tz_name in {"UTC", "GMT"}:
        return ZoneInfo("UTC")
    return ZoneInfo(tz_name)
