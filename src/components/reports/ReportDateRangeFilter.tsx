import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { REPORT_PRESETS, reportPresetRange, type ReportPreset } from '@/lib/utils'

interface ReportDateRangeFilterProps {
  dateFrom: string
  dateTo: string
  onChange: (dateFrom: string, dateTo: string) => void
}

export function ReportDateRangeFilter({ dateFrom, dateTo, onChange }: ReportDateRangeFilterProps) {
  const [preset, setPreset] = useState<ReportPreset>('custom')

  useEffect(() => {
    if (preset === 'custom') {
      onChange(dateFrom, dateTo)
    } else {
      const { dateFrom: from, dateTo: to } = reportPresetRange(preset)
      onChange(from, to)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset])

  const applyPreset = (value: ReportPreset) => {
    setPreset(value)
    if (value !== 'custom') {
      const { dateFrom: from, dateTo: to } = reportPresetRange(value)
      onChange(from, to)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={preset} onValueChange={(v) => applyPreset((v ?? 'custom') as ReportPreset)}>
        <SelectTrigger className="w-40 h-8">
          <SelectValue placeholder="Custom Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="custom">Custom Range</SelectItem>
          {REPORT_PRESETS.map((p) => (
            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="date"
        value={dateFrom}
        onChange={(e) => { setPreset('custom'); onChange(e.target.value, dateTo) }}
        className="w-36 h-8"
      />
      <span className="text-muted-foreground text-sm">to</span>
      <Input
        type="date"
        value={dateTo}
        onChange={(e) => { setPreset('custom'); onChange(dateFrom, e.target.value) }}
        className="w-36 h-8"
      />
    </div>
  )
}