# Quick Start

Get started with Reflex in just a few minutes. This guide walks you through installing the library and building a complete TodoMVC application with HTTP API persistence and TypeScript.

## Installation

Install the core Reflex runtime:

```bash
npm install @flexsurfer/reflex
```

Optionally install the devtools for enhanced debugging:

```bash
npm install --save-dev @flexsurfer/reflex-devtools
```

## Define Constants

For better organization, we'll define constants for our event and subscription IDs:

```typescript
// shared/event-ids.ts
export const EVENT_IDS = {
  FETCH_TODOS: 'fetch-todos',
  LOAD_TODOS: 'load-todos',
  FETCH_FAILED: 'fetch-failed',
  ADD_TODO: 'add-todo',
  SAVE_TODO_SUCCESS: 'save-todo-success',
  SAVE_TODO_FAILED: 'save-todo-failed',
  TOGGLE_DONE: 'toggle-done',
  DELETE_TODO: 'delete-todo',
  COMPLETE_ALL_TOGGLE: 'complete-all-toggle',
  SET_SHOWING: 'set-showing'
}

// effect-ids.ts
export const EFFECT_IDS = {
  FETCH: 'fetch'
}

// sub-ids.ts
export const SUB_IDS = {
  TODOS: 'todos',
  SHOWING: 'showing',
  VISIBLE_TODOS: 'visible-todos',
  ALL_COMPLETE: 'all-complete'
}
```

## Initialize Your App Database

First, initialize your application database with an initial state and TypeScript types:

```typescript
// db.ts
import { initAppDb } from '@flexsurfer/reflex'

// Type definitions
export interface Todo {
  title: string
  done: boolean
}

export type Todos = Todo[]

export type Showing = 'all' | 'active' | 'done'

export interface DB {
  todos: Todos
  showing: Showing
}

// Initialize database with types
const defaultDB: DB = {
  todos: [], // Array of todos
  showing: 'all',
}

initAppDb(defaultDB)
```

## Register Events

Events are functions that modify your application state. Register them once and dispatch them from anywhere in your app:

> **Important**: Event handler functions must always remain pure. They can only use pure functions and should not have side effects. To dispatch events from within event handlers, use the `DISPATCH` effect instead of calling the `dispatch` function directly.


```typescript
// events.ts
import { regEvent } from '@flexsurfer/reflex'
import { EVENT_IDS } from 'shared/event-ids'
import { EFFECT_IDS } from './effect-ids'
import type { Todo } from './db'

// Fetch todos from API
regEvent(EVENT_IDS.FETCH_TODOS, () => {
  // Return effect: triggers side effects (like HTTP requests) that run after the event
  // Effect function is defined in effects.ts under regEffect(EFFECT_IDS.FETCH, ...)
  return [
    [EFFECT_IDS.FETCH, {
      url: '/api/todos',
      onSuccess: [EVENT_IDS.LOAD_TODOS],
      onFailure: [EVENT_IDS.FETCH_FAILED]
    }]
  ]
})

// Load todos from API response
regEvent(EVENT_IDS.LOAD_TODOS, ({ draftDb }, todos: Todo[]) => {
  // Mutate app db: changes to draftDb trigger subscriptions and re-render view if value changed
  draftDb.todos = todos
})

// Handle fetch failure
regEvent(EVENT_IDS.FETCH_FAILED, ({ draftDb }, error: string) => {
  console.error('Failed to fetch todos:', error)
  // Could set an error state in DB here
})

// Add new todo
regEvent(EVENT_IDS.ADD_TODO, ({ draftDb }, title: string) => {
  const newTodo: Todo = {
    title: title.trim(),
    done: false
  }
  draftDb.todos.push(newTodo)
  return [
    [EFFECT_IDS.FETCH, {
      url: '/api/todos',
      method: 'POST',
      body: JSON.stringify(newTodo),
      headers: { 'Content-Type': 'application/json' },
      onSuccess: [EVENT_IDS.SAVE_TODO_SUCCESS],
      onFailure: [EVENT_IDS.SAVE_TODO_FAILED]
    }]
  ]
})

// Handle successful todo save
regEvent(EVENT_IDS.SAVE_TODO_SUCCESS, ({ draftDb }, savedTodo: Todo) => {
  // Todo already added optimistically, could update with server response if needed
  console.log('Todo saved successfully:', savedTodo)
})

// Handle save failure
regEvent(EVENT_IDS.SAVE_TODO_FAILED, ({ draftDb }, error: string) => {
  console.error('Failed to save todo:', error)
  // Could remove the optimistically added todo or show error state
})

// Toggle todo completion
regEvent(EVENT_IDS.TOGGLE_DONE, ({ draftDb }, title: string) => {
  const todoIndex = draftDb.todos.findIndex(todo => todo.title === title)
  if (todoIndex !== -1) {
    draftDb.todos[todoIndex].done = !draftDb.todos[todoIndex].done
  }
})

// Delete todo
regEvent(EVENT_IDS.DELETE_TODO, ({ draftDb }, title: string) => {
  draftDb.todos = draftDb.todos.filter(todo => todo.title !== title)
})

// Toggle all todos
regEvent(EVENT_IDS.COMPLETE_ALL_TOGGLE, ({ draftDb }) => {
  const allComplete = draftDb.todos.length > 0 && draftDb.todos.every(todo => todo.done)
  draftDb.todos.forEach(todo => {
    todo.done = !allComplete
  })
})

// Set visibility filter
regEvent(EVENT_IDS.SET_SHOWING, ({ draftDb }, showing: 'all' | 'active' | 'done') => {
  draftDb.showing = showing
})
```

