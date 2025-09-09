import { useMemo } from 'react'
import CalendarHeader from './CalendarHeader'
import { eachDay, toISODate } from '../utils/date'
import Editor from './Editor'

export type TimelineProps = {
  start: Date
  end: Date
  width: number
  source: string
  onChange?: (value: string) => void
}

export default function Timeline({ start, end, width, source, onChange }: TimelineProps) {
  const days = useMemo(() => eachDay(start, end), [start, end])
  const dayWidth = width / Math.max(1, days.length)
  return (
    <div style={{ border: '1px solid #bbb', background: '#fff', color: '#222', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontSize: 13, lineHeight: 1.5 }}>
      <CalendarHeader start={start} end={end} containerWidth={width} />
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'grid', gridTemplateColumns: `repeat(${days.length}, ${dayWidth}px)` }}>
          {days.map((d, i) => (
            <div key={toISODate(d)} style={{ borderRight: i < days.length - 1 ? '1px solid #eee' : 'none' }} />
          ))}
        </div>
        <div style={{ padding: 12 }}>
          <Editor value={source} onChange={(v) => onChange?.(v)} />
        </div>
      </div>
    </div>
  )
}
