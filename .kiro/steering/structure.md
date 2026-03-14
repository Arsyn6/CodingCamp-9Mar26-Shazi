# Project Structure

## Directory Layout

```
productivity-dashboard/
├── index.html          # Main HTML structure and entry point
├── css/
│   └── styles.css      # All visual styling and theme definitions
├── js/
│   └── app.js          # All application logic and components
└── .kiro/
    ├── specs/          # Feature specifications
    │   └── productivity-dashboard/
    │       ├── requirements.md
    │       ├── design.md
    │       └── tasks.md
    └── steering/       # Project guidance documents
```

## Code Architecture

### Component Structure

All components are defined in `js/app.js` following a modular class-based pattern:

- **GreetingWidget**: Time, date, and personalized greeting display
- **TimerWidget**: 25-minute countdown timer with controls
- **TaskManager**: Task CRUD operations with sorting and persistence
- **QuickLinksManager**: Favorite website link management
- **ThemeManager**: Light/dark theme switching
- **StorageUtil**: Local Storage wrapper with error handling
- **DOMUtil**: DOM manipulation helpers

### Data Flow

```
User Interaction → Component → StorageUtil → Local Storage
                                    ↓
                              DOMUtil → DOM Update
```

## Naming Conventions

- **Classes**: PascalCase (e.g., `GreetingWidget`, `TaskManager`)
- **Functions**: camelCase (e.g., `formatTime`, `addTask`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `STORAGE_KEYS`, `DEFAULT_TIMER_SECONDS`)
- **CSS Classes**: kebab-case (e.g., `greeting-widget`, `task-item`)
- **Storage Keys**: kebab-case with prefix (e.g., `productivity-dashboard-tasks`)

## File Organization Rules

- Keep all HTML in `index.html` - no partials or templates
- Keep all CSS in `css/styles.css` - no CSS-in-JS or inline styles
- Keep all JavaScript in `js/app.js` - no external dependencies
- Use semantic HTML5 elements for structure
- Use CSS custom properties for theme variables
- Use Local Storage for all data persistence

## Component Independence

Each widget operates independently with:
- Self-contained initialization
- Own DOM container element
- Own storage key namespace
- Cleanup/destroy method for proper teardown
- No direct dependencies on other widgets
