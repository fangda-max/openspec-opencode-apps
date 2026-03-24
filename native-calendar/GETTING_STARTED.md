# Native Calendar - Getting Started

## 🚀 Quick Start (3 steps)

### 1. Open the Application

**Option A: With Live Server Extension (Recommended for VS Code)**
```
1. Install "Live Server" extension in VS Code
2. Right-click index.html
3. Select "Open with Live Server"
```

**Option B: Using Python (if installed)**
```bash
cd native-calendar
python -m http.server 8000
```
Then visit: `http://localhost:8000`

**Option C: Direct File Open (Limited functionality)**
Simply double-click `index.html` - works but ES modules may be restricted.

### 2. Start Using

The calendar opens in Month view showing the current month.

**Navigate:**
- Click `<` or `>` buttons to change months
- Use "Today" button to jump to current date
- Switch between Month/Week/Day views using top buttons

**Add Events:**
- Click on any empty day cell (month view)
- Or click a time slot (week/day view)
- Fill in title and description
- Click "Save"

**Edit/Delete Events:**
- Click an existing event block
- Modify details or click "Delete"

### 3. Your Data is Saved!

All events are stored in your browser's localStorage. They persist across page reloads automatically.

---

## 📱 Mobile Usage

The calendar is responsive and works on mobile devices.

**Touch Gestures:**
- Tap to create/edit events
- Swipe horizontally on month view to navigate

---

## 💡 Pro Tips

1. **Dark Mode**: Toggle in settings to switch themes
2. **Multiple Events**: You can have multiple events on the same day
3. **Quick Navigation**: Use keyboard shortcuts for faster navigation
4. **Event Details**: Description field supports up to 50 characters

---

## 🔧 Troubleshooting

**Calendar not displaying properly?**
- Make sure you're using a modern browser (Chrome 80+, Firefox 75+)
- Try opening via a local server instead of direct file open

**Events disappearing after refresh?**
- Check that localStorage is enabled in your browser
- Clear browser cache and try again

**View switching broken?**
- Refresh the page
- Check browser console for JavaScript errors

---

## 📂 Project Location

Your calendar app files are located at:
```
C:\Users\18196\.openclaw\workspace\native-calendar\
```

You can safely move this folder anywhere you like, just keep all files together.

---

Happy calendaring! 📅✨
