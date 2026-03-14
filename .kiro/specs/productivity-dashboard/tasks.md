# Implementation Plan: Productivity Dashboard

## Overview

This plan implements a client-side productivity dashboard with four main widgets: greeting with time/date display, 25-minute focus timer, task manager with sorting, and quick links manager. The application uses vanilla JavaScript with Local Storage for persistence, requires no backend, and includes comprehensive property-based testing for correctness validation.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create index.html with semantic HTML5 structure
  - Add container elements for all widgets (greeting, timer, tasks, quick links)
  - Include theme toggle button in header
  - Link to css/styles.css and js/app.js
  - _Requirements: 6.1, 6.4, 9.2_

- [ ] 2. Implement utility classes
  - [x] 2.1 Create StorageUtil class for Local Storage operations
    - Implement save(), load(), remove(), clear(), isAvailable() methods
    - Add JSON serialization/deserialization with error handling
    - Handle corrupted data gracefully (return defaults)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 2.2 Write property test for StorageUtil
    - **Property 14: Task storage round-trip**
    - **Property 18: Quick link storage round-trip**
    - **Property 19: Corrupted storage graceful handling**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**
  
  - [x] 2.3 Create DOMUtil class for DOM manipulation helpers
    - Implement createElement(), query(), queryAll() methods
    - Implement addEventListener(), removeEventListener() with cleanup tracking
    - Implement empty() for clearing element content
    - _Requirements: 6.1_

- [ ] 3. Implement GreetingWidget
  - [x] 3.1 Create GreetingWidget class with time and date display
    - Implement formatTime() for 12-hour format with AM/PM
    - Implement formatDate() for day of week, month, day
    - Implement updateDisplay() to refresh every second
    - Set up setInterval for automatic updates
    - _Requirements: 1.1, 1.2, 1.6_
  
  - [ ]* 3.2 Write property tests for time and date formatting
    - **Property 1: Time format correctness**
    - **Property 2: Date format completeness**
    - **Validates: Requirements 1.1, 1.2**
  
  - [x] 3.3 Add greeting message logic
    - Implement getGreeting() with hour-based logic (morning/afternoon/evening)
    - Display greeting in DOM
    - _Requirements: 1.3, 1.4, 1.5_
  
  - [ ]* 3.4 Write property tests for greeting logic
    - **Property 3: Greeting correctness**
    - **Validates: Requirements 1.3, 1.4, 1.5**
  
  - [ ] 3.5 Add custom user name support
    - Add input field and save/clear buttons to DOM
    - Implement setUserName(), loadUserName(), saveUserName() methods
    - Integrate user name into greeting display
    - Persist user name to Local Storage
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
  
  - [ ]* 3.6 Write property tests for user name functionality
    - **Property 3a: Greeting with user name**
    - **Property 3b: Greeting without user name**
    - **Property 23: User name storage round-trip**
    - **Property 24: User name trimming**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.7**

- [ ] 4. Implement TimerWidget
  - [x] 4.1 Create TimerWidget class with state management
    - Initialize with 1500 seconds (25 minutes)
    - Implement state properties (remainingSeconds, isRunning, intervalId)
    - Implement formatTime() for MM:SS display
    - Implement updateDisplay() to show formatted time
    - _Requirements: 2.1, 2.5, 2.7_
  
  - [ ]* 4.2 Write property test for timer display format
    - **Property 4: Timer display format**
    - **Validates: Requirements 2.5**
  
  - [x] 4.3 Implement timer controls (start, stop, reset)
    - Implement start() to begin countdown with setInterval
    - Implement stop() to pause countdown
    - Implement reset() to restore to 1500 seconds
    - Implement tick() to decrement time and stop at 00:00
    - Add event listeners to control buttons
    - _Requirements: 2.2, 2.3, 2.4, 2.6_
  
  - [ ]* 4.4 Write property tests for timer operations
    - **Property 5: Timer start preserves remaining time**
    - **Property 6: Timer stop preserves remaining time**
    - **Property 7: Timer reset restores initial state**
    - **Validates: Requirements 2.2, 2.3, 2.4**

