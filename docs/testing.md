# Testing

Reflex makes testing straightforward and powerful because **events have predictable, deterministic behavior**. While not strictly pure functions, events are designed for testability with isolated, replayable execution that catches bugs early and gives you confidence in your code.

## Why Events Make Testing Effective

In Reflex, events are designed for testability:
- **Deterministic behavior**: Given the same inputs, events always produce the same state changes and effects
- **Isolated execution**: No external side effects (HTTP calls, DOM manipulation, etc.) during state transitions
- **Contained mutations**: State changes happen within Immer's draft proxy, producing predictable immutable results
- **Direct testability**: Events can be tested in complete isolation without complex setup

This design enables every event to be tested like a mathematical function: given specific inputs, it should produce specific outputs.

## Testing Events

Events are tested by directly calling the event handler with mock state and verifying both the state mutations and returned effects.

```typescript
describe('Event Handlers', () => {
  it('should handle toggleShowAnswers event', () => {
    const handler = getHandler('event', EVENT_IDS.TOGGLE_SHOW_ANSWERS)

    const initialState = {
      showAnswers: false
    }

    const coeffects = {
      draftDb: initialState
    }

    const result = handler(coeffects)

    expect(initialState.showAnswers).toBe(true)  // State mutated as expected
    expect(result).toBeUndefined()                // No effects returned
  })
})
```

## Testing Subscriptions

Subscriptions are pure functions that transform state into derived data. Test them by calling the subscription handler directly with mock data.

```typescript
describe('Subscription Handlers', () => {
  it('should handle filteredQuestions subscription - filter by category', () => {
    const handler = getHandler('sub', SUB_IDS.FILTERED_QUESTIONS)

    const questions = [
      { globalIndex: 1, category: 'Politik', question: 'Q1?' },
      { globalIndex: 2, category: 'Geschichte', question: 'Q2?' },
      { globalIndex: 3, category: 'Politik', question: 'Q3?' }
    ]
    const selectedCategory = 'Politik'
    const favorites = [1]

    const result = handler(questions, selectedCategory, favorites)

    expect(result).toEqual([
      { globalIndex: 1, category: 'Politik', question: 'Q1?' },
      { globalIndex: 3, category: 'Politik', question: 'Q3?' }
    ])
  })
})
```

## Real-World Examples

