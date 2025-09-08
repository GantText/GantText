Development Plan (MVP)

1) Scope & Non-Goals

In-scope
	•	Text editor (single pane) + live Gantt preview (split view).
	•	GantText parsing, validation, and error hints.
	•	Scheduling:
	•	If task has (start:duration) → use given start.
	•	Else → auto-schedule from project start (user picks) following dependencies.
	•	Calendar model: calendar days, no working-hours logic.
	•	Interactions:
	1.	Drag task horizontally → change start date.
	2.	Resize left/right edges → change duration.
	3.	Create dependency by dragging from one task to another → add indentation in text.
	4.	Click task → focus corresponding text for inline edit.
	•	Layout: each task in its own row; horizontal/vertical scroll only (no zoom).
	•	Styling: color by assignee, status icon inside box, description shown in box.

Out-of-scope (MVP)
	•	Accounts, auth, cloud save, collaboration.
	•	Import/export, shareable links, printing/PDF.
	•	Business-day calendars/holidays.
	•	Critical path analytics.

2) Architecture (Front-end only)
	•	View: Split: left = textarea, right = timeline.
	•	Parser: GantText → AST (tasks with hierarchy, description).
	•	Scheduler: AST → scheduled tasks (start/end) using:
	•	Given (start:duration) if present.
	•	Else compute earliest start = max(end of parent chain, project start).
	•	Renderer: virtualized list for rows; SVG or Canvas for bars + arrows.
	•	Sync Engine: diff model ←→ text; apply visual edits by editing the text buffer.

Tech choices (lean)
	•	Vanilla TS or small React app (your call later).
	•	Monaco or simple \<textarea\> (MVP can start with \<textarea\>).
	•	SVG for timeline (fast iteration, crisp text, easy arrows).

3) Data Model (AST)

type Task = {
  id: string;                       // stable id derived from path+title
  level: number;                    // indent depth
  status: "open" | "done";
  title: string;
  duration: { value: number; unit: "d" | "h" };
  explicitStart?: string;           // ISO date if provided
  assignee?: { name: string; email: string };
  description: string[];            // lines
  children: Task[];
  // computed
  start: Date;
  end: Date;
  parentId?: string;
};

4) Scheduling Algorithm (calendar days)
	1.	Project start: user picks a date (default = today).
	2.	Topological walk by hierarchy:
	•	If explicitStart → start = that date.
	•	Else start = max(projectStart, parent.end).
	3.	End = start + duration (calendar-day add; hours supported by fractional days).
	4.	Sibling order doesn’t enforce sequencing (unless nested).

5) Timeline Rendering
	•	Rows: one task per row (AST pre-order traversal).
	•	Axis: days; dynamic tick density based on viewport width.
	•	Boxes: rounded rect; fill by assignee color; status icon left; title bold; description lines below (truncate to N lines with ellipsis).
	•	Arrows: from parent.end to child.start (curved SVG paths).
	•	If child has explicit earlier start, show in red and surface a warning.

6) User Interactions → Text Edits
	•	Drag move: recompute start date → update line to (YYYY-MM-DD:Xd) (if not explicit, inject start).
	•	Resize: recompute duration → update (…:Xh|Xd) or (Xh|Xd) accordingly.
	•	Create dependency: drag handle to target → increase child indent by one level beneath the target.
	•	Click task: scroll & focus corresponding line in text; select the task title segment.

Conflict handling
	•	If a visual change conflicts with indentation semantics, editor proposes:
	•	“Make this a child of X?” (adjust indent)
	•	or “Keep at current level and set explicit start?” (insert explicit start).

7) Validation & Hints
	•	Inline diagnostics (right panel or gutter):
	•	Invalid email format.
	•	Bad duration syntax.
	•	Mixed tabs/spaces (normalize to 4 spaces).
	•	Orphan indentation.
	•	Child starts before parent ends (highlight).
	•	Soft warnings; still render best-effort.

8) Styling & UX
	•	Assignee palette: hash(email) → HSL color.
	•	Status icon: checkbox or tick glyph inside box.
	•	Typography: system font; good contrast; ellipsis for overflow.
	•	Scrollbars: horizontal for time, vertical for tasks; sticky date header.

9) Testing
	•	Unit: parser, scheduler, text patcher.
	•	Integration: drag/resize/dependency creation round-trips to text.
	•	Snapshot: rendering of sample plans.
	•	Cross-browser: Chrome, Firefox, Safari (desktop).

10) Milestones & Estimates (dev-days)
	1.	M0 — Skeleton (1d)
	•	Split view layout; textarea + empty canvas/SVG.
	2.	M1 — Parser + AST (2d)
	•	GantText lexer/parser; errors surfaced.
	3.	M2 — Scheduler (1d)
	•	Project start picker; calendar-day math.
	4.	M3 — Renderer (3d)
	•	Rows, axis, boxes with title/description, status, colors.
	5.	M4 — Interactions (4d)
	•	Drag move, resize, create dependency (indent), click-to-focus text.
	•	Text patcher to keep source authoritative.
	6.	M5 — Validation & Hints (2d)
	•	Basic diagnostics + visual warnings.
	7.	M6 — Polish (1d)
	•	Perf (virtual rows), keyboard focus, small fixes.

Total MVP: ~14 dev-days (solo).
(Adjust for stack, editor component choice, and QA depth.)

11) Acceptance Criteria (MVP)
	•	Paste sample GantText → timeline appears within 100ms for ≤300 tasks.
	•	Change text → timeline updates live.
	•	Drag task → corresponding text updates (start:duration) correctly.
	•	Resize → duration updates in text.
	•	Create dependency → indent updated in text and arrows drawn.
	•	Each task in its own row; descriptions visible in box.
	•	Colors consistent per assignee; [ ] vs [x] icon visible.
	•	No data stored; reload clears state.

12) Risks & Mitigations
	•	Parsing robustness → strict EBNF; tolerant mode with hints.
	•	Text/visual drift → single source of truth (text); all visual edits patch text buffer.
	•	Performance on large plans → row virtualization, minimal DOM, SVG batching.

13) Nice-to-haves (Post-MVP)
	•	Shareable URL (compressed GantText in hash).
	•	Import/Export .ganttext & JSON.
	•	Critical path highlight.
	•	Group by assignee; swimlanes.
	•	Print/PDF.
	•	Dark mode; accessibility pass.
	•	Collapsible groups; task filtering.
