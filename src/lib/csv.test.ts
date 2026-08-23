import { describe, expect, it } from 'vitest'
import { csvEscape, csvDate, csvDateTime, csvNumber, csvRow, buildCsv } from './csv'

describe('csvEscape', () => {
  it('returns plain strings unchanged', () => {
    expect(csvEscape('hello')).toBe('hello')
  })

  it('returns empty string for null/undefined', () => {
    expect(csvEscape(null)).toBe('')
    expect(csvEscape(undefined)).toBe('')
  })

  it('converts numbers to strings', () => {
    expect(csvEscape(42)).toBe('42')
    expect(csvEscape(-3.14)).toBe('-3.14')
  })

  it('quotes values containing commas', () => {
    expect(csvEscape('Product, Large')).toBe('"Product, Large"')
  })

  it('doubles existing quotes and wraps', () => {
    expect(csvEscape('He said "hello"')).toBe('"He said ""hello"""')
  })

  it('quotes values containing newlines', () => {
    expect(csvEscape('line1\nline2')).toBe('"line1\nline2"')
  })

  it('quotes values containing carriage returns', () => {
    expect(csvEscape('line1\rline2')).toBe('"line1\rline2"')
  })

  it('handles empty string', () => {
    expect(csvEscape('')).toBe('')
  })
})

describe('csvDate', () => {
  it('formats ISO date string', () => {
    expect(csvDate('2026-08-23')).toBe('2026-08-23')
  })

  it('returns empty for null/undefined', () => {
    expect(csvDate(null)).toBe('')
    expect(csvDate(undefined)).toBe('')
  })

  it('returns empty for invalid date', () => {
    expect(csvDate('not-a-date')).toBe('')
  })

  it('never contains commas', () => {
    expect(csvDate('2026-01-15')).not.toContain(',')
  })
})

describe('csvDateTime', () => {
  it('formats datetime without commas', () => {
    const result = csvDateTime('2026-08-23T06:30:00')
    expect(result).not.toContain(',')
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2} (AM|PM)$/)
  })

  it('returns empty for null/undefined', () => {
    expect(csvDateTime(null)).toBe('')
    expect(csvDateTime(undefined)).toBe('')
  })

  it('handles midnight', () => {
    expect(csvDateTime('2026-08-23T00:00:00')).toContain('12:00 AM')
  })

  it('handles noon', () => {
    expect(csvDateTime('2026-08-23T12:00:00')).toContain('12:00 PM')
  })
})

describe('csvNumber', () => {
  it('returns number as string', () => {
    expect(csvNumber(42)).toBe('42')
    expect(csvNumber(3.14)).toBe('3.14')
  })

  it('returns empty for null/undefined/NaN', () => {
    expect(csvNumber(null)).toBe('')
    expect(csvNumber(undefined)).toBe('')
    expect(csvNumber(NaN)).toBe('')
  })

  it('handles zero', () => {
    expect(csvNumber(0)).toBe('0')
  })
})

describe('csvRow', () => {
  it('joins escaped values with commas', () => {
    expect(csvRow(['a', 'b', 'c'])).toBe('a,b,c')
  })

  it('quotes values that contain commas', () => {
    expect(csvRow(['hello, world', 'plain'])).toBe('"hello, world",plain')
  })

  it('handles null values as empty fields', () => {
    expect(csvRow(['a', null, 'c'])).toBe('a,,c')
  })
})

describe('buildCsv', () => {
  it('produces header + data rows', () => {
    const csv = buildCsv(['Name', 'Age'], [
      ['Alice', 30],
      ['Bob', 25],
    ])
    const lines = csv.split('\n')
    expect(lines[0]).toBe('Name,Age')
    expect(lines[1]).toBe('Alice,30')
    expect(lines[2]).toBe('Bob,25')
  })

  it('every row has same column count as header', () => {
    const headers = ['Date', 'Reference', 'Product', 'SKU', 'Warehouse', 'Type', 'Quantity', 'Unit Cost', 'Notes']
    const rows = [
      ['2026-08-23 06:30 AM', 'SO-2026-000025', 'Apple', 'APL001', 'Main Warehouse', 'Sale', '10', '55', ''],
      ['2026-08-23 07:00 AM', 'PO-2026-000010', 'Product, Large', 'PRD002', 'Warehouse 2', 'Purchase', '20', '30.5', 'Note with "quotes"'],
      ['2026-08-24 09:15 AM', 'TR-2026-000005', 'Myanmar product', 'MMR001', '', 'Transfer', '-5', '100', ''],
    ]
    // const csv = buildCsv(headers, rows)
    const headerColCount = headers.length
    expect(headerColCount).toBe(9)

    rows.forEach((row) => {
      const rowStr = csvRow(row)
      let fieldCount = 0
      let inQuotes = false
      for (let i = 0; i < rowStr.length; i++) {
        if (rowStr[i] === '"') {
          inQuotes = !inQuotes
        } else if (rowStr[i] === ',' && !inQuotes) {
          fieldCount++
        }
      }
      fieldCount++
      expect(fieldCount).toBe(headerColCount)
    })
  })

  it('handles Myanmar text', () => {
    const csv = buildCsv(['Name', 'Notes'], [
      ['Product A', 'This is Myanmar text'],
    ])
    expect(csv).toContain('Product A')
    expect(csv).toContain('This is Myanmar text')
  })

  it('handles notes with commas and quotes', () => {
    const csv = buildCsv(['Notes'], [
      ['Has, comma'],
    ])
    expect(csv).toBe('Notes\n"Has, comma"')
  })

  it('handles empty rows', () => {
    const csv = buildCsv(['A', 'B'], [])
    const lines = csv.split('\n')
    expect(lines.length).toBe(1)
    expect(lines[0]).toBe('A,B')
  })
})