The [Einbürgerungstest app](https://github.com/flexsurfer/einburgerungstest/tree/main/packages/shared/test) demonstrates comprehensive testing in a production React Native app:

### Event Testing
```typescript
it('should handle answerQuestion event', () => {
  const handler = getHandler('event', EVENT_IDS.ANSWER_QUESTION)

  const initialState = {
    userAnswers: { 1: 0 }
  }

  const draftDb = createDraft(initialState)
  const coeffects = { draftDb: draftDb }

  const result = handler(coeffects, 2, 1)

  expect(draftDb.userAnswers[2]).toBe(1)
  expect(result).toEqual([[EFFECT_IDS.LOCAL_STORAGE_SET, {
    key: 'userAnswers',
    value: { 1: 0, 2: 1 }
  }]])
})
```

### Subscription Testing
```typescript
it('should handle statistics subscription - with answers', () => {
  const handler = getHandler('sub', SUB_IDS.STATISTICS)

  const userAnswers = { 1: 0, 2: 1, 3: 2 } // 1 correct, 2 incorrect
  const filteredQuestions = [
    { globalIndex: 1, correct: 0 }, // correct
    { globalIndex: 2, correct: 0 }, // incorrect
    { globalIndex: 3, correct: 1 }, // incorrect
    { globalIndex: 4, correct: 0 }  // not answered
  ]

  const result = handler(filteredQuestions, userAnswers, {}, null)

  expect(result).toEqual({
    correct: 1,
    incorrect: 2,
    totalAnswered: 3,
    totalVisible: 4,
    accuracy: '33.3',
    passed: false
  })
})
```

## Testing Benefits

### 1. **Predictable & Deterministic**
Every test run produces the same results. No flakiness from timing, network, or external state.

### 2. **Fast & Isolated**
Tests run instantly without setting up databases, servers, or complex component hierarchies.

### 3. **Complete Coverage**
Test every business rule, state transition, and effect independently.

### 4. **Early Bug Detection**
Pure functions fail fast and clearly when logic is wrong.

### 5. **Refactoring Confidence**
Change internal implementations knowing tests will catch any behavioral changes.

### 6. **Documentation**
Tests serve as living documentation of expected behavior.

## Testing Strategy

1. **Unit Test All Events**: Every event handler should have comprehensive test coverage
2. **Unit Test All Subscriptions**: Every derived data computation should be tested
3. **Test State Transitions**: Verify that events mutate state correctly
4. **Test Effects**: Ensure events return the correct effects
5. **Test Edge Cases**: Empty states, error conditions, boundary values
6. **Integration Test Dispatch Chain**: Test that dispatching events updates subscriptions correctly

## Testing Utilities

Reflex provides comprehensive testing utilities for isolated, reliable testing:

### Handler Access

```typescript
import { getHandler } from '@flexsurfer/reflex'

// Get event handler
const eventHandler = getHandler('event', EVENT_ID)

// Get subscription handler
const subHandler = getHandler('sub', SUB_ID)

// Get effect handler
const effectHandler = getHandler('fx', EFFECT_ID)

// Get coeffect handler
const cofxHandler = getHandler('cofx', COFX_ID)
```

### State Management

```typescript
import { initAppDb, getAppDb } from '@flexsurfer/reflex'

// Initialize app state for testing
initAppDb({
  counter: 0,
  items: [],
  user: { name: 'Test User' }
})

// Get current app state
const currentState = getAppDb()
expect(currentState.counter).toBe(0)
```

### Cleanup Between Tests

```typescript
import {
  clearHandlers,
  clearReactions,
  clearSubs,
  clearGlobalInterceptors
} from '@flexsurfer/reflex'

// Clear all handlers between tests
clearHandlers()

// Clear specific handler type
clearHandlers('event')  // Clear only events
clearHandlers('event', 'my-event-id')  // Clear specific event

// Clear reactions
clearReactions()

// Clear subscriptions and their reactions
clearSubs()

// Clear global interceptors
clearGlobalInterceptors()
```

### Debug Control

```typescript
import { setDebugEnabled, isDebugEnabled } from '@flexsurfer/reflex'

// Disable debug logging in tests
setDebugEnabled(false)

// Check debug status
expect(isDebugEnabled()).toBe(false)
```

### Test Setup Pattern

```typescript
import {
  initAppDb,
  clearHandlers,
  clearGlobalInterceptors,
  setDebugEnabled,
  dispatch,
  getAppDb
} from '@flexsurfer/reflex'

// Import your event modules to register handlers
import './events'

describe('My Events', () => {
  beforeEach(() => {
    // Reset app state
    initAppDb({ counter: 0, items: [] })
  })

  it('should increment counter', async () => {
    dispatch(['increment'])
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(getAppDb().counter).toBe(1)
  })
})
```

## Comparison to Traditional Testing

| Aspect | Traditional React Testing | Reflex Testing |
|--------|--------------------------|----------------|
| **Setup** | Mock components, providers, hooks | Direct handler testing |
| **Speed** | Slow (DOM rendering, async operations) | Instant (deterministic functions) |
| **Reliability** | Flaky (timing, external dependencies) | Deterministic (no external dependencies) |
| **Coverage** | Hard to test business logic in isolation | Complete logic isolation |
| **Maintenance** | Brittle (component structure changes) | Stable (logic doesn't change with UI) |

Reflex testing gives you the same confidence as testing pure functions in functional programming - events provide deterministic, isolated behavior that enables reliable testing.
