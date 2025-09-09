export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function addDays(d: Date, days: number): Date {
  const nd = new Date(d)
  nd.setDate(nd.getDate() + days)
  return nd
}

export function eachDay(start: Date, end: Date): Date[] {
  const days: Date[] = []
  const cur = new Date(start)
  while (cur <= end) {
    days.push(new Date(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

export function formatDayLabel(d: Date): string {
  const day = d.getDate()
  const month = d.getMonth() + 1
  return `${day}. ${month}.`
}
