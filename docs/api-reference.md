# API Reference

This page contains the complete API reference for Reflex, a reactive state management library inspired by ClojureScript's re-frame. All functions are exported from the main `@flexsurfer/reflex` package.

## Table of Contents

- [Database](#database)
- [Events](#events)
- [Subscriptions](#subscriptions)
- [Effects](#effects)
- [Co-effects](#co-effects)
- [Interceptors](#interceptors)
- [Tracing & Debugging](#tracing--debugging)
- [Hot Reloading](#hot-reloading)
- [Utilities](#utilities)
- [TypeScript Types](#typescript-types)

## Database

Functions for managing Reflex's single source of truth - the application database that holds your entire application state.

### initAppDb

```typescript
function initAppDb<T = Record<string, any>>(value: Db<T>): void
```

Initializes the global application database with the provided state object.

**Parameters:**
- `value`: The initial state object for your application

**Example:**
```typescript
import { initAppDb } from '@flexsurfer/reflex';

initAppDb({
  counter: 0,
  user: null,
  todos: []
});
```

### getAppDb

```typescript
function getAppDb<T = Record<string, any>>(): Db<T>
```

Returns the current application database state. Mainly used internally and for debugging.

**Returns:** The current application database state

## Events

Pure functions that process state transitions in response to dispatched events, forming the core of Reflex's event-driven architecture.

### regEvent

```typescript
function regEvent<T = Record<string, any>>(
  id: Id,
  handler: EventHandler<T>
): void

function regEvent<T = Record<string, any>>(
  id: Id,
  handler: EventHandler<T>,
  interceptors: Interceptor<T>[]
): void

function regEvent<T = Record<string, any>>(
  id: Id,
  handler: EventHandler<T>,
  cofx: [Id, ...any[]][]
): void

function regEvent<T = Record<string, any>>(
  id: Id,
  handler: EventHandler<T>,
  cofx: [Id, ...any[]][],
  interceptors: Interceptor<T>[]
): void
```

Registers an event handler that processes state transitions.

**Parameters:**
- `id`: Unique identifier for the event
- `handler`: Function that receives co-effects and returns effects
- `cofx` (optional): Array of co-effect specifications to inject
- `interceptors` (optional): Array of interceptors to apply

**Handler Function Signature:**
```typescript
(coeffects: CoEffects<T>, ...params: any[]) => Effects | void
```

**Examples:**
```typescript
import { regEvent, RANDOM, NOW } from '@flexsurfer/reflex';

// Simple state update
regEvent('increment', ({ draftDb }) => {
  draftDb.counter += 1;
});

// Event with parameters
regEvent('set-name', ({ draftDb }, name) => {
  draftDb.user.name = name;
});

// Event with side effects
regEvent('save-user', ({ draftDb }, user) => {
  draftDb.saving = true;
  return [
    ['http', {
      method: 'POST',
      url: '/api/users',
      body: user,
      onSuccess: ['save-user-success'],
      onFailure: ['save-user-error']
    }]
  ];
});

// Event with co-effects
regEvent('log-action',
  ({ draftDb, now, random }, action) => {
    draftDb.actionLog.push({
      action,
      timestamp: now,
      id: random.toString(36)
    });
  },
  [[NOW], [RANDOM]]
);
```

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

### dispatch

```typescript
function dispatch(event: EventVector): void
```

Dispatches an event to the event queue for asynchronous processing.

**Parameters:**
- `event`: An event vector where the first element is the event ID and subsequent elements are parameters

**Example:**
```typescript
import { dispatch } from '@flexsurfer/reflex';

dispatch(['increment']);
dispatch(['set-name', 'John Doe']);
dispatch(['update-todo', 123, { completed: true }]);
```

### regEventErrorHandler

```typescript
function regEventErrorHandler(handler: ErrorHandler): void
```

Registers a global error handler for unhandled exceptions in the event processing chain.
Only one handler can be registered. Registering a new handler clears the existing handler.

**Parameters:**
- `handler`: Error handler function

**Handler Function Signature:**
```typescript
(originalError: Error, reflexError: Error & { data: any }) => void
```

**Example:**
```typescript
import { regEventErrorHandler } from '@flexsurfer/reflex';

regEventErrorHandler((originalError, reflexError) => {
  console.error('Event processing error:', originalError);
  console.error('Reflex error data:', reflexError.data);
  // Send to error reporting service
});
```

### defaultErrorHandler

```typescript
function defaultErrorHandler(
  originalError: Error,
  reflexError: Error & { data: any }
): void
```

The default error handler that logs errors to console. Used automatically unless overridden.

## Subscriptions

Declarative queries that derive and reactively compute data from the application state, automatically updating components when dependencies change.

### regSub

```typescript
function regSub<R>(id: Id, computeFn?: ((...values: any[]) => R) | string, depsFn?: (...params: any[]) => SubVector[]): void
```

Registers a subscription that creates reactive queries against the application state.

**Parameters:**
- `id`: Unique identifier for the subscription
- `computeFn` (optional): Function that computes the subscription value, or a string field name for direct app database access (root subscriptions)
- `depsFn` (optional): Function that returns dependency subscription vectors

**String-based Subscriptions:**

When `computeFn` is provided as a string, it enables direct field access to the app database. This is the recommended approach for root subscriptions as it provides a clear, explicit way to access top-level fields from your database. The string should match a top-level key in your app database.

**Examples:**
```typescript
import { regSub } from '@flexsurfer/reflex';

// Recommended: String-based root subscriptions (explicit and clear)
regSub('user', 'user');
regSub('todos', 'todos');
regSub('userEmail', 'userEmail');

// Alternative: Simple root subscriptions (id only) - also valid
regSub('counter');
regSub('settings');

// Computed subscription with dependencies
regSub('user-name', (user) => user.name, () => [['user']]);

// Parameterized subscription
regSub('todo-by-id',
  (todos, id) => todos.find(todo => todo.id === id),
  () => [['todos']]
);

// Chained parameterized subscription
regSub('todo-text-by-id',
  (todo, _id) => todo.text,
  (id) => [['todo-by-id', id]]
);

// Computed subscription with multiple dependencies
regSub('user-display-name',
  (name, prefix) => `${prefix}: ${name}`,
  () => [['user-name'], ['display-prefix']]
);
```

### useSubscription

```typescript
function useSubscription<T>(subVector: SubVector, componentName?: string): T
```

React hook that subscribes to a subscription and returns its current value.

**Parameters:**
- `subVector`: Subscription vector where first element is subscription ID and rest are parameters
- `componentName` (optional): Name for debugging purposes

**Returns:** Current subscription value

**Examples:**
```typescript
import { useSubscription } from '@flexsurfer/reflex';

function Counter() {
  const counter = useSubscription<number>(['counter']);
  return <div>Count: {counter}</div>;
}

function UserProfile() {
  const name = useSubscription<string>(['user-name']);
  const todo = useSubscription(['todo-by-id', 123]);
  const todoText = useSubscription(['todo-text-by-id', 123]);

  return <div>{name}</div>;
}
```

### getSubscriptionValue

```typescript
function getSubscriptionValue<T>(subVector: SubVector): T
```

Gets the current value of a subscription without React hooks. Mainly used for testing and debugging.

**Parameters:**
- `subVector`: Subscription vector

**Returns:** Current subscription value

## Effects

Isolated handlers for side effects like HTTP requests, local storage, and navigation, keeping event handlers pure and testable.

### regEffect

```typescript
function regEffect(id: string, handler: EffectHandler): void
```

Registers an effect handler that performs side effects.

**Parameters:**
- `id`: Unique identifier for the effect
- `handler`: Function that performs the side effect

**Handler Function Signature:**
```typescript
(value: any) => void
```

**Examples:**
```typescript
import { regEffect } from '@flexsurfer/reflex';

// HTTP effect
regEffect('http', async (config) => {
  const response = await fetch(config.url, {
    method: config.method,
    body: JSON.stringify(config.body),
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.ok) {
    const data = await response.json();
    dispatch([config.onSuccess, data]);
  } else {
    dispatch([config.onFailure, response.status]);
  }
});

// Local storage effect
regEffect('local-storage', (config) => {
  localStorage.setItem(config.key, JSON.stringify(config.value));
});

// Navigation effect
regEffect('navigate', (path) => {
  window.history.pushState(null, '', path);
});
```

**Built-in Effect Constants:**

```typescript
const DISPATCH = 'dispatch'
const DISPATCH_LATER = 'dispatch-later'
```

Constants for built-in effect identifiers that handle event dispatching.

**Examples:**

```typescript
import { regEvent, DISPATCH, DISPATCH_LATER } from '@flexsurfer/reflex';

// Immediate dispatch after processing
regEvent('process-and-notify', ({ draftDb }) => {
  draftDb.processing = false;
  draftDb.lastProcessed = Date.now();

  return [
    [DISPATCH, ['show-notification', 'Processing complete']]
  ];
});

// Delayed dispatch for auto-save
regEvent('start-auto-save', ({ draftDb }) => {
  draftDb.autoSavePending = true;

  return [
    [DISPATCH_LATER, {
      event: ['perform-auto-save'],
      delay: 2000
    }]
  ];
});

// Multiple dispatches
regEvent('complex-workflow', ({ draftDb }, data) => {
  draftDb.workflow.status = 'processing';

  return [
    [DISPATCH, ['validate-data', data]],
    [DISPATCH_LATER, {
      event: ['process-data', data],
      delay: 100
    }],
    [DISPATCH_LATER, {
      event: ['cleanup-workflow'],
      delay: 5000
    }]
  ];
});
```

## Co-effects

Mechanisms for injecting external data like timestamps, random values, and results into event handlers.

### regCoeffect

```typescript
function regCoeffect(id: string, handler: CoEffectHandler): void
```

Registers a co-effect handler that injects external values into event handlers.

**Parameters:**
- `id`: Unique identifier for the co-effect
- `handler`: Function that injects the co-effect

**Handler Function Signature:**
```typescript
(coeffects: CoEffects<T>, value?: any) => CoEffects<T>
```

**Examples:**
```typescript
import { regCoeffect } from '@flexsurfer/reflex';

// Custom co-effects
regCoeffect('current-time', (coeffects) => ({
  ...coeffects,
  currentTime: Date.now()
}));

regCoeffect('random-uuid', (coeffects) => ({
  ...coeffects,
  uuid: crypto.randomUUID()
}));

regCoeffect('local-storage', (coeffects) => ({
  ...coeffects,
  localStorage: window.localStorage
}));
```

**Built-in Co-effect Constants:**

```typescript
const NOW = 'now'
const RANDOM = 'random'
```

Constants for built-in co-effect identifiers that inject timestamp and random values.

**Examples:**

```typescript
import { regEvent, NOW, RANDOM } from '@flexsurfer/reflex';

// Using NOW coeffect to inject current timestamp
regEvent('log-user-action', ({ draftDb, now }) => {
  draftDb.userActions.push({
    action: 'button-click',
    timestamp: now
  });
}, [[NOW]]);

// Using RANDOM coeffect to generate unique IDs
regEvent('create-new-item', ({ draftDb, random }) => {
  const newItem = {
    id: `item-${random}`,
    created: Date.now()
  };

  draftDb.items.push(newItem);
  draftDb.selectedItemId = newItem.id;
}, [[RANDOM]]);

// Using both NOW and RANDOM together
regEvent('generate-session-id', ({ draftDb, now, random }) => {
  draftDb.session = {
    id: `session-${now}-${random}`,
    startTime: now,
    active: true
  };
}, [[NOW], [RANDOM]]);
```

## Interceptors

Composable middleware that can transform event processing, enabling cross-cutting concerns like logging, validation, and error handling.

### regGlobalInterceptor

```typescript
function regGlobalInterceptor(interceptor: Interceptor): void
```

Registers a global interceptor that applies to all events.

**Parameters:**
- `interceptor`: Interceptor object with `id`, `before`, and/or `after` methods

**Example:**
```typescript
import { regGlobalInterceptor } from '@flexsurfer/reflex';

const loggingInterceptor = {
  id: 'logging',
  before: (context) => {
    console.log('Processing event:', context.coeffects.event);
    return context;
  },
  after: (context) => {
    console.log('Event completed, new DB:', context.coeffects.newDb);
    return context;
  }
};

regGlobalInterceptor(loggingInterceptor);
```

### getGlobalInterceptors

```typescript
function getGlobalInterceptors(): Interceptor[]
```

Returns all registered global interceptors.

### clearGlobalInterceptors

```typescript
function clearGlobalInterceptors(): void
function clearGlobalInterceptors(id: string): void
```

Clears all global interceptors or a specific one by ID.

**Parameters:**
- `id` (optional): Specific interceptor ID to clear

## Tracing & Debugging

Performance monitoring and debugging utilities that provide visibility into event processing, subscription updates, and system behavior.

### enableTracing

```typescript
function enableTracing(): void
```

Enables performance tracing for events, subscriptions, and effects.

### disableTracing

```typescript
function disableTracing(): void
```

Disables performance tracing.

### registerTraceCb

```typescript
function registerTraceCb(key: string, cb: TraceCallback): void
```

Registers a callback to receive trace data.

**Parameters:**
- `key`: Unique key for the callback
- `cb`: Callback function that receives trace data

**Callback Signature:**
```typescript
(traces: Trace[]) => void
```

**Example:**
```typescript
import { registerTraceCb, enableTracing } from '@flexsurfer/reflex';

enableTracing();

registerTraceCb('my-tracer', (traces) => {
  traces.forEach(trace => {
    console.log(`Operation: ${trace.operation}, Duration: ${trace.duration}ms`);
  });
});
```

### enableTracePrint

```typescript
function enableTracePrint(): void
```

Enables default console logging for trace data.

## Hot Reloading

Development-time utilities that enable seamless code updates without losing application state, improving the development experience.

### registerHotReloadCallback

```typescript
function registerHotReloadCallback(callback: HotReloadCallback): () => void
```

Registers a callback to be called when subscriptions are hot reloaded.

**Parameters:**
- `callback`: Function to call on hot reload

**Returns:** Function to unregister the callback

### triggerHotReload

```typescript
function triggerHotReload(): void
```

Manually triggers hot reload callbacks.

### clearHotReloadCallbacks

```typescript
function clearHotReloadCallbacks(): void
```

Clears all hot reload callbacks.

### useHotReload

```typescript
function useHotReload(): void
```

React hook that forces component re-render when subscriptions are hot reloaded.

**Example:**
```typescript
import { useHotReload } from '@flexsurfer/reflex';

function MyComponent() {
  useHotReload(); // Component will re-render on hot reload

  return <div>My component content</div>;
}
```

### useHotReloadKey

```typescript
function useHotReloadKey(): string
```

React hook that provides a key that changes when subscriptions are hot reloaded, forcing complete re-mount.

**Returns:** A unique key that changes on hot reload

**Example:**
```typescript
import { useHotReloadKey } from '@flexsurfer/reflex';

function MyComponent() {
  const key = useHotReloadKey();

  return (
    <div key={key}> {/* Forces complete re-mount on hot reload */}
      My component content
    </div>
  );
}
```

### setupSubsHotReload

```typescript
function setupSubsHotReload(): {
  dispose: () => void;
  accept: (newModule?: any) => void;
}
```

Utility for setting up hot reload in subscription modules.

**Returns:** Object with `dispose` and `accept` functions for HMR

**Example (in subscriptions module):**
```typescript
import { setupSubsHotReload } from '@flexsurfer/reflex';

// Register subscriptions
regSub('counter');

// Setup hot reload
const { dispose, accept } = setupSubsHotReload();

// In your build tool's HMR setup
if (import.meta.hot) {
  import.meta.hot.dispose(dispose);
  import.meta.hot.accept(accept);
}
```

### HotReloadWrapper

```typescript
function HotReloadWrapper(props: { children: React.ReactNode }): React.ReactNode
```

React component that wraps children with hot reload support.

**Props:**
- `children`: React children to wrap

**Example:**
```typescript
import { HotReloadWrapper } from '@flexsurfer/reflex';

function App() {
  return (
    <HotReloadWrapper>
      <MyAppContent />
    </HotReloadWrapper>
  );
}
```

## Utilities

Helper functions for common patterns like debouncing, throttling, and clearing handlers during testing and hot reloading.

### debounceAndDispatch

```typescript
function debounceAndDispatch(event: EventVector, durationMs: number): void
```

Dispatches an event after a delay, canceling any previous dispatch of the same event.

**Parameters:**
- `event`: Event vector to dispatch
- `durationMs`: Delay in milliseconds

**Example:**
```typescript
import { debounceAndDispatch } from '@flexsurfer/reflex';

// Debounce search input
function handleSearchInput(value: string) {
  debounceAndDispatch(['search', value], 300);
}
```

### throttleAndDispatch

```typescript
function throttleAndDispatch(event: EventVector, durationMs: number): void
```

Dispatches an event immediately, then ignores subsequent dispatches for the duration.

**Parameters:**
- `event`: Event vector to dispatch
- `durationMs`: Throttle duration in milliseconds

**Example:**
```typescript
import { throttleAndDispatch } from '@flexsurfer/reflex';

// Throttle window resize events
function handleResize() {
  throttleAndDispatch(['window-resized', window.innerWidth], 100);
}
```

### clearHandlers, clearReactions, clearSubs

```typescript
function clearHandlers(): void
function clearHandlers(kind: 'event' | 'fx' | 'cofx' | 'sub' | 'subDeps' | 'error'): void
function clearHandlers(kind: string, id: string): void

function clearReactions(): void
function clearReactions(id: string): void

function clearSubs(): void
```

Clears registered handlers and reactions. Mainly used for testing and hot reloading.

## TypeScript Types

TypeScript type definitions that provide compile-time safety and better developer experience when working with Reflex APIs.

### Core Types

```typescript
type Db<T = Record<string, any>> = T
type Id = string
type EventVector = [Id, ...any[]]
type SubVector = [Id, ...any[]]
type Effects = [string, any?][]
```

### Event Types

```typescript
type EventHandler<T = Record<string, any>> = (
  coeffects: CoEffects<T>,
  ...params: any[]
) => Effects | void

interface CoEffects<T = Record<string, any>> {
  event: EventVector
  draftDb: Draft<Db<T>>
  [key: string]: any
}

type ErrorHandler = (
  originalError: Error,
  reflexError: Error & { data: any }
) => void
```

### Subscription Types

```typescript
type SubHandler = (...values: any[]) => any
type SubDepsHandler = (...params: any[]) => SubVector[]
```

### Effect/Co-effect Types

```typescript
type EffectHandler = (value: any) => void
type CoEffectHandler<T = Record<string, any>> = (
  coeffects: CoEffects<T>,
  value?: any
) => CoEffects<T>
```

### Interceptor Types

```typescript
interface Interceptor<T = Record<string, any>> {
  id: string
  before?: (context: Context<T>) => Context<T>
  after?: (context: Context<T>) => Context<T>
  comment?: string
}

interface Context<T = Record<string, any>> {
  coeffects: CoEffects<T>
  effects: Effects
  newDb: Db<T>
  patches: any[]
  queue: Interceptor<T>[]
  stack: Interceptor<T>[]
  originalException: boolean
}
```

### Utility Types

```typescript
interface DispatchLaterEffect {
  ms: number
  dispatch: EventVector
}

interface Watcher<T> {
  callback: (v: T) => void
  componentName: string
}
```

## Error Handling

Reflex provides comprehensive error handling:

1. **Event Error Handler**: Catch exceptions in event processing chain
2. **Effect Error Handling**: Effects should handle their own errors
3. **Validation**: Invalid events, effects, and subscriptions are logged as warnings

## Performance Considerations

- **Subscriptions**: Automatically memoized and reactive
- **Events**: Processed asynchronously to prevent blocking
- **Tracing**: Can be enabled for performance monitoring
- **Debouncing/Throttling**: Built-in utilities for high-frequency events

## Migration Guide

### From Redux

```typescript
// Redux
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 }
  }
});

// Reflex
initAppDb({ counter: 0 });
regEvent('increment', ({ draftDb }) => {
  draftDb.counter += 1;
});
regSub('counter');
```

### From Zustand

```typescript
// Zustand
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}));

// Reflex
initAppDb({ count: 0 });
regEvent('increment', ({ draftDb }) => {
  draftDb.count += 1;
});
regSub('count');
```