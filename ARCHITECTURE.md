# Application Architecture

## Overview

This is a scalable React to-do list application built with TypeScript, Gravity UI, and modern React patterns including Context API and custom hooks.

## Architecture Layers

### 1. **Types** (`src/types.ts`)
Centralized TypeScript type definitions for the entire application:
- `Priority`: Union type for task priorities (low, medium, critical)
- `Task`: Interface for task objects
- `Checklist`: Interface for checklist objects

### 2. **Constants** (`src/constants/`)
Application-wide constants and configuration:
- `STORAGE_KEY`: LocalStorage key for data persistence
- `PRIORITY_OPTIONS`: Priority selector options
- `DEFAULT_PRIORITY`: Default priority value

### 3. **Context** (`src/context/`)
Global state management using React Context API:
- `ChecklistContext`: Provides checklist state and actions to the entire app
- `ChecklistProvider`: Wraps the application to provide context

**Benefits:**
- Eliminates prop drilling
- Centralized state management
- Easy to test and maintain

### 4. **Hooks** (`src/hooks/`)
Custom hooks for reusable business logic:

#### `useChecklists`
Provides access to checklist context with type safety:
- `checklists`: Current state
- `createChecklist()`: Create new checklist
- `updateChecklist()`: Update existing checklist
- `deleteChecklist()`: Delete checklist
- `createTask()`: Add task to checklist
- `updateTask()`: Update existing task
- `toggleTask()`: Toggle task completion
- `deleteTask()`: Remove task

#### `useModal`
Generic modal state management:
- `isOpen`: Modal visibility state
- `data`: Modal data (generic type)
- `open()`: Open modal with optional data
- `close()`: Close modal and clear data

**Benefits:**
- Reusable modal logic
- Type-safe data passing
- Simplified component code

### 5. **Components** (`src/components/`)
Presentational and container components:

#### Presentational Components
- `TaskItem`: Displays individual task with actions
- `ChecklistCard`: Displays checklist with tasks and progress
- `ChecklistModal`: Form for creating/editing checklists
- `TaskModal`: Form for creating/editing tasks

**Component Structure:**
```
Component/
├── Component.tsx    # Component logic
└── Component.css    # Component styles (BEM)
```

**Styling Conventions:**
- BEM (Block Element Modifier) naming
- Gravity UI CSS variables for spacing and colors
- No hardcoded pixel values

### 6. **Utils** (`src/utils/`)
Utility functions and helpers:
- `storage.ts`: LocalStorage operations (load/save checklists)

### 7. **Main App** (`src/App.tsx`)
Root component that:
- Uses `useChecklists` hook for state management
- Uses `useModal` hooks for modal management
- Orchestrates component interactions
- Handles business logic coordination

## Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Hook/Context Action
    ↓
State Update
    ↓
LocalStorage Sync
    ↓
Component Re-render
```

## State Management Pattern

### Before (Props Drilling)
```tsx
App → ChecklistCard → TaskItem
  ↓ (props)    ↓ (props)
```

### After (Context API)
```tsx
ChecklistProvider
    ↓ (context)
    ├─ App
    ├─ ChecklistCard
    └─ TaskItem
```

## Scalability Features

### 1. **Separation of Concerns**
- Business logic in hooks
- State management in context
- UI in components
- Constants in separate files

### 2. **Type Safety**
- Full TypeScript coverage
- Type-safe context and hooks
- Generic modal hook

### 3. **Reusability**
- Generic `useModal` hook
- Shared constants
- Utility functions

### 4. **Testability**
- Isolated business logic in hooks
- Pure utility functions
- Context can be mocked

### 5. **Maintainability**
- Clear file structure
- BEM CSS naming
- Consistent patterns

## Future Enhancements

### Easy to Add:
1. **Multiple Storage Backends**
   - Create storage interface
   - Implement different providers (IndexedDB, API, etc.)

2. **Undo/Redo**
   - Add history to context
   - Implement action stack

3. **Filtering/Sorting**
   - Add filter state to context
   - Create filter hooks

4. **Drag & Drop**
   - Add reorder actions to context
   - Integrate DnD library

5. **Real-time Sync**
   - Replace localStorage with WebSocket
   - Add sync status to context

6. **User Authentication**
   - Add auth context
   - Protect routes

## File Structure

```
src/
├── components/          # UI components
│   ├── ChecklistCard/
│   ├── ChecklistModal/
│   ├── TaskItem/
│   └── TaskModal/
├── context/            # Context providers
│   └── ChecklistContext.tsx
├── hooks/              # Custom hooks
│   ├── useChecklists.ts
│   └── useModal.ts
├── utils/              # Utility functions
│   └── storage.ts
├── constants/          # App constants
│   └── index.ts
├── types.ts           # TypeScript types
├── App.tsx            # Root component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## Development Guidelines

### Adding New Features
1. Define types in `types.ts`
2. Add constants if needed
3. Create context actions if state changes
4. Build custom hooks for logic
5. Create/update components
6. Update documentation

### Component Guidelines
- Keep components focused and small
- Use custom hooks for logic
- Follow BEM naming for CSS
- Use Gravity UI variables
- Add TypeScript types

### State Updates
- Always use context actions
- Never mutate state directly
- Keep actions pure and predictable
- Handle side effects in context

## Performance Considerations

1. **Context Optimization**
   - Single context for related data
   - Memoization where needed

2. **Component Optimization**
   - React.memo for expensive renders
   - useCallback for event handlers

3. **Storage Optimization**
   - Debounce localStorage writes
   - Lazy load large datasets