- [x] 5. Checkpoint - Verify greeting and timer widgets
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement TaskManager core functionality
  - [x] 6.1 Create TaskManager class with data model
    - Define Task model structure (id, text, completed, createdAt, dueDate)
    - Implement loadTasks() and saveTasks() using StorageUtil
    - Initialize empty task list
    - _Requirements: 3.7, 3.8, 5.1, 5.4_
  
  - [x] 6.2 Implement task addition
    - Implement addTask(text, dueDate) method
    - Generate unique ID using timestamp
    - Validate non-empty text (trim whitespace)
    - Add task to list and save to storage
    - Update DOM display
    - _Requirements: 3.1, 3.9_
  
  - [ ]* 6.3 Write property tests for task addition
    - **Property 8: Task addition preserves text**
    - **Property 25: Task due date preservation**
    - **Validates: Requirements 3.1, 3.9, 3.10**
  
  - [x] 6.4 Implement task editing
    - Implement editTask(id, newText) method
    - Validate non-empty new text
    - Update task in list and save to storage
    - Update DOM display
    - _Requirements: 3.2_
  
  - [ ]* 6.5 Write property test for task editing
    - **Property 9: Task edit updates text**
    - **Validates: Requirements 3.2**
  
  - [x] 6.6 Implement task completion toggle
    - Implement toggleTask(id) method
    - Toggle completed boolean
    - Update task in list and save to storage
    - Update DOM display with visual distinction
    - _Requirements: 3.3, 3.6_
  
  - [ ]* 6.7 Write property tests for task completion
    - **Property 10: Task toggle round-trip**
    - **Property 13: Task completion status visibility**
    - **Validates: Requirements 3.3, 3.6**
  
  - [x] 6.8 Implement task deletion
    - Implement deleteTask(id) method
    - Remove task from list and save to storage
    - Update DOM display
    - _Requirements: 3.4_
  
  - [ ]* 6.9 Write property test for task deletion
    - **Property 11: Task deletion removes task**
    - **Validates: Requirements 3.4**

- [ ] 7. Implement task sorting functionality
  - [x] 7.1 Create sorting methods
    - Implement sortTasks(tasks, method) with three sort algorithms
    - Sort by creation date (createdAt ascending)
    - Sort by due date (earliest first, null dates last)
    - Sort alphabetically (case-insensitive A-Z)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [x] 7.2 Add sort method selection and persistence
    - Implement setSortMethod(method) to change sort order
    - Add dropdown UI for sort method selection
    - Persist sort method to Local Storage
    - Load sort method on initialization (default to "created")
    - Apply sort method when rendering tasks
    - _Requirements: 12.6, 12.7, 12.8_
  
  - [ ]* 7.3 Write property tests for sorting
    - **Property 12: Task order preservation**
    - **Property 26: Sort by creation date order**
    - **Property 27: Sort by due date order**
    - **Property 28: Sort alphabetically order**
    - **Property 29: Sort method storage round-trip**
    - **Property 30: Sort method default value**
    - **Validates: Requirements 3.5, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8**

- [ ] 8. Implement task rendering and UI
  - [x] 8.1 Create renderTasks() method
    - Generate DOM elements for each task
    - Display task text, due date, completion status
    - Add edit, delete, and checkbox controls
    - Apply completed styling to finished tasks
    - Attach event listeners for all controls
    - _Requirements: 3.5, 3.6, 6.4, 6.6_
  
  - [x] 8.2 Create task form UI
    - Add text input for task description
    - Add date input for optional due date
    - Add submit button
    - Handle form submission
    - Clear inputs after successful addition
    - _Requirements: 3.1, 3.9_

