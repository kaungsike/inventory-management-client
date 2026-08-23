/**
 * Shared CSV export utilities.
 *
 * All values are escaped per RFC 4180:
 *   - Values containing commas, double-quotes, or newlines are wrapped in
 *     double-quotes with internal quotes doubled ("").
 *   - Null / undefined values become an empty field.
 *
 * Date/time helpers produce unambiguous, comma-free strings so that the
 * resulting CSV row structure is never broken by locale formatting.
 */

// ── Value escaping ──────────────────────────────────────────────────────────

/** Escape a single value for safe inclusion in a CSV field (RFC 4180). */
export function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return ''

  const str = String(value)

  // If the string needs quoting (contains comma, quote, newline, or CR)
  if (/[",\r\n]/.test(str)) {
    // Double every existing quote then wrap the whole thing in quotes
    return '"' + str.replace(/"/g, '""') + '"'
  }

  return str
}

// ── Date / time helpers (comma-free, ISO-ish) ──────────────────────────────

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/** Format a date-only value for CSV: "2026-08-23". */
export function csvDate(date: string | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Format a date+time value for CSV: "2026-08-23 06:30". */
export function csvDateTime(date: string | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const h = d.getHours()
  const hh = pad(h % 12 || 12)
  const mm = pad(d.getMinutes())
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${hh}:${mm} ${ampm}`
}

/** Format a number for CSV without locale-specific separators. */
export function csvNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return ''
  return String(value)
}

// ── CSV row / download ──────────────────────────────────────────────────────

/** Build a single CSV row from an array of raw values. */
export function csvRow(values: unknown[]): string {
  return values.map(csvEscape).join(',')
}

/** Build a complete CSV string from headers and data rows. */
export function buildCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.join(','), ...rows.map(csvRow)]
  return lines.join('\n')
}

/** Trigger a browser download of a CSV file. */
export function downloadCsv(
  filename: string,
  headers: string[],
  rows: unknown[][],
): void {
  const csv = buildCsv(headers, rows)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
