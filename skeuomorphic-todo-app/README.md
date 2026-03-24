# 🌱 Skeuomorphic Todo List - Spec-Kit Powered

A beautiful, tactile todo list application built using **Spec-Driven Development** with OpenCode.

## 🎨 Design Philosophy

This app embraces **skeuomorphism** - the design approach where digital UI elements resemble their physical counterparts:

- ✨ Realistic shadows and highlights
- 🖱️ Buttons that feel like they press down
- 📝 Paper-like textures and warm tones
- 🎯 Physical metaphors you can interact with

## 🚀 Quick Start

Just open `index.html` in your browser! No build process required.

```bash
# Option 1: Direct double-click
Open index.html in Chrome or Firefox

# Option 2: Local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

## 💻 How This Was Built

This project uses **Spec-Kit**, GitHub's framework for **Spec-Driven Development**:

1. **Requirements First**: Every feature starts with clear user stories
2. **Technical Planning**: Detailed architecture before coding
3. **Task Breakdown**: Sequential implementation steps
4. **Quality Gates**: Constitution-guided code standards

### Available Commands

While working on this project, use these slash commands with OpenCode:

- `/speckit.constitution` - Update project principles
- `/speckit.specify` - Define new requirements
- `/speckit.plan` - Create technical plan
- `/speckit.tasks` - Generate task list
- `/speckit.implement` - Execute implementation

See `AGENTS.md` for full details.

## 📁 Project Structure

```
skeuomorphic-todo/
├── index.html           # Main entry point
├── css/
│   └── styles.css       # All styling (skeuomorphic theme)
├── js/
│   ├── main.js          # Application entry
│   ├── app.js           # Core app logic
│   ├── todo.js          # Todo item management
│   └── storage.js       # LocalStorage abstraction
└── assets/              # Images/textures if needed
```

## 🛠️ Tech Stack

- **HTML5** - Semantic markup with accessibility
- **CSS3** - Vanilla CSS with custom properties
- **JavaScript ES6+** - Modules, no frameworks
- **localStorage** - Data persistence (no backend)

## 🧪 Testing

All testing is manual via browser:

- ✅ Chrome (latest)
- ✅ Firefox (latest)  
- ✅ Mobile responsive check
- ✅ Edge cases (empty state, errors)
- ✅ Keyboard navigation

## 📝 User Stories

- As a busy professional, I want to quickly add tasks so I don't forget important items
- As an organizer, I want to mark tasks complete so I can track my progress
- As a clutter-preventer, I want to delete finished tasks so my list stays clean

## 🤝 Contributing

This is a demo project demonstrating Spec-Kit workflow. For modifications:

1. Read `skeleton.constitution` for code standards
2. Call `/speckit.specify` with your changes
3. Follow the spec-driven workflow from there

## 📜 License

MIT License - See LICENSE file

---

Built with ❤️ using Spec-Driven Development
