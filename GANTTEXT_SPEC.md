GantText Specification

A compact, human‑readable task format designed for text‑first planning with timeline semantics. GantText encodes status, title, duration, optional explicit start date, optional assignee, optional multi‑line description, and dependencies by indentation.

⸻

1. Design Goals
	•	Readable first: Markdown‑like lists that are pleasant to write and review.
	•	Single source of truth: Text is authoritative; visualizations are derived.
	•	Deterministic: Strict but ergonomic grammar (4‑space indents, ISO dates).
	•	Easy to parse: Well‑defined tokens; machine‑friendly.

⸻

2. File & Encoding
	•	Extension: .ganttext (or .md if embedded in Markdown).
	•	Encoding: UTF‑8.
	•	Line endings: \n or \r\n.

⸻

3. Line Types
	•	Task line — starts with - [ ] or - [x] followed by title, duration, optional assignee.
	•	Description line — any indented (by +4 spaces) non‑task line that follows a task; belongs to the nearest task above at one less indent level.
	•	Blank line — ignored (preserves readability).

⸻

4. Indentation & Dependencies
	•	Exactly 4 spaces per level. Tabs are disallowed; tools SHOULD normalize tabs to 4 spaces before parsing.
	•	Hierarchy → dependency: A task at level N+1 depends on the nearest task at level N above it (its parent). Rendering tools MUST not start a child before its parent ends unless the child has an explicit start that is later; otherwise surface a diagnostic.
	•	Root tasks (no indent) are independent and may run in parallel.

⸻

5. Task Line Syntax

- [ ] Title (Duration | Start:Duration) Name Surname <name.surname@example.com>

5.1 Status
	•	[ ] → open
	•	[x] → done (lowercase x only)

