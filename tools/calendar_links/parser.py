"""Extract calendar event candidates from .docx documents.

The parser is intentionally conservative: it reads the document with
``python-docx`` and returns structured event candidates without modifying or
rewriting the source document.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
import re
from typing import Iterable

from docx import Document
from docx.document import Document as DocxDocument
from docx.table import Table
from docx.text.paragraph import Paragraph


DEFAULT_TIMEZONE = "UTC"


@dataclass(frozen=True)
class CalendarEvent:
    """Internal representation for a calendar event found in a document."""

    title: str
    description: str
    start_datetime: datetime
    end_datetime: datetime
    timezone: str
    location: str


SPANISH_MONTHS = {
    "enero": 1,
    "febrero": 2,
    "marzo": 3,
    "abril": 4,
    "mayo": 5,
    "junio": 6,
    "julio": 7,
    "agosto": 8,
    "septiembre": 9,
    "setiembre": 9,
    "octubre": 10,
    "noviembre": 11,
    "diciembre": 12,
}

_NUMERIC_DATE = r"(?P<day>\d{1,2})/(?P<month>\d{1,2})/(?P<year>\d{4})"
_SPANISH_DATE = (
    r"(?P<day>\d{1,2})\s+de\s+"
    r"(?P<month_name>enero|febrero|marzo|abril|mayo|junio|julio|agosto|"
    r"septiembre|setiembre|octubre|noviembre|diciembre)\s+de\s+"
    r"(?P<year>\d{4})"
)
_TIME_RANGE = (
    r"(?P<start_hour>\d{1,2}):(?P<start_minute>\d{2})\s*"
    r"(?:-|–|—|a)\s*"
    r"(?P<end_hour>\d{1,2}):(?P<end_minute>\d{2})"
)
_TITLE_SEPARATOR = r"(?:\s*[-–—]\s*)?"

_TEXT_PATTERNS = (
    re.compile(
        rf"{_NUMERIC_DATE}\s*,?\s+{_TIME_RANGE}{_TITLE_SEPARATOR}(?P<title>.+)",
        re.IGNORECASE,
    ),
    re.compile(
        rf"{_SPANISH_DATE}\s*,?\s+{_TIME_RANGE}{_TITLE_SEPARATOR}(?P<title>.+)",
        re.IGNORECASE,
    ),
)

_HEADER_ALIASES = {
    "date": {"fecha", "día", "dia"},
    "time": {"hora", "horario", "horas"},
    "title": {"actividad", "título", "titulo", "evento", "sesión", "sesion"},
    "location": {
        "lugar",
        "ubicación",
        "ubicacion",
        "sala",
        "aula",
        "localización",
        "localizacion",
    },
    "description": {"descripción", "descripcion", "detalle", "detalles", "notas"},
}

_TIME_RANGE_PATTERN = re.compile(rf"^\s*{_TIME_RANGE}\s*$", re.IGNORECASE)
_NUMERIC_DATE_PATTERN = re.compile(rf"^\s*{_NUMERIC_DATE}\s*$", re.IGNORECASE)
_SPANISH_DATE_PATTERN = re.compile(rf"^\s*{_SPANISH_DATE}\s*$", re.IGNORECASE)


def parse_events_from_docx(path: str) -> list[CalendarEvent]:
    """Parse a .docx file and return calendar events found in text and tables.

    The document is opened read-only by ``python-docx``. Existing paragraphs,
    tables, runs, and formatting are not changed.
    """

    docx_path = Path(path)
    document = Document(str(docx_path))

    events: list[CalendarEvent] = []
    for block in _iter_block_items(document):
        if isinstance(block, Paragraph):
            events.extend(_parse_events_from_text(block.text))
        elif isinstance(block, Table):
            events.extend(_parse_events_from_table(block))

    return events


def _iter_block_items(document: DocxDocument) -> Iterable[Paragraph | Table]:
    """Yield top-level paragraphs and tables in document order."""

    for child in document.element.body.iterchildren():
        if child.tag.endswith("}p"):
            yield Paragraph(child, document)
        elif child.tag.endswith("}tbl"):
            yield Table(child, document)


def _parse_events_from_text(text: str) -> list[CalendarEvent]:
    stripped_text = " ".join(text.split())
    if not stripped_text:
        return []

    events: list[CalendarEvent] = []
    for pattern in _TEXT_PATTERNS:
        for match in pattern.finditer(stripped_text):
            events.append(_event_from_match(match, stripped_text))
    return events


def _parse_events_from_table(table: Table) -> list[CalendarEvent]:
    if not table.rows:
        return []

    headers = [_normalize_header(cell.text) for cell in table.rows[0].cells]
    column_map = _map_table_columns(headers)
    if not {"date", "time", "title"}.issubset(column_map):
        return []

    events: list[CalendarEvent] = []
    for row in table.rows[1:]:
        cells = [" ".join(cell.text.split()) for cell in row.cells]
        if not any(cells):
            continue

        date_text = _cell_value(cells, column_map["date"])
        time_text = _cell_value(cells, column_map["time"])
        title = _cell_value(cells, column_map["title"])
        if not date_text or not time_text or not title:
            continue

        date_parts = _parse_date(date_text)
        time_parts = _parse_time_range(time_text)
        if date_parts is None or time_parts is None:
            continue

        start_datetime, end_datetime = _combine_date_and_time(date_parts, time_parts)
        description = _cell_value(cells, column_map.get("description")) or title
        location = _cell_value(cells, column_map.get("location"))
        events.append(
            CalendarEvent(
                title=title,
                description=description,
                start_datetime=start_datetime,
                end_datetime=end_datetime,
                timezone=DEFAULT_TIMEZONE,
                location=location,
            )
        )

    return events


def _event_from_match(match: re.Match[str], source_text: str) -> CalendarEvent:
    date_parts = _date_parts_from_match(match)
    time_parts = _time_parts_from_match(match)
    start_datetime, end_datetime = _combine_date_and_time(date_parts, time_parts)
    title = match.group("title").strip(" -–—")

    return CalendarEvent(
        title=title,
        description=source_text,
        start_datetime=start_datetime,
        end_datetime=end_datetime,
        timezone=DEFAULT_TIMEZONE,
        location="",
    )


def _date_parts_from_match(match: re.Match[str]) -> tuple[int, int, int]:
    day = int(match.group("day"))
    year = int(match.group("year"))
    month_name = match.groupdict().get("month_name")
    if month_name:
        month = SPANISH_MONTHS[month_name.lower()]
    else:
        month = int(match.group("month"))
    return year, month, day


def _time_parts_from_match(match: re.Match[str]) -> tuple[int, int, int, int]:
    return (
        int(match.group("start_hour")),
        int(match.group("start_minute")),
        int(match.group("end_hour")),
        int(match.group("end_minute")),
    )


def _combine_date_and_time(
    date_parts: tuple[int, int, int],
    time_parts: tuple[int, int, int, int],
) -> tuple[datetime, datetime]:
    year, month, day = date_parts
    start_hour, start_minute, end_hour, end_minute = time_parts
    start_datetime = datetime(year, month, day, start_hour, start_minute)
    end_datetime = datetime(year, month, day, end_hour, end_minute)
    if end_datetime <= start_datetime:
        end_datetime += timedelta(days=1)
    return start_datetime, end_datetime


def _parse_date(text: str) -> tuple[int, int, int] | None:
    for pattern in (_NUMERIC_DATE_PATTERN, _SPANISH_DATE_PATTERN):
        match = pattern.match(text)
        if match:
            return _date_parts_from_match(match)
    return None


def _parse_time_range(text: str) -> tuple[int, int, int, int] | None:
    match = _TIME_RANGE_PATTERN.match(text)
    if not match:
        return None
    return _time_parts_from_match(match)


def _map_table_columns(headers: list[str]) -> dict[str, int]:
    column_map: dict[str, int] = {}
    for index, header in enumerate(headers):
        for field, aliases in _HEADER_ALIASES.items():
            if header in aliases and field not in column_map:
                column_map[field] = index
    return column_map


def _normalize_header(text: str) -> str:
    return " ".join(text.lower().strip().split())


def _cell_value(cells: list[str], index: int | None) -> str:
    if index is None or index >= len(cells):
        return ""
    return cells[index].strip()
