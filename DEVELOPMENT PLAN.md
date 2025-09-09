# 📄 DEVELOPMENT PLAN

```markdown
# Development Plan — GantText Editor (MVP)

## 1. Vision
A **browser-only text-first editor** for the GantText format.
Text is the single source of truth. A dynamic calendar header adapts column
widths so that tasks fit exactly between start and end days.

## 2. In-Scope (MVP)
- Text editor (textarea or CodeMirror).
- GantText parsing & validation.
- Calendar header with adaptive day widths.
- Scheduling:
  - If `(start:duration)` present → use explicit start.
  - Else → schedule after parent or project start.
- Dependencies by indentation.
- Drag interactions:
  1. Drag task horizontally → change start date.
  2. Resize task → change duration.
  3. Drag link to another task → create dependency (indent).
  4. Click task → focus text line.
- Layout: each task in its own row; vertical/horizontal scrolling.
- Styling: colors by assignee, `[ ]` vs `[x]` icons inside task text.
- Descriptions shown inline.

## 3. Out-of-Scope (MVP)
- Accounts, saving, sharing.
- Workdays/holidays calendar.
- Critical path analytics.
- Export/Import formats.

## 4. Architecture
- **Editor:** CodeMirror/Monaco with syntax highlighting.
- **Parser:** GantText → AST (tasks).
- **Scheduler:** computes start/end based on `(start:duration)` or dependencies.
- **Layout engine:** calculates adaptive day widths by measuring text spans.
- **Renderer:** overlays dynamic day header (grid lines + labels).
- **Sync engine:** visual edits update the underlying text.

## 5. Data Model (simplified)

```ts
type Task = {
  id: string;
  status: "open" | "done";
  title: string;
  duration: { value: number; unit: "d" | "h" };
  explicitStart?: string; // ISO date
  assignee?: { name: string; email: string };
  description: string[];
  children: Task[];
  start: Date;
  end: Date;
};