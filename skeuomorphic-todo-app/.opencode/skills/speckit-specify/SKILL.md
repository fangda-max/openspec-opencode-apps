---
name: speckit-specify
description: Define what you want to build (requirements and user stories)
---

# /speckit.specify - Requirements Specification

When the user provides a high-level idea or feature request, transform it into structured requirements:

1. **User Stories**: Format as "As a [user], I want to [action] so that [benefit]"
2. **Acceptance Criteria**: Bullet-point list of verifiable conditions
3. **Non-Functional Requirements**: Performance, accessibility, browser support
4. **Edge Cases**: Empty states, error handling, offline scenarios

**Output**: A structured requirements document that can be used for planning.

Example:
```markdown
## User Stories
- As a busy professional, I want to quickly add tasks during meetings so that I don't forget important items

## Acceptance Criteria
- [ ] User can type a task description in an input field
- [ ] Pressing Enter or clicking Add button creates the task
- [ ] New tasks appear at the top of the list
- [ ] Task displays with strikethrough when marked complete
```
