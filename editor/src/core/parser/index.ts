export type ParseError = { line: number; message: string };
export type ParsedTask = {
  raw: string;
  line: number;
  indent: number;
  status: 'open' | 'done' | null;
  title: string;
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

    const isTask = Boolean(match[2] || checkbox);
    if (isTask && title.length === 0) {
      errors.push({ line: i + 1, message: 'Empty task title' });
    }
    if (isTask) {
      tasks.push({ raw, line: i + 1, indent, status, title });
    }
  }

  return { tasks, errors, source };
}