## Register Effects

Effects handle side effects like HTTP requests, local storage, or any other asynchronous operations. They run after events and can dispatch new events based on their results:

```typescript
// effects.ts
import { regEffect, dispatch } from '@flexsurfer/reflex'
import { EFFECT_IDS } from './effect-ids'

// Fetch effect
regEffect(EFFECT_IDS.FETCH, async ({ url, method = 'GET', body, headers, onSuccess, onFailure }) => {
    try {
        const response = await fetch(url, { method, body, headers })
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        if (onSuccess) {
            dispatch(onSuccess.concat([data]))
        }
    } catch (error) {
        console.error('HTTP request failed:', error)
        if (onFailure) {
            dispatch(onFailure.concat([error.message]))
        }
    }
})
```

## Register Subscriptions

Subscriptions define how to derive data from your application state. They're automatically reactive and will update your components when the underlying data changes:

```typescript
// subs.ts
import { regSub } from '@flexsurfer/reflex'
import { SUB_IDS } from './sub-ids'
import type { Todos, Showing } from './db'

// Root subscriptions (directly from app state)
regSub(SUB_IDS.TODOS)  // Returns Todo[]
regSub(SUB_IDS.SHOWING)  // Returns 'all' | 'active' | 'done'

// Computed subscriptions (derived data)
regSub(SUB_IDS.VISIBLE_TODOS, (todos: Todos, showing: Showing) => {
  if (!todos) return []
  switch (showing) {
    case 'active':
      return todos.filter(todo => !todo.done)
    case 'done':
      return todos.filter(todo => todo.done)
    default:
      return todos
  }
}, () => [[SUB_IDS.TODOS], [SUB_IDS.SHOWING]])

regSub(SUB_IDS.ALL_COMPLETE, (todos: Todos) => {
  return todos.length > 0 && todos.every(todo => todo.done)
}, () => [[SUB_IDS.TODOS]])
```

## Use in React Components

Now you can use your events and subscriptions in React components:

```tsx
// views.tsx
import React, { useEffect } from 'react'
import { useSubscription, dispatch } from '@flexsurfer/reflex'
import { EVENT_IDS } from 'shared/event-ids'
import { SUB_IDS } from './sub-ids'
import type { Todo } from './db'

// Main Todo App Component
export const TodoApp: React.FC = () => {
  const visibleTodos = useSubscription<Todo[]>([SUB_IDS.VISIBLE_TODOS])
  const allComplete = useSubscription<boolean>([SUB_IDS.ALL_COMPLETE])

  // Fetch todos on component mount
  useEffect(() => {
    dispatch([EVENT_IDS.FETCH_TODOS])
  }, [])

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const title = (e.target as HTMLInputElement).value.trim()
              if (title) {
                dispatch([EVENT_IDS.ADD_TODO, title])
                ;(e.target as HTMLInputElement).value = ''
              }
            }
          }}
        />
      </header>

      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={allComplete}
          onChange={() => dispatch([EVENT_IDS.COMPLETE_ALL_TOGGLE])}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {visibleTodos.map(todo => (
            <li key={todo.title}>
              <div className="view">
                <input
                  className="toggle"
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => dispatch([EVENT_IDS.TOGGLE_DONE, todo.title])}
                />
                <label>{todo.title}</label>
                <button
                  className="destroy"
                  onClick={() => dispatch([EVENT_IDS.DELETE_TODO, todo.title])}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
```

## Enable Developer Tools (Optional)

For enhanced debugging and development experience:

```typescript
import { enableTracing } from '@flexsurfer/reflex'
import { enableDevtools } from '@flexsurfer/reflex-devtools'

enableTracing()
enableDevtools()
```

Then run the devtools UI:

```bash
npx reflex-devtools
```

The devtools provide:
- Event flow visualization
- State change tracking
- Time-travel debugging
- Subscription graph inspection

## Next Steps

- Check out the [Best Practices](./best-practices.md) guide for recommended patterns
- Explore the complete [API Reference](./api-reference.md)
- Look at common questions in the [FAQ](./faq.md)

