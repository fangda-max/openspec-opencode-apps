# Native Calendar App 📅

A lightweight, dependency-free calendar application built with pure HTML, CSS, and JavaScript.

## Features

- **Three View Modes**: Month, Week, and Day views
- **Event Management**: Create, edit, and delete events
- **Local Storage**: All data persists across page reloads
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Themes**: Toggle between light and dark modes
- **Today Navigation**: Quick jump to current date
- **Navigation Controls**: Previous/Next month, week, or day

## Tech Stack

- HTML5 + CSS3 + Vanilla JavaScript (ES Modules)
- No build tools, no dependencies
- localStorage for data persistence

## Getting Started

### Option 1: Run Directly (Recommended)

Simply open `index.html` in a modern browser. For best results (ES modules), use a local server:

```bash
# Using Python 3
cd native-calendar
python -m http.server 8000
# Then visit: http://localhost:8000

# Or using Node.js
npx serve native-calendar
```

### Option 2: Live Server (VS Code)

If you're using VS Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Project Structure

```
native-calendar/
├── index.html          # Main entry point
├── css/
│   ├── main.css        # Theme variables and base styles
│   ├── components.css  # Calendar grid, navigation, modals
│   └── themes.css      # Light/dark theme definitions
├── js/
│   ├── app.js          # Application controller
│   ├── utils.js        # Date/time utility functions
│   ├── state.js        # State management + localStorage
│   ├── views.js        # Day view renderer
│   ├── MonthViewRenderer.js
│   └── WeekViewRenderer.js
└── assets/             # Images and other assets
```

## Usage

### Viewing Calendar

- **Month View** (default): See the entire month at a glance
- **Week View**: Detailed 7-day time grid
- **Day View**: Hour-by-hour schedule for one day

Navigate between views using the buttons at the top of the calendar.

### Creating Events

1. Click any empty day cell in month view
2. Or click a time slot in week/day view
3. Or use the "+ Add Event" button
4. Enter event title (required) and description (optional)
5. Click "Save"

### Editing Events

Click on an existing event block to edit its details.

### Deleting Events

When editing an event, click the red "Delete" button to remove it.

### Keyboard Shortcuts

- `←` / `→`: Navigate previous/next period
- `Enter`: Create event at focused time slot
- `Escape`: Close modal dialogs

## Built With OpenSpec

This project was developed using [OpenSpec](https://github.com/Fission-AI/OpenSpec), a spec-driven development framework that helps align requirements before implementation.

### Development Workflow

1. Created spec artifacts via `/opsx:propose`
2. Implemented features following `/opsx:apply` tasks
3. Each change is documented and versioned in `openspec/specs/`

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

Requires ES Module support for JavaScript imports.

## License

MIT © 2026

---

*Built with ❤️ using native web technologies*
