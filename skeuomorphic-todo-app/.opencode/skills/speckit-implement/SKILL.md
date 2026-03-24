---
name: speckit-implement
description: Execute all tasks to build the feature according to the plan
---

# /speckit.implement - Task Execution

Execute implementation tasks sequentially from a generated task list:

**Process:**
1. Read task list (from `/speckit.tasks` output)
2. For each task:
   - Implement the required functionality
   - Test manually in browser
   - Verify against acceptance criteria
   - Move to next task only when current is complete
3. Report completion status for all tasks

**Quality Checks:**
- Code follows constitution standards
- Design matches skeuomorphic principles
- Browser compatibility verified
- No console errors or warnings

**Output**: 
- Working code that implements all specified features
- Summary of completed/failed tasks
- Any deviations from plan with rationale

When encountering blockers, pause and call `/speckit.clarify` before proceeding.
