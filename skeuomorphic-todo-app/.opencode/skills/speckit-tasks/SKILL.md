---
name: speckit-tasks
description: Generate actionable task lists for implementation
---

# /speckit.tasks - Task Generation

Based on an existing technical plan, break down development into numbered, actionable tasks:

1. **Numbered Tasks**: Sequential IDs (001, 002, 003...)
2. **Clear Descriptions**: What needs to be done
3. **Complexity Indicators**: Simple/Medium/Hard
4. **Dependencies**: Which tasks must complete first
5. **Acceptance Criteria**: How to verify completion

**Output**: A prioritized task list that can be executed sequentially with `/speckit.implement`.

Example format:
```markdown
## Implementation Tasks

### Phase 1: Foundation (Tasks 001-003)
**Task 001 [Simple]**
Set up project structure and HTML skeleton
- Create index.html with semantic markup
- Add ARIA labels for accessibility
- Link CSS and JS files

**Task 002 [Simple]**
Implement localStorage abstraction
- Create js/storage.js module
- Implement save/load methods
- Handle empty state gracefully

**Task 003 [Medium]**
Build skeuomorphic button styles
- Design normal/hover/active states
- Add realistic shadows and highlights
- Ensure touch-friendly sizing
```