- [x] 9. Checkpoint - Verify task management
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement QuickLinksManager
  - [x] 10.1 Create QuickLinksManager class with data model
    - Define QuickLink model structure (id, name, url)
    - Implement loadLinks() and saveLinks() using StorageUtil
    - Initialize empty links list
    - _Requirements: 4.5, 4.6, 5.2, 5.5_
  
  - [x] 10.2 Implement link addition
    - Implement addLink(name, url) method
    - Generate unique ID using timestamp
    - Validate non-empty name and valid URL format
    - Require http:// or https:// protocol
    - Add link to list and save to storage
    - Update DOM display
    - _Requirements: 4.1_
  
  - [ ]* 10.3 Write property tests for link addition
    - **Property 15: Quick link addition preserves data**
    - **Validates: Requirements 4.1**
  
  - [x] 10.4 Implement link deletion
    - Implement deleteLink(id) method
    - Remove link from list and save to storage
    - Update DOM display
    - _Requirements: 4.4_
  
  - [ ]* 10.5 Write property test for link deletion
    - **Property 17: Quick link deletion removes link**
    - **Validates: Requirements 4.4**
  
  - [x] 10.6 Implement link rendering and interaction
    - Implement renderLinks() method
    - Generate clickable button for each link
    - Add delete button for each link
    - Implement openLink(url) to open in new tab with rel="noopener noreferrer"
    - Attach event listeners
    - _Requirements: 4.2, 4.3_
  
  - [ ]* 10.7 Write property test for link rendering
    - **Property 16: Quick link rendering**
    - **Validates: Requirements 4.3**
  
  - [x] 10.8 Create link form UI
    - Add text input for link name
    - Add URL input for link address
    - Add submit button
    - Handle form submission with validation
    - Clear inputs after successful addition
    - _Requirements: 4.1_

- [ ] 11. Implement ThemeManager
  - [x] 11.1 Create ThemeManager class
    - Implement loadTheme() and saveTheme() using StorageUtil
    - Implement toggleTheme() to switch between light and dark
    - Implement applyTheme(theme) to add CSS class to body
    - Default to "light" theme if not stored
    - _Requirements: 10.1, 10.2, 10.5, 10.6, 10.7_
  
  - [x] 11.2 Create theme toggle UI
    - Add toggle button with sun/moon icons
    - Update icon based on current theme
    - Attach click event listener
    - _Requirements: 10.3, 10.4_
  
  - [ ]* 11.3 Write property tests for theme management
    - **Property 20: Theme toggle alternation**
    - **Property 21: Theme storage round-trip**
    - **Property 22: Theme default value**
    - **Validates: Requirements 10.2, 10.5, 10.6, 10.7**

- [ ] 12. Implement CSS styling
  - [x] 12.1 Create base styles and layout
    - Define CSS variables for colors, spacing, typography
    - Create grid or flexbox layout for widget positioning
    - Style body, containers, and semantic elements
    - _Requirements: 6.2, 6.4, 6.5_
  
  - [x] 12.2 Style individual widgets
    - Style GreetingWidget (time, date, greeting, name form)
    - Style TimerWidget (display, control buttons)
    - Style TaskManager (form, task list, task items, sort controls)
    - Style QuickLinksManager (form, link buttons)
    - Style theme toggle button
    - _Requirements: 6.2, 6.4, 6.5_
  
  - [x] 12.3 Implement theme-specific styles
    - Define light theme colors using .theme-light class
    - Define dark theme colors using .theme-dark class
    - Ensure sufficient color contrast for accessibility
    - _Requirements: 10.1, 10.8_
  
  - [x] 12.4 Add interactive states and feedback
    - Style hover states for all buttons and interactive elements
    - Style focus states for keyboard navigation
    - Style active/pressed states
    - Add visual distinction for completed tasks
    - _Requirements: 6.6_

- [ ] 13. Wire components together in main app
  - [x] 13.1 Create main initialization function
    - Check Local Storage availability
    - Initialize all widget instances (GreetingWidget, TimerWidget, TaskManager, QuickLinksManager, ThemeManager)
    - Pass correct container elements to each widget
    - Call init() on each widget
    - _Requirements: 9.1, 9.4_
  
  - [x] 13.2 Add error handling and cleanup
    - Wrap initialization in try-catch
    - Display user-friendly error messages if initialization fails
    - Implement cleanup on page unload (clear intervals, remove listeners)
    - _Requirements: 5.3_
  
  - [x] 13.3 Add performance optimizations
    - Ensure initial render completes quickly
    - Debounce storage operations if needed
    - Use event delegation for dynamic lists
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 14. Final checkpoint - Complete testing and validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation uses vanilla JavaScript (ES6+) with no frameworks or build tools
- All data persistence uses Local Storage with JSON serialization
- Property tests use fast-check library with minimum 100 iterations per test
- Checkpoints ensure incremental validation at logical breakpoints
- Browser compatibility targets: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
