# Calendar links DOCX parser

Utility for extracting calendar event candidates from Word `.docx` files without modifying the source document.

```python
from tools.calendar_links import parse_events_from_docx

events = parse_events_from_docx("agenda.docx")
```

The parser returns `CalendarEvent` objects with `title`, `description`, `start_datetime`, `end_datetime`, `timezone`, and `location` fields.

You can also run it from the command line:

```bash
python -m tools.calendar_links agenda.docx
```

Supported inputs include paragraph text such as:

- `12/05/2026 09:00 - 10:30 Reunión inicial`
- `12 de mayo de 2026, 09:00 a 10:30 - Taller`

It also supports tables with headers like `Fecha`, `Hora`, `Actividad`, and `Lugar`.
