# Best Practices

This guide covers recommended patterns and conventions for building scalable applications with Reflex. Following these practices will help you maintain clean, predictable, and performant code.

## Project Structure

### Organize by Feature

Structure your codebase around features rather than technical layers:

```
src/
  features/
    auth/
      events.ts
      subscriptions.ts
      components/
        LoginForm.tsx
        UserProfile.tsx
    todos/
      events.ts
      subscriptions.ts
      components/
        TodoList.tsx
        TodoItem.tsx
  shared/
    db.ts            # Database schema and initialization
    effects-ids.ts   # Effect-related ID constants
    effects.ts       # Side effects and external API calls
    events-ids.ts    # Event ID constants
    events.ts        # Global events (navigation, notifications)
    subscriptions-ids.ts # Subscription ID constants
    subscriptions.ts # Global subscriptions
    types.ts         # Shared TypeScript types
```

## State Design

### Grow State Horizontally, Not Vertically

Structure your application state to grow horizontally (adding new top-level keys) rather than vertically (nesting deeply). This approach is more efficient for updates and subscriptions:

```typescript
// ✅ Good - horizontal growth
initAppDb({
  auth: { user: null, sessionId: null },
  todos: [],
  ui: { theme: 'light', sidebarOpen: true },
  config: { apiUrl: 'https://api.example.com' }
})

// Adding new feature? Add a new top-level key
initAppDb({
  auth: { user: null, sessionId: null },
  todos: [],
  ui: { theme: 'light', sidebarOpen: true },
  config: { apiUrl: 'https://api.example.com' },
  notifications: [] // ← New feature added horizontally
})

// ❌ Avoid - vertical growth
initAppDb({
  app: {
    auth: { user: null, sessionId: null },
    features: {
      todos: [],
      ui: {
        theme: 'light',
        sidebarOpen: true,
        features: {
          notifications: [] // Deep nesting
        }
      }
    },
    config: { apiUrl: 'https://api.example.com' }
  }
})
```

### Normalize Complex Data

Use normalized structures for relational data. Keep related entities at the top level to avoid deep nesting:

```typescript
initAppDb({
  users: {
    '1': { id: '1', name: 'John', posts: ['1', '2'] },
    '2': { id: '2', name: 'Jane', posts: ['3'] }
  },
  posts: {
    '1': { id: '1', title: 'Post 1', authorId: '1' },
    '2': { id: '2', title: 'Post 2', authorId: '1' },
    '3': { id: '3', title: 'Post 3', authorId: '2' }
  },
  ui: {
    currentUserId: '1'
  }
})
```

### Use Consistent Naming Conventions

Establish patterns for your state structure:

```typescript
initAppDb({
  // Domain-specific state
  auth: { user: null, token: null },
  todos: [],

  // UI state
  ui: {
    loading: false,
    errors: {},
    modals: {}
  },

  // App configuration
  config: {
    apiUrl: 'https://api.example.com',
    theme: 'light'
  }
})
```

## State Mutations

Reflex uses Immer under the hood to detect changes in state via structural patches. These patches then drive the reactive system. To avoid unnecessary recomputations and reactions, it's important to mutate `draftDb` in a way that minimizes the creation of redundant patches.

### 📌 How Immer Works (Key Detail)

Immer does **not create a patch** if:

```ts
if (origValue === value && op === REPLACE) return
```

That means:

- If you assign the **same value** (by reference or primitive identity), no patch is created.
- If you assign a **new object**, even with identical contents, a patch **will** be created.

### ✅ Safe Mutation Patterns (No Extra Reactions)

You do **not** need to manually check before assigning **primitives**:

```ts
produce(db, draft => {
  draft.user.name = 'John' // ✅ no patch if name was already 'John'
})
```

Immer will skip the patch if the value didn't change.

### ⚠️ Unsafe Patterns That Trigger Unnecessary Patches

Avoid recreating objects/arrays unnecessarily:

```ts
produce(db, draft => {
  draft.user = { ...draft.user, name: 'John' } // ❌ always new reference
})

produce(db, draft => {
  draft.items = [...draft.items] // ❌ new array, even if unchanged
})
```

These produce patches, which trigger root reactions, even if logically nothing changed.

### 🛡️ Optional Manual Checks (When You're Unsure)

In some cases, it's safer to check manually — especially if there's a chance of accidental object recreation:

```ts
produce(db, draft => {
  if (draft.user.name !== newName) {
    draft.user.name = newName
  }
})
```

This avoids unnecessary assignments and patch creation altogether.

### 🧠 Summary

| Pattern | Patch Created? | Recommended |
|--------|----------------|-------------|
| `draft.value = samePrimitive` | ❌ | ✅ Yes |
| `draft.value = sameReference` | ❌ | ✅ Yes |
| `draft.value = {...value}` (new object) | ✅ | ❌ Avoid unless needed |
| Manual check before assign | ❌ | ✅ Optional, for safety |

### 🚀 Tip

