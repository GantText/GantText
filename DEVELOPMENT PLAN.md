Here’s your file converted so that all the bullet points are expressed as numbered lists (nested numbering preserved where it makes sense):

⸻

Development Plan (MVP)

1) Scope & Non-Goals

In-scope
	1.	Text editor (single pane) + live Gantt preview (split view).
	2.	GantText parsing, validation, and error hints.
	3.	Scheduling:
	1.	If task has (start:duration) → use given start.
	2.	Else → auto-schedule from project start (user picks) following dependencies.
	3.	Calendar model: calendar days, no working-hours logic.
	4.	Interactions:
	1.	Drag task horizontally → change start date.
	2.	Resize left/right edges → change duration.
	3.	Create dependency by dragging from one task to another → add indentation in text.
	4.	Click task → focus corresponding text for inline edit.
	5.	Layout: each task in its own row; horizontal/vertical scroll only (no zoom).
	6.	Styling: color by assignee, status icon inside box, description shown in box.

Out-of-scope (MVP)
	1.	Accounts, auth, cloud save, collaboration.
	2.	Import/export, shareable links, printing/PDF.
	3.	Business-day calendars/holidays.
	4.	Critical path analytics.

⸻

2) Architecture (Front-end only)
	1.	View: Split: left = textarea, right = timeline.
	2.	Parser: GantText → AST (tasks with hierarchy, description).
	3.	Scheduler: AST → scheduled tasks (start/end) using:
	1.	Given (start:duration) if present.
	2.	Else compute earliest start = max(end of parent chain, project start).
	4.	Renderer: virtualized list for rows; SVG or Canvas for bars + arrows.
	5.	Sync Engine: diff model ←→ text; apply visual edits by editing the text buffer.

Tech choices (lean)
	1.	Vanilla TS or small React app (your call later).
	2.	Monaco or simple `<textarea>` (MVP can start with `<textarea>`).
	3.	SVG for timeline (fast iteration, crisp text, easy arrows).

⸻

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


⸻

4) Scheduling Algorithm (calendar days)
	1.	Project start: user picks a date (default = today).
	2.	Topological walk by hierarchy:
	1.	If explicitStart → start = that date.
	2.	Else start = max(projectStart, parent.end).
	3.	End = start + duration (calendar-day add; hours supported by fractional days).
	4.	Sibling order doesn’t enforce sequencing (unless nested).

⸻

5) Timeline Rendering
	1.	Rows: one task per row (AST pre-order traversal).
	2.	Axis: days; dynamic tick density based on viewport width.
	3.	Boxes: rounded rect; fill by assignee color; status icon left; title bold; description lines below (truncate to N lines with ellipsis).
	4.	Arrows: from parent.end to child.start (curved SVG paths).
	5.	If child has explicit earlier start, show in red and surface a warning.

⸻

6) User Interactions → Text Edits
	1.	Drag move: recompute start date → update line to (YYYY-MM-DD:Xd) (if not explicit, inject start).
	2.	Resize: recompute duration → update (…:Xh|Xd) or (Xh|Xd) accordingly.
	3.	Create dependency: drag handle to target → increase child indent by one level beneath the target.
	4.	Click task: scroll & focus corresponding line in text; select the task title segment.

Conflict handling
	1.	If a visual change conflicts with indentation semantics, editor proposes:
	1.	“Make this a child of X?” (adjust indent)
	2.	or “Keep at current level and set explicit start?” (insert explicit start).

⸻

7) Validation & Hints
	1.	Inline diagnostics (right panel or gutter):
	1.	Invalid email format.
	2.	Bad duration syntax.
	3.	Mixed tabs/spaces (normalize to 4 spaces).
	4.	Orphan indentation.
	5.	Child starts before parent ends (highlight).
	2.	Soft warnings; still render best-effort.

⸻

8) Styling & UX
	1.	Assignee palette: hash(email) → HSL color.
	2.	Status icon: checkbox or tick glyph inside box.
	3.	Typography: system font; good contrast; ellipsis for overflow.
	4.	Scrollbars: horizontal for time, vertical for tasks; sticky date header.

⸻

9) Testing
	1.	Unit: parser, scheduler, text patcher.
	2.	Integration: drag/resize/dependency creation round-trips to text.
	3.	Snapshot: rendering of sample plans.
	4.	Cross-browser: Chrome, Firefox, Safari (desktop).

⸻

10) Milestones & Estimates (dev-days)
	1.	M0 — Skeleton (1d)
	1.	Split view layout; textarea + empty canvas/SVG.
	2.	M1 — Parser + AST (2d)
	1.	GantText lexer/parser; errors surfaced.
	3.	M2 — Scheduler (1d)
	1.	Project start picker; calendar-day math.
	4.	M3 — Renderer (3d)
	1.	Rows, axis, boxes with title/description, status, colors.
	5.	M4 — Interactions (4d)
	1.	Drag move, resize, create dependency (indent), click-to-focus text.
	2.	Text patcher to keep source authoritative.
	6.	M5 — Validation & Hints (2d)
	1.	Basic diagnostics + visual warnings.
	7.	M6 — Polish (1d)
	1.	Perf (virtual rows), keyboard focus, small fixes.

Total MVP: ~14 dev-days (solo).
(Adjust for stack, editor component choice, and QA depth.)

⸻

11) Acceptance Criteria (MVP)
	1.	Paste sample GantText → timeline appears within 100ms for ≤300 tasks.
	2.	Change text → timeline updates live.
	3.	Drag task → corresponding text updates (start:duration) correctly.
	4.	Resize → duration updates in text.
	5.	Create dependency → indent updated in text and arrows drawn.
	6.	Each task in its own row; descriptions visible in box.
	7.	Colors consistent per assignee; [ ] vs [x] icon visible.
	8.	No data stored; reload clears state.

⸻

12) Risks & Mitigations
	1.	Parsing robustness → strict EBNF; tolerant mode with hints.
	2.	Text/visual drift → single source of truth (text); all visual edits patch text buffer.
	3.	Performance on large plans → row virtualization, minimal DOM, SVG batching.

⸻

13) Nice-to-haves (Post-MVP)
	1.	Shareable URL (compressed GantText in hash).
	2.	Import/Export .ganttext & JSON.
	3.	Critical path highlight.
	4.	Group by assignee; swimlanes.
	5.	Print/PDF.
	6.	Dark mode; accessibility pass.
	7.	Collapsible groups; task filtering.

⸻

Do you want me to keep the nested numbering hierarchical (e.g., 1.1, 1.2, 1.2.1) instead of restarting at 1 under each section? That might make dependencies clearer.