# GantText Editor

**GantText Editor** is a text-first, adaptive Gantt-like timeline editor.

The editor is a **free text area** (Markdown-like) where users write tasks in the
[GantText format](./GANTTEXT_SPEC.md). Above the editor, a **dynamic calendar header**
(days) is rendered. The width of each day **adapts automatically** so that all tasks
fit precisely between their start and end dates without cutting or wrapping text.

## ✨ Core Ideas
- **Text is primary** → users freely type and edit GantText tasks.
- **Adaptive days** → calendar columns stretch so tasks never overflow.
- **Dependencies by indentation** → child tasks depend on parent completion.
- **Status & assignee visible** → `[ ]` vs `[x]` checkboxes, assignee names & emails.
- **No accounts, no persistence (MVP)** → paste text, see timeline, interact.

## Example

```markdown
- [ ] Analysis (2025-09-10:2d) Alice <alice@example.com>
    Stakeholder interviews.

    - [ ] Design (3d) Bob <bob@example.com>
        Wireframes and flow.

- [x] Implementation (5d) Charlie <charlie@example.com>
    First vertical slice.