describe('Transactions export regression', () => {
  it('every row has exactly 9 columns matching the header', () => {
    const headers = ['Date', 'Reference', 'Product', 'SKU', 'Warehouse', 'Type', 'Quantity', 'Unit Cost', 'Notes']
    const rows = [
      ['2026-08-23 06:30 AM', 'SO-2026-000025', 'Apple, Large', 'APL001', 'Main Warehouse', 'Sale', '10', '55', ''],
      ['2026-08-23 07:00 AM', 'PO-2026-000010', 'Banana', 'BNN001', 'Warehouse B', 'Purchase', '20', '30.50', 'Note with "quotes"'],
      ['2026-08-24 09:15 AM', 'TR-2026-000005', 'Cherry', 'CHR001', '', 'Transfer', '-5', '100', 'Line1\nLine2'],
      ['2026-08-25 14:00 PM', 'ADJ-2026-000003', 'Date, with comma', 'DWC001', 'Warehouse A', 'Adjustment', '0', '0', ''],
    ]

    // const csv = buildCsv(headers, rows)

    // Header has 9 columns
    const headerCols = headers.length
    expect(headerCols).toBe(9)

    // Each row should produce exactly 9 fields when properly parsed
    rows.forEach((row) => {
      const rowStr = csvRow(row)
      // Count fields by tracking quoted sections
      let fieldCount = 0
      let inQuotes = false
      for (let i = 0; i < rowStr.length; i++) {
        if (rowStr[i] === '"') {
          inQuotes = !inQuotes
        } else if (rowStr[i] === ',' && !inQuotes) {
          fieldCount++
        }
      }
      fieldCount++ // last field
      expect(fieldCount).toBe(headerCols)
    })
  })

  it('does not break when values contain commas', () => {
    const headers = ['Date', 'Product', 'Notes']
    const rows = [
      ['2026-08-23', 'Product, Large', ''],
    ]
    const csv = buildCsv(headers, rows)
    const lines = csv.split('\n')
    expect(lines[0]).toBe('Date,Product,Notes')
    expect(lines[1]).toBe('2026-08-23,"Product, Large",')
  })

  it('does not break when values contain quotes', () => {
    const headers = ['Product', 'Notes']
    const rows = [
      ['Apple', 'He said "hello"'],
    ]
    const csv = buildCsv(headers, rows)
    expect(csv).toContain('"He said ""hello"""')
  })

  it('does not break when values contain newlines', () => {
    const headers = ['Product', 'Notes']
    const rows = [
      ['Apple', 'Line 1\nLine 2'],
    ]
    const csv = buildCsv(headers, rows)
    expect(csv).toContain('"Line 1\nLine 2"')
  })

  it('handles empty notes as trailing empty field', () => {
    const headers = ['Date', 'Reference', 'Product', 'SKU', 'Warehouse', 'Type', 'Quantity', 'Unit Cost', 'Notes']
    const row = ['2026-08-23', 'SO-1', 'Apple', 'APL001', 'Main', 'Sale', '10', '55', '']
    const csv = buildCsv(headers, [row])
    // Must end with comma+newline or just the empty field
    expect(csv).toMatch(/,$/)
  })

  it('handles decimal unit costs', () => {
    const headers = ['Product', 'Unit Cost']
    const rows = [
      ['Apple', '55.99'],
      ['Banana', '30.123'],
    ]
    const csv = buildCsv(headers, rows)
    expect(csv).toContain('55.99')
    expect(csv).toContain('30.123')
  })

  it('handles negative quantities', () => {
    const headers = ['Product', 'Quantity']
    const rows = [
      ['Apple', '-10'],
    ]
    const csv = buildCsv(headers, rows)
    expect(csv).toContain('-10')
  })

  it('handles large quantities', () => {
    const headers = ['Product', 'Quantity']
    const rows = [
      ['Apple', '1000000'],
    ]
    const csv = buildCsv(headers, rows)
    expect(csv).toContain('1000000')
    // No thousands separators in raw numbers
    expect(csv).not.toContain('1,000,000')
  })
})