5.2 Title
	•	Free text up to the first ( that begins Duration or Start:Duration.
	•	MAY contain punctuation, Unicode letters, numbers, and spaces.

5.3 Duration / Start:Duration
	•	Duration: (Xd) or (Xh)
Examples: (3d), (6h)
	•	Start:Duration: (YYYY-MM-DD:Xd) or (YYYY-MM-DD:Xh)
Examples: (2025-09-10:2d), (2025-09-12:6h)
	•	Units:
	•	d = calendar days (24h blocks),
	•	h = hours (MVP renders as fractional days).
	•	Whitespace inside the parentheses is not allowed.

5.4 Assignee (optional)
	•	Format: Name Surname <name.surname@example.com>
	•	Name and Surname accept letters (incl. diacritics), apostrophes ', hyphens -, and dots . (for middle initials).
	•	Email MUST be syntactically valid (local@domain with domain labels a‑z0‑9-).

5.5 Examples

- [ ] Site preparation (2d)
- [ ] Analysis (2025-09-10:2d) Alice Vejlupek <alice@example.com>
- [x] Implementation (5d) Team Lead <lead@example.org>


⸻

6. Description Lines
	•	One or more lines indented by +4 spaces under a task.
	•	Attach to the nearest task above at one less indent level.
	•	Free text; tools SHOULD preserve order and content.

Example

- [ ] Analysis (2d) Alice <alice@example.com>
    Stakeholder interviews.
    Summarize key pain points.


⸻

7. Scheduling Semantics
	•	Project start is provided by the tool/user.
	•	If a task has (Start:Duration), use that explicit start.
	•	Else, the task starts at the maximum of:
	•	project start, and
	•	the end of its parent (computed via indentation).
	•	End time = start + duration (calendar days / hours). Hours MAY be rendered as fractional days.
	•	Root tasks without explicit start begin no earlier than project start; sibling order alone does not imply dependency.

⸻

8. Formal Grammar (EBNF)

Document        = { BlankLine | TaskBlock } ;

TaskBlock       = TaskLine, DescriptionBlock?, SubtaskBlock? ;

TaskLine        = Indent, "- [", Status, "]", SP, Title, SP, TimeSpec, AssigneeOpt, EOL ;
Status          = " " | "x" ;

Title           = TitleChar, { TitleChar } ;
TitleChar       = ? any char except EOL and "(" when it opens TimeSpec ? ;

TimeSpec        = "(", ( Date ":" )?, Number, Unit, ")" ;
Date            = Digit Digit Digit Digit, "-", Digit Digit, "-", Digit Digit ;
Unit            = "d" | "h" ;
Number          = Digit, { Digit } ;

AssigneeOpt     = [ SP, Person ] ;
Person          = Name, SP, Surname, SP, "<", Email, ">" ;
Name            = NameChar, { NameChar } ;
Surname         = NameChar, { NameChar } ;
NameChar        = Letter | "'" | "-" | "." ;

Email           = LocalPart, "@", Domain ;
LocalPart       = LocalChar, { LocalChar | "." | "_" | "-" | "+" } ;
LocalChar       = Letter | Digit ;
Domain          = Label, { ".", Label } ;
Label           = LetterOrDigit, { LetterOrDigit | "-" }, [ LetterOrDigit ] ;

DescriptionBlock= { DescLine } ;
DescLine        = Indent, SP4, DescText, EOL ;
DescText        = DescChar, { DescChar } ;
DescChar        = ? any char except EOL ? ;

SubtaskBlock    = { Subtask } ;
Subtask         = (Indent, SP4), TaskBlock ;

Indent          = { SP4 } ;            (* multiple of 4 spaces *)
SP4             = " ", " ", " ", " " ;
SP              = " " ;
EOL             = "\n" | "\r\n" ;
BlankLine       = { SP }, EOL ;

Letter          = "A"…"Z" | "a"…"z" | LatinExtended ;
Digit           = "0"…"9" ;
LetterOrDigit   = Letter | Digit ;
LatinExtended   = ? Unicode letters beyond ASCII (Č, Ř, Á, etc.) ? ;


⸻

9. Validation Rules
	•	Indentation: Only multiples of 4 spaces. Tabs → error or auto‑normalize.
	•	Status: Only [ ] or [x].
	•	Duration: Positive integer followed by d or h.
	•	Date: ISO YYYY-MM-DD.
	•	Assignee: Entire Name Surname <email> is treated as one token; missing parts → diagnostic.
	•	Description attachment: A description line must be exactly one level deeper than its owning task.
	•	Dangling child: If a task appears at level N without a parent at N-1, surface a diagnostic.

Tools MAY:
	•	Tolerate extra blank lines.
	•	Preserve unknown lines as descriptions if indented appropriately.

⸻

10. Examples

Simple

- [ ] Prepare site (2d)
- [x] Foundation (5d) Team <team@example.com>

Hierarchy + explicit start + descriptions

- [ ] Analysis (2025-09-10:2d) Alice <alice@example.com>
    Stakeholder interviews.

    - [ ] Design (3d) Bob <bob@example.com>
        Wireframes and flow.

- [ ] Implementation (5d) Charlie <charlie@example.com>
    First vertical slice.

Hours

- [ ] QA Review (2025-09-12:6h) QA Lead <qa@example.com>
    Critical paths only.


⸻

11. JSON Projection (suggested)

Parsing GantText yields a tree. Suggested shape:

{
  "tasks": [
    {
      "id": "analysis",
      "level": 0,
      "status": "open",
      "title": "Analysis",
      "duration": { "value": 2, "unit": "d" },
      "explicitStart": "2025-09-10",
      "assignee": { "name": "Alice", "surname": "", "email": "alice@example.com" },
      "description": ["Stakeholder interviews."],
      "children": [
        {
          "id": "design",
          "level": 1,
          "status": "open",
          "title": "Design",
          "duration": { "value": 3, "unit": "d" },
          "description": ["Wireframes and flow."]
        }
      ]
    }
  ]
}

IDs MAY be derived from path + normalized title; ensure stability across edits.

⸻

12. Scheduling Notes (renderers)
	•	Treat days as calendar days; hours as h/24 of a day for positioning.
	•	When explicit start conflicts with parent end, render but flag a warning.
	•	Child tasks inherit earliest possible start from their parent chain if no explicit start.

⸻

13. Compatibility & Versioning
	•	This is v2 (assignee format fixed to Name Surname <email> and 4‑space indents).
	•	Future extensions SHOULD use backward‑compatible additions (e.g., tags #tag, priority !P2) after assignee and before EOL.

⸻

14. Common Pitfalls & Recommendations
	•	Tabs in editors: Configure the editor to insert spaces for Tab.
	•	Ligatures/metrics: Monospace fonts without ligatures yield more stable measurements.
	•	Trailing spaces: Ignored; tools MAY trim.
	•	Very long lines: Renderers SHOULD clip visually at day boundaries without altering the text.

