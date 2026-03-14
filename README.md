# Productivity Dashboard

A client-side web application providing essential productivity tools in a single, distraction-free interface.

## Features

- **Real-time Clock & Greeting**: Displays current time, date, and personalized greeting based on time of day
- **Custom Name**: Optional personalized greeting with your name
- **25-Minute Focus Timer**: Countdown timer for time-boxed work sessions with start/stop/reset controls
- **Task Management**: Create, edit, complete, and delete tasks with optional due dates
- **Task Sorting**: Sort tasks by creation date, due date, or alphabetically
- **Quick Links**: Save and access favorite websites with one click
- **Light/Dark Theme**: Toggle between light and dark modes with preference persistence
- **Local Storage**: All data persists automatically in your browser

## Getting Started

### No Installation Required

Simply open `index.html` in any modern browser:

1. Double-click `index.html`, or
2. Right-click `index.html` → Open with → Your browser

That's it! No server, no build tools, no configuration needed.

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Usage

### Greeting Widget
- View current time and date
- See time-appropriate greeting (morning/afternoon/evening)
- Enter your name for personalized greeting (optional)

### Timer Widget
- Click **Start** to begin 25-minute countdown
- Click **Stop** to pause the timer
- Click **Reset** to restore to 25:00

### Task Manager
- Enter task description and optional due date
- Click **Add** to create task
- Check checkbox to mark task complete
- Click **Edit** to modify task text
- Click **Delete** to remove task
- Use dropdown to sort tasks by creation date, due date, or alphabetically

### Quick Links
- Enter link name and URL (must include http:// or https://)
- Click **Add Link** to save
- Click link button to open in new tab
- Click **×** to delete link

### Theme Toggle
- Click sun/moon icon in header to switch themes
- Preference is saved automatically

## Project Structure

```
productivity-dashboard/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # All visual styling
├── js/
│   └── app.js          # All application logic
└── README.md           # This file
```

## Technical Details

- **HTML5**: Semantic markup for structure
- **CSS3**: Single stylesheet with CSS custom properties for theming
- **Vanilla JavaScript**: No frameworks or dependencies
- **Local Storage API**: Client-side data persistence

All components are self-contained classes with independent initialization and cleanup.

## Data Persistence

All data is stored in your browser's Local Storage:
- Tasks and completion status
- Quick links
- Theme preference
- User name
- Sort method preference

Data persists across browser sessions but is specific to your browser and device.

## Privacy

This application:
- Runs entirely in your browser
- Makes no network requests
- Stores no data on external servers
- Requires no account or login
- Your data never leaves your device

## License

This project is open source and available for personal and commercial use.
