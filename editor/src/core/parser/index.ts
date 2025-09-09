export type ParseError = { line: number; message: string };
export type ParsedTask = {
  raw: string;
  line: number;
  indent: number;
  status: 'open' | 'done' | null;
  title: string;
  explicitStart?: string; // ISO date
  durationDays?: number;
};

export function parseGantText(source: string): {
  tasks: ParsedTask[];
  errors: ParseError[];
  source: string;
} {
  const lines = source.split(/\r?\n/);
  const tasks: ParsedTask[] = [];
  const errors: ParseError[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const match = raw.match(/^(\s*)([-*]\s+)?(\[( |x)\])?\s*(.*)$/);
    if (!match) {
      continue;
    }
    const indent = match[1]?.length ?? 0;
    const checkbox = match[3];
    const status: 'open' | 'done' | null = checkbox
      ? checkbox.includes('x')
        ? 'done'
        : 'open'
      : null;
    const title = (match[5] ?? '').trim();
    // Extract (YYYY-MM-DD:Nd) or (Nd)
    const dateDur = title.match(/\((\d{4}-\d{2}-\d{2})?\s*:?\s*(\d+)d\)/);
    const explicitStart = dateDur && dateDur[1] ? dateDur[1] : undefined;
    const durationDays = dateDur ? parseInt(dateDur[2], 10) : undefined;

    const isTask = Boolean(match[2] || checkbox);
    if (isTask && title.length === 0) {
      errors.push({ line: i + 1, message: 'Empty task title' });
    }
    if (isTask) {
      tasks.push({ raw, line: i + 1, indent, status, title, explicitStart, durationDays });
    }
  }

  return { tasks, errors, source };
}

