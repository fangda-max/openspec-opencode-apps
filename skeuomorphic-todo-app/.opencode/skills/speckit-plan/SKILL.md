---
name: speckit-plan
description: Create technical implementation plans with your chosen tech stack
---

# /speckit.plan - Technical Implementation Plan

After requirements are specified, create a detailed technical plan:

1. **Architecture Overview**: High-level component diagram description
2. **Data Models**: JSON schemas for data structures
3. **Component Breakdown**: List of components/files to create/modify
4. **Technical Decisions**: Explain why certain approaches were chosen
5. **API/Storage Contracts**: Define interfaces and persistence strategies
6. **Implementation Phases**: Group tasks into logical batches

**Output**: A comprehensive technical specification that guides task generation.

Example structure:
```markdown
## Architecture
- Single-page application with vanilla JS modules
- Event-driven architecture using custom event dispatcher
- Model-View pattern (no framework)

## Data Model
```json
{
  "todos": [
    {
      "id": "uuid-v4",
      "text": "string",
      "completed": false,
      "createdAt": "ISO-8601"
    }
  ]
}
```

## Components
1. `index.html` - Main container
2. `css/styles.css` - Skeuomorphic styling
3. `js/app.js` - Application controller
4. `js/storage.js` - LocalStorage abstraction
```
