# 📄 DEVELOPMENT PLAN

```markdown
# Development Plan — GantText Editor (MVP)

## 1. Vision
A **browser-only text-first editor** for the GantText format.
Text is the single source of truth. A dynamic calendar header adapts column
widths so that tasks fit exactly between start and end days.

## 2. Technology Stack
1. **Frontend**: React + TypeScript
2. **Editor**: CodeMirror 6 (modern, extensible)
3. **Build Tool**: Vite (fast development, modern bundling)
4. **Styling**: CSS-in-JS or Tailwind CSS
5. **Testing**: Vitest + Testing Library
6. **Package Manager**: npm or pnpm

## 3. Development Phases

### Phase 1: Foundation
Status: ✅ Completed
1. ✅ Set up project structure with Vite + React + TypeScript
2. ✅ Implement basic GantText parser (text → AST) (initial)
3. ✅ Create simple text editor with CodeMirror
4. ✅ Basic task data model implementation (initial)
5. ✅ **Deliverable**: Working text editor that parses GantText

### Phase 2: Core Rendering
Status: In progress
1. ✅ Build calendar header component
2. ✅ Implement adaptive width calculation algorithm
3. ✅ Create unified text-first timeline view (header + text rows)
4. Basic layout engine for task positioning
5. **Deliverable**: Static visual representation of tasks

### Phase 3: Scheduling Logic
Status: Not started
1. Implement dependency-based scheduling
2. Handle explicit start dates vs. calculated dates
3. Build scheduler that computes start/end dates
4. Add validation for scheduling conflicts
5. **Deliverable**: Accurate task scheduling and positioning

### Phase 4: Interactive Features
Status: Not started
1. Drag and drop for date changes
2. Resize handles for duration changes
3. Click-to-focus text editing
4. Dependency creation via drag links
5. **Deliverable**: Full interactive editing experience

### Phase 5: Polish & Testing
Status: Not started
1. Visual styling and colors by assignee
2. Performance optimization
3. Comprehensive testing (unit + integration + E2E)
4. Accessibility improvements
5. **Deliverable**: Production-ready MVP

## 4. In-Scope (MVP)
1. ✅ Text editor (CodeMirror 6 with syntax highlighting)
2. GantText parsing & validation
3. Calendar header with adaptive day widths
4. Scheduling:
  1. If `(start:duration)` present → use explicit start
  2. Else → schedule after parent or project start
5. Dependencies by indentation
6. Drag interactions:
  1. Drag task horizontally → change start date
  2. Resize task → change duration
  3. Drag link to another task → create dependency (indent)
  4. Click task → focus text line
7. Layout: each task in its own row; vertical/horizontal scrolling
8. Styling: colors by assignee, `[ ]` vs `[x]` icons inside task text
9. Descriptions shown inline

## 5. Out-of-Scope (MVP)
1. Accounts, saving, sharing
2. Workdays/holidays calendar
3. Critical path analytics
4. Export/Import formats
5. Mobile optimization (desktop-first)

## 6. Architecture

### Component Structure

```
src/
├── components/
│   ├── Editor/           # CodeMirror wrapper
│   ├── CalendarHeader/   # Adaptive day columns
│   ├── TaskRow/         # Individual task rendering
│   └── Layout/          # Main layout container
├── core/
│   ├── parser/          # GantText → AST
│   ├── scheduler/       # Date calculations
│   ├── layout/          # Width calculations
│   └── sync/            # Text ↔ Visual sync
├── types/               # TypeScript definitions
└── utils/               # Helper functions
```

### Core Systems
1. ✅ **Editor**: CodeMirror 6 with GantText syntax highlighting
2. **Parser**: GantText → AST (tasks) with validation
3. **Scheduler**: Computes start/end based on `(start:duration)` or dependencies
4. **Layout Engine**: Calculates adaptive day widths by measuring text spans
5. **Renderer**: Overlays dynamic day header (grid lines + labels)
6. **Sync Engine**: Bidirectional visual edits ↔ text updates

## 7. Data Model

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
  lineNumber: number; // For text sync
};

type Project = {
  tasks: Task[];
  startDate: Date;
  endDate: Date;
};
```

## 8. Key Algorithms

### Adaptive Width Calculator
1. Measure text spans for each task
2. Calculate minimum day widths to prevent overflow
3. Distribute extra space proportionally
4. Handle edge cases (very short/long tasks)

### Scheduler
1. Topological sort for dependency resolution
2. Handle explicit start dates with validation
3. Calculate end dates based on duration
4. Detect and resolve scheduling conflicts

### Layout Engine
1. Position tasks based on calculated dates and widths
2. Handle overlapping tasks and dependencies
3. Optimize for performance with large datasets

### Sync Engine
1. Bidirectional text ↔ visual editing
2. Debounced parsing for performance
3. Conflict resolution for simultaneous edits

## 9. Development Best Practices

### Start Simple, Iterate
1. Begin with static rendering of parsed tasks
2. Add interactivity incrementally
3. Focus on core text-editing experience first
4. Build adaptive calendar as separate concern

### Testing Strategy
1. **Unit Tests**: Parser, scheduler, width calculator
2. **Integration Tests**: Text → AST → Layout → Render pipeline
3. **E2E Tests**: Full user workflows (paste text, drag, resize)
4. **Visual Regression**: Screenshot testing for layout accuracy

### Performance Considerations
1. Virtual scrolling for large task lists
2. Debounced text parsing
3. Efficient width recalculation
4. Memoized component rendering
5. Lazy loading for complex calculations

## 10. Risk Mitigation

### Technical Risks
1. **Complex Layout**: Start with fixed-width days, then add adaptation
2. **Performance**: Implement virtualization early for large datasets
3. **Browser Compatibility**: Test across Chrome, Firefox, and Safari
4. **Text Sync**: Implement robust conflict resolution

### UX Risks
1. **Learning Curve**: Provide clear examples and documentation
2. **Text Editing**: Ensure seamless integration between visual and text editing
3. **Mobile Support**: Consider responsive design from the start

## 11. Success Metrics
1. **Functional**: All MVP features working smoothly
2. **Performance**: Fast response to text changes
3. **Usability**: Intuitive drag/drop interactions
4. **Accuracy**: Perfect alignment between text and visual representation
5. **Accessibility**: WCAG 2.1 AA compliance

## 12. Project Setup Commands — ✅ Verified
```bash
# Initialize project
npm create vite@latest editor -- --template react-ts
cd editor
npm install

# Core dependencies
npm install @codemirror/state @codemirror/view @codemirror/lang-markdown
npm install @codemirror/theme-one-dark codemirror

# Development dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @types/node

# Start development
npm run dev
```
```

This plan provides a roadmap from initial setup to production-ready MVP, with clear milestones and technical guidance for each phase.
