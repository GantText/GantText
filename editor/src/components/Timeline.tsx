import { useMemo, useRef, useLayoutEffect, useState } from 'react'
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
  const [dayWidth, setDayWidth] = useState<number>(width / Math.max(1, days.length))
  const hostRef = useRef<HTMLDivElement | null>(null)

  // Measure widest line segment to compute adaptive day width
  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return
    // Create a hidden canvas to measure text width
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.font = '13px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
    const lines = source.split(/\r?\n/)
    let maxChars = 0
    for (const line of lines) {
      maxChars = Math.max(maxChars, ctx.measureText(line.replace(/^\s+/, '')).width)
    }
    const minDay = Math.ceil((maxChars + 32) / Math.max(1, days.length))
    setDayWidth(Math.max(minDay, Math.floor(width / Math.max(1, days.length))))
  }, [source, days.length, width])
  return (
    <div ref={hostRef} style={{ border: '1px solid #bbb', background: '#fff', color: '#222', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontSize: 13, lineHeight: 1.5 }}>
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