Let Immer do the heavy lifting. You only need to be careful when working with objects, arrays, or references that might be unintentionally recreated. Avoiding these patterns helps Reflex skip unnecessary reaction updates.

## Events

> ⚠️ **Important**: When passing data from `draftDb` to effects, always use the `current()` function to get the current (final) value. The `draftDb` object is an Immer draft proxy that will be finalized after the event completes, so passing `draftDb` data directly to effects will result in the empty proxy object.
>
> ```typescript
> import { regEvent, current } from '@flexsurfer/reflex';
>
> regEvent('answer-question', ({ draftDb }, questionIndex, answerIndex) => {
>   draftDb.userAnswers[questionIndex] = answerIndex
>   // Use current() to pass the final value to the effect
>   return [['local-storage-set', { key: 'userAnswers', value: current(draftDb.userAnswers) }]]
> })
> ```

### Use Descriptive Event Names

Use namespaced, descriptive event names:

```typescript
// ✅ Good
regEvent('todos/create', ({ draftDb }, text: string) => {
  draftDb.todos.push({ id: Date.now(), text, completed: false })
})

regEvent('user/profile-update', ({ draftDb }, updates) => {
  Object.assign(draftDb.user.profile, updates)
})

// ❌ Avoid
regEvent('add', ({ draftDb }, item) => { /* ... */ })
regEvent('update', ({ draftDb }, data) => { /* ... */ })
```

### Keep Events Focused and PURE

Events should be synchronous, pure functions focused on state changes. Use effects for side effects async operations:

```typescript
// ✅ Good - simple state mutation
regEvent('ui/toggle-theme', ({ draftDb }) => {
  draftDb.ui.theme = draftDb.ui.theme === 'light' ? 'dark' : 'light'
})

// ❌ Avoid - mixing concerns
regEvent('todos/create-and-sync', async ({ draftDb }, text: string) => {
  draftDb.todos.push({ id: Date.now(), text, completed: false })
  const todos = await api.fetchTodos() // Side effect in event
  draftDb.todos = todos
})

// ✅ Good - event handles state change and dispatches effect to persist new item
regEvent('todos/create', ({ draftDb, now }, text: string) => {
  const newTodo = { id: now, text, completed: false }
  draftDb.todos.push(newTodo)
  return [['todos/store', newTodo]]
}, [[NOW]])

// ❌ Avoid - event using side effect directly
regEvent('todos/sync', async ({ draftDb }) => {
  const todos = await api.fetchTodos()
  draftDb.todos = todos
})

// ✅ Good - event returns DISPATCH effect for additional actions
regEvent('todos/create-with-notification', ({ draftDb, now }, text: string) => {
  draftDb.todos.push({ id: now, text, completed: false })
  return [[DISPATCH, ['ui/show-notification', 'Todo created!']]]
}, [[NOW]])

// ❌ Avoid - using dispatch directly in event
regEvent('todos/create-with-notification', ({ draftDb }, text: string) => {
  draftDb.todos.push({ id: Date.now(), text, completed: false })
  dispatch(['ui/show-notification', 'Todo created!']) // Dispatching in event
})


```

## Subscriptions

### Use Derived Subscriptions for Computed Data

Create subscriptions that derive data from other subscriptions:

```typescript
// Root subscriptions
regSub('todos/all', 'todos')
regSub('todos/filter', 'filter')

// Derived subscription
regSub('todos/filtered', (todos, filter) => {
  switch (filter) {
    case 'completed':
      return todos.filter(todo => todo.completed)
    case 'active':
      return todos.filter(todo => !todo.completed)
    default:
      return todos
  }
}, () => [['todos/all'], ['todos/filter']])
```

### Use Custom Equality Checks for Performance

By default, subscriptions use deep equality to detect changes. For performance-critical subscriptions with large objects or frequent updates, consider custom equality checks

### Avoid Heavy Computations in Subscriptions

Keep subscriptions lightweight. Move expensive operations to events:

```typescript
// ✅ Good - lightweight subscription
regSub('user/display-name', (user) => {
  return user ? `${user.firstName} ${user.lastName}` : 'Guest'
}, () => [['user']])

// ✅ Better - pre-compute heavy computations in event
regEvent('analytics/process-dataset', ({ draftDb }, rawData) => {
  draftDb.analytics.rawData = rawData

  // Heavy computations that could take hundreds of milliseconds:
  // Sort large dataset by complex multi-criteria scoring
  const sortedData = [...rawData].sort((a, b) => {
    const aScore = a.revenue * a.conversionRate * a.customerSatisfaction
    const bScore = b.revenue * b.conversionRate * b.customerSatisfaction
    return bScore - aScore
  })

  // Calculate statistics across thousands of records with complex aggregations
  const stats = rawData.reduce((acc, item) => {
    acc.totalRevenue += item.revenue
    acc.totalUsers += item.users
    acc.avgConversion = (acc.avgConversion + item.conversionRate) / 2
    acc.topPerformers.push(item)
    acc.topPerformers.sort((a, b) => b.revenue - a.revenue).splice(100) // Keep top 100
    return acc
  }, { totalRevenue: 0, totalUsers: 0, avgConversion: 0, topPerformers: [] })

  // Pre-compute derived views and statistical percentiles
  const revenues = sortedData.map(d => d.revenue).sort((a, b) => a - b)
  draftDb.analytics.sortedData = sortedData
  draftDb.analytics.stats = stats
  draftDb.analytics.top10 = sortedData.slice(0, 10)
  draftDb.analytics.percentiles = {
    p25: revenues[Math.floor(revenues.length * 0.25)],
    p75: revenues[Math.floor(revenues.length * 0.75)],
    p95: revenues[Math.floor(revenues.length * 0.95)]
  }
})

```

