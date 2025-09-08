Project Description — GantText Editor (MVP)

Vision

A text-first, browser-only web editor for the GantText format that instantly lays out tasks on a classic Gantt timeline. The source of truth is the text; the timeline is a live visualization you can also manipulate. Visual edits sync back to text.

Core Principles
	•	Text is primary — free-form editing in a simple textarea.
	•	Instant visualization — tasks shown as boxes on a horizontal time axis (calendar days).
	•	Indentation = dependency — child tasks wait for parent completion.
	•	Bidirectional sync — drag/move/resize/create-dependency in the timeline updates the text.
	•	Zero persistence — MVP doesn’t store; user pastes text, gets results.
	•	Clarity over density — each task in its own row, descriptions visible in the box.
	•	Status & identity — [ ] vs [x] icons; colors by assignee.

Supported GantText (MVP)
	•	Status: [ ] or [x]
	•	Title
	•	Duration: (Xd|Xh) or (YYYY-MM-DD:Xd|Xh)
	•	Assignee: Name Surname <name.surname@example.com> (optional)
	•	Description: indented lines under a task
	•	Dependencies: implied by indentation
	•	Time: calendar days (7-day week), browser local time

Example

- [ ] Site preparation (2025-09-10:3d) Mario Vejlupek <mario.vejlupek@example.com>
    Clear the area behind the gate. Remove debris.

    - [ ] Level ground (2d) Pavel Horak <pavel.horak@example.com>
        Use mini-excavator to flatten surface.

- [x] Foundation (5d) Team Lead <team.lead@example.com>
    Build the base.

    - [ ] Pour concrete (2d)
    - [ ] Cure concrete (3d)
