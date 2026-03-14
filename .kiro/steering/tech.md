# Technology Stack

## Core Technologies

- **HTML5**: Semantic markup for structure
- **CSS3**: Single stylesheet for all visual styling
- **Vanilla JavaScript**: No frameworks or build tools required
- **Local Storage API**: Client-side data persistence

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Build System

None required. This is a static web application that runs directly in the browser.

## Development Workflow

### Running the Application
```bash
# Simply open the HTML file in any modern browser
# No build step, no server, no installation
```

### File Watching (Optional)
If using a local development server for convenience:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

### Testing
```bash
# Run unit tests (if test framework added)
npm test

# Run property-based tests
npm run test:pbt
```

## Testing Framework

- **fast-check**: Property-based testing library for JavaScript
- Minimum 100 iterations per property test
- Tests validate correctness properties across random inputs

## Code Organization

- Single HTML file: `index.html`
- Single CSS file: `css/styles.css`
- Single JavaScript file: `js/app.js`
