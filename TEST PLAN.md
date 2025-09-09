# 📄 TEST PLAN.md


# Test Plan — GantText Editor (MVP)

## 1. Strategy
- **Unit tests:** parser, scheduler, text patcher, width calculator.
- **Integration:** text → AST → layout → adaptive header → render.
- **E2E:** paste text, see correct ruler alignment, drag/resize, dependency creation.
- **Non-functional:** performance budgets, accessibility, visual snapshots.

## 2. Fixtures
### Valid

- [ ] Analysis (2025-09-10:2d) Alice <alice@example.com>
    Stakeholder interviews.
    - [ ] Design (3d) Bob <bob@example.com>