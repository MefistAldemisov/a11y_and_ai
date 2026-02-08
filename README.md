# Task Lists - Todo List Application

![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)

A modern, accessible todo list application built with React, TypeScript, and Vite. Features multiple checklists, task management with priorities and deadlines, and comprehensive progress tracking.

## Features

- ✅ **Multiple Checklists** - Organize tasks into separate checklists
- ✅ **Task Management** - Add, edit, delete, and complete tasks
- ✅ **Priority Levels** - Set task priorities (Low, Medium, Critical)
- ✅ **Deadlines** - Track task deadlines
- ✅ **Progress Tracking** - Visual progress bars for each checklist
- ✅ **Persistent Storage** - All data saved to localStorage
- ✅ **Expand/Collapse** - Collapsible checklists for better organization
- ✅ **Accessibility** - Full keyboard navigation and screen reader support
- ✅ **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Gravity UI** - Component library
- **Playwright** - E2E testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Testing

This project includes comprehensive E2E tests using Playwright.

### Run Tests

```bash
# Run all tests
npm test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug
```

### Run Tests by Browser

```bash
# Chromium only
npm run test:chromium

# Firefox only
npm run test:firefox

# WebKit (Safari) only
npm run test:webkit
```

### View Test Reports

```bash
# Show the last test report
npm run test:report
```

### Test Coverage

The test suite includes **62 comprehensive E2E tests** covering:

- **Checklist Operations** (12 tests) - CRUD operations, persistence, UI interactions
- **Task Operations** (15 tests) - Task management, completion, editing, priorities
- **Progress Tracking** (8 tests) - Progress calculation and display
- **UI Interactions** (15 tests) - Modals, buttons, keyboard navigation
- **Accessibility** (12 tests) - ARIA labels, keyboard support, focus management
- **Integration Workflows** (8 tests) - Complete user workflows and edge cases

For detailed testing documentation, see [`e2e/README.md`](e2e/README.md).

## Project Structure

```
a11y_and_ai/
├── src/
│   ├── components/          # React components
│   │   ├── ChecklistCard/   # Checklist display component
│   │   ├── ChecklistModal/  # Checklist create/edit modal
│   │   ├── TaskItem/        # Individual task component
│   │   └── TaskModal/       # Task create/edit modal
│   ├── context/             # React context
│   │   └── ChecklistContext.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useChecklists.ts
│   │   └── useModal.ts
│   ├── utils/               # Utility functions
│   │   └── storage.ts
│   ├── constants/           # App constants
│   ├── types.ts             # TypeScript types
│   ├── App.tsx              # Main app component
│   └── main.tsx             # App entry point
├── e2e/                     # E2E tests
│   ├── fixtures/            # Test helpers
│   ├── checklist.spec.ts    # Checklist tests
│   ├── task.spec.ts         # Task tests
│   ├── progress.spec.ts     # Progress tests
│   ├── ui-interactions.spec.ts
│   ├── accessibility.spec.ts
│   ├── integration.spec.ts
│   └── README.md            # Testing documentation
├── playwright.config.ts     # Playwright configuration
└── package.json
```

## Usage

### Creating a Checklist

1. Click the "New Checklist" button
2. Enter a title (required) and optional description
3. Click "Save"

### Adding Tasks

1. Click the "+" button on a checklist
2. Enter task details:
   - Title (required)
   - Description (optional)
   - Deadline (optional)
   - Priority (Low, Medium, or Critical)
3. Click "Save"

### Managing Tasks

- **Complete/Uncomplete**: Click the checkbox next to a task
- **Edit**: Click the pencil icon on a task
- **Delete**: Click the trash icon on a task

### Managing Checklists

- **Expand/Collapse**: Click the chevron icon or the checklist title
- **Edit**: Click the pencil icon in the checklist header
- **Delete**: Click the trash icon in the checklist header

## Accessibility

This application is built with accessibility in mind:

- ✅ Full keyboard navigation support
- ✅ ARIA labels and roles
- ✅ Screen reader compatible
- ✅ Focus management in modals
- ✅ Semantic HTML structure
- ✅ Sufficient color contrast

### Keyboard Shortcuts

- `Tab` - Navigate between interactive elements
- `Enter` or `Space` - Activate buttons and toggle expansion
- `Escape` - Close modals (when implemented)

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari/WebKit (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass: `npm test`
6. Submit a pull request

## License

This project is part of a learning exercise for accessibility and AI integration.

## Architecture

For detailed architecture documentation, see [`ARCHITECTURE.md`](ARCHITECTURE.md).
