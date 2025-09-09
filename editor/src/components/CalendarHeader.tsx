import { useMemo } from 'react'
import { eachDay, toISODate, formatDayLabel } from '../utils/date'

export type CalendarHeaderProps = {
  start: Date
  end: Date
  containerWidth: number
}

export default function CalendarHeader({ start, end, containerWidth }: CalendarHeaderProps) {
  const days = useMemo(() => eachDay(start, end), [start, end])
  const dayWidth = containerWidth / Math.max(1, days.length)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${days.length}, ${dayWidth}px)`, background: '#c8c8c8', borderBottom: '2px solid #999' }}>
      {days.map((d, i) => (
        <div key={toISODate(d)} style={{ textAlign: 'center', padding: '6px 0', borderRight: i < days.length - 1 ? '1px solid #9b9b9b' : 'none', fontSize: 12, fontWeight: 700 }}>
          {formatDayLabel(d)}
        </div>
      ))}
    </div>
  )
}
