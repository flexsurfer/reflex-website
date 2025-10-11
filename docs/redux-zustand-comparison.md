# Reflex vs Redux/Zustand: A Comprehensive Comparison

This guide compares Reflex with popular state management solutions like Redux and Zustand, highlighting architectural differences.

## Comparison Table

|  | **Redux / Zustand** | **Reflex** |  |
|------------|----------------|--------|----------------|
| **Type / Role** | Libraries providing low-level primitives for state management — architecture must be assembled manually | Complete framework with opinionated patterns and conventions | **Framework:** predefined architecture eliminates decision fatigue, enforces consistency, and provides scalable, battle-tested patterns |
| **Architecture Clarity** | Redux: Complex action/reducer/middleware layers. Zustand: Simple but unstructured for large apps | Event-driven architecture with explicit separation of events, state updates, and effects | **Unified mental model:** single event→effect→subscription pipeline simplifies reasoning and maintenance in large systems |
| **State Derivation / Selectors** | Redux: Reselect for memoized selectors. Zustand: Manual selector functions | Reactive subscriptions with automatic dependency tracking | **Declarative data flow:** dependencies tracked automatically; no manual selector logic or stale closure issues common in hook-based stores |
| **Side-effects Handling** | Redux: Middleware (thunks/sagas) mixes effects with business logic. Zustand: Inline or custom middleware | Pure events return effects as declarative data structures | **Pure business logic:** events stay pure, effects are explicit and testable; tooling can visualize and validate effect flow |
| **Reactive Updates** | Redux: connect/selectors trigger re-renders. Zustand: Manual subscription control | Built-in reactive subscription system | **Automatic granularity:** reactivity graph ensures updates only when subscribed data changes — no manual optimization required |
| **Debuggability / Traceability** | Redux: DevTools track actions/state diffs. Zustand: Limited devtools | Built-in event tracing, db snapshots, and live dependency visualization (via Reflex DevTools) | **Full-system X-ray:** Reflex DevTools expose every event, effect, and reactive subscription in real time — allowing total control over application behavior, state flow, and even performance profiling |
| **Testing / Reproducibility** | Redux: Reducers are testable, but async and effects complicate tests. Zustand: unit tests only | Pure events and declarative effects allow full replay and snapshot testing | **Deterministic replay:** event logs reproduce complete app state, simplifying regression and snapshot testing |
| **Scalability of Architecture** | Redux: Scales with conventions and discipline. Zustand: Not structured for large teams | Composable interceptors and modular event/effect layers scale predictably | **Team scaling:** consistent patterns and guardrails reduce cognitive load and architectural drift in large teams |
| **Language Safety / Immutability** | Redux: Optional Immer or Immutable.js; mutable risk in plain JS. Zustand: Mutable by default | Immer ensures structural sharing and type-safe mutations | **Type-safe immutability:** compile-time safety with ergonomic mutation syntax and performance-efficient state updates |

## Key Architectural Differences

### Event-Driven vs Store-Centric

**Redux/Zustand**: Focus on store mutations and selectors. Business logic is scattered across actions, reducers, and middleware.

**Reflex**: All state changes flow through events. Events are pure functions that mutate drafts and return effects as data.

```typescript
// Redux with thunk
const fetchUser = (id) => async (dispatch) => {
  dispatch({ type: 'FETCH_START' })
  try {
    const user = await api.getUser(id)
    dispatch({ type: 'FETCH_SUCCESS', payload: user })
  } catch (error) {
    dispatch({ type: 'FETCH_ERROR', error })
  }
}

// Zustand with async actions
const useStore = create((set, get) => ({
  user: null,
  loading: false,
  fetchUser: async (id) => {
    set({ loading: true })
    try {
      const user = await api.getUser(id)
      set({ user, loading: false })
    } catch (error) {
      set({ error, loading: false })
    }
  }
}))

// Reflex
regEvent('fetch-user', ({ draftDb }, id) => {
  draftDb.loading = true
  return [
    ['http', {
      url: `/users/${id}`,
      onSuccess: ['user-loaded'],
      onFailure: ['fetch-failed']
    }]
  ]
})
```

### Reactive Subscriptions vs Manual Selectors

**Redux/Zustand**: Components subscribe to store changes and use selectors to derive data.

**Reflex**: Components declare data dependencies through subscriptions. The system automatically tracks dependencies and optimizes updates.

```typescript
// Redux with reselect
const selectFilteredItems = createSelector(
  state => state.items,
  state => state.filter,
  (items, filter) => items.filter(item => item.type === filter)
)

// Zustand with selectors
const useStore = create((set, get) => ({
  items: [],
  filter: 'all',
  filteredItems: () => {
    const { items, filter } = get()
    return items.filter(item => item.type === filter)
  }
}))

// Reflex
regSub('filtered-items',
  (items, filter) => items.filter(item => item.type === filter),
  () => [['items'], ['filter']]
)
```

### Effects as Data vs Inline Logic

**Redux/Zustand**: Async logic mixed with business logic through middleware.

**Reflex**: Effects are pure data structures returned from events, enabling better composition and testing.

## Need More Help?

- [Quick Start](./quick-start.md) - Get started with Reflex in minutes
- [Best Practices](./best-practices.md) - Learn scalable patterns
- [API Reference](./api-reference.md) - Complete API documentation
- [GitHub Repository](https://github.com/flexsurfer/reflex) - Examples and source code
