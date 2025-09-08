Project Description — GantText Editor (MVP)

Vision

A text-first, browser-only web editor for the GantText format that instantly lays out tasks on a classic Gantt timeline. The source of truth is the text; the timeline is a live visualization you can also manipulate. Visual edits sync back to text.

Core Principles
1.	Text is primary — free-form editing in a simple textarea.
2.	Instant visualization — tasks shown as boxes on a horizontal time axis (calendar days).
3. Indentation = dependency — child tasks wait for parent completion.
4. Bidirectional sync — drag/move/resize/create-dependency in the timeline updates the text.
5. Zero persistence — MVP doesn’t store; user pastes text, gets results.
6. Clarity over density — each task in its own row, descriptions visible in the box.
7. Status & identity — [ ] vs [x] icons; colors by assignee.

Supported GantText (MVP)
1. Status: [ ] or [x]
2. Title
3. Duration: (Xd|Xh) or (YYYY-MM-DD:Xd|Xh)
4. Assignee: Name Surname \<name.surname@example.com\> (optional)
5. Description: indented lines under a task
6. Dependencies: implied by indentation
7. Time: calendar days (7-day week), browser local time

Example

- [ ] Site preparation (2025-09-10:3d) Mario Vejlupek \<mario.vejlupek@example.com\>
    Clear the area behind the gate. Remove debris.

    - [ ] Level ground (2d) Pavel Horak \<pavel.horak@example.com\>
        Use mini-excavator to flatten surface.

- [x] Foundation (5d) Team Lead \<team.lead@example.com\>
    Build the base.

    - [ ] Pour concrete (2d)
    - [ ] Cure concrete (3d)