## React Components

### Keep Components Dumb and Simple

Keep React components as simple and dumb as possible. All business logic and computations should happen in events and subscriptions. Components should only:

- Consume data through subscriptions
- Dispatch simple events directly on user actions
- Render UI based on subscription values

```typescript
// ✅ Good - dumb component that only subscribes and dispatches
function TodoItem({ todoId }) {
  const todo = useSubscription(['todos/by-id', todoId])
  const isEditing = useSubscription(['ui/is-edeting', todoId])

  return (
    <div>
      {isEditing ? (
        <input
          value={todo.text}
          onChange={(e) => dispatch(['todos/update-text', todoId, e.target.value])}
          onBlur={() => dispatch(['ui/stop-editing'])}
        />
      ) : (
        <span onClick={() => dispatch(['ui/start-editing', todoId])}>
          {todo.text}
        </span>
      )}
      <button onClick={() => dispatch(['todos/toggle', todoId])}>
        {todo.completed ? '✓' : '○'}
      </button>
    </div>
  )
}

// ❌ Avoid - component doing computations or complex logic
function TodoItem({ todoId }) {
  const allTodos = useSubscription(['todos/all'])
  const todo = allTodos.find(t => t.id === todoId)
  const isEditing = useSubscription(['ui/editing-todo-id']) === todoId

  // Computation should be in subscription or event
  const displayText = todo ? `${todo.text} (${todo.completed ? 'done' : 'pending'})` : 'Loading...'

  // Complex logic in handlers before dispatching
  const handleTextChange = (e) => {
    const newText = e.target.value.trim()
    if (newText.length > 100) {
      dispatch(['ui/show-error', 'Text too long!'])
      return
    }
    if (newText.includes('<script>')) {
      dispatch(['ui/show-error', 'Invalid characters!'])
      return
    }
    // Check for duplicates
    const duplicate = allTodos.find(t => t.id !== todoId && t.text === newText)
    if (duplicate) {
      dispatch(['ui/show-error', 'Todo already exists!'])
      return
    }
    dispatch(['todos/update-text', todoId, newText])
  }

  const handleToggle = () => {
    // Complex business logic in component
    const completedCount = allTodos.filter(t => t.completed).length
    const totalCount = allTodos.length
    if (!todo.completed && completedCount >= totalCount * 0.8) {
      dispatch(['ui/show-confirmation', 'Completing this will finish 80% of todos!'])
    }
    dispatch(['todos/toggle', todoId])
  }

  return (
    <div>
      <span>{displayText}</span>
      <button onClick={handleToggle}>
        {todo?.completed ? '✓' : '○'}
      </button>
      {/* Complex conditional logic should be simplified */}
    </div>
  )
}
```

### Co-locate Related Subscriptions

Keep subscriptions close to the components that use them:

```typescript
function TodoList() {
  const todos = useSubscription(['todos/filtered'])
  const loading = useSubscription(['ui/loading'])

  return (
    <div>
      {loading && <div>Loading...</div>}
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
}
```

### Use Multiple Small Components

Split large components to isolate re-renders:

```typescript
// ✅ Good - focused components
function TodoStats() {
  const total = useSubscription(['todos/count'])
  const completed = useSubscription(['todos/completed-count'])

  return (
    <div>
      {completed}/{total} completed
    </div>
  )
}

function TodoList() {
  const todos = useSubscription(['todos/filtered'])

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}
```

### Avoid Over-subscription

Don't subscribe to more data than you need:

```typescript
// ✅ Good - subscribe only to needed data
function TodoItem({ todoId }) {
  const todo = useSubscription(['todos/by-id', todoId])
  const isEditing = useSubscription(['ui/is-edeting'])

  // ...
}

// ❌ Avoid - subscribing to entire collection
function TodoItem({ todoId }) {
  const allTodos = useSubscription(['todos/all'])
  const todo = allTodos.find(t => t.id === todoId)
  const isEditing = useSubscription(['ui/is-edeting'])

  // ...
}
```


These practices will help you build maintainable, scalable applications with Reflex. Start with the basics and gradually adopt more advanced patterns as your application grows.

