# Reflex Documentation

Welcome to the Reflex documentation! **The wait is over. Re-frame's power, now in JavaScript.**

In 2014, re-frame set a new standard for state management: events, effects, subscriptions, and architectural clarity. For years, JavaScript developers tried to recreate it with Redux, Immutable.js, and endless middleware - but never quite got there. Now the day has come. Reflex brings the full strength of a battle-tested architecture to React and TypeScript - complete, cohesive, and ready for real-world apps.

## Why Reflex?

Reflex unifies a single store, an event pipeline, reactive subscriptions, and declarative effects into one cohesive model. The result: predictable code, fewer edge cases, and faster debugging.

### Key Features

- **Predictable events**: All state transitions run through pure events and interceptors, giving you replayable, inspectable updates. Business logic stays pure; effects are explicit. That makes behavior auditable and testable at scale.
- **Composable architecture**: Grow features by composing events, subscriptions, and effects. Patterns stay local, predictable and scale gracefully as complexity rises.
- **Reactive subscriptions**: Express derived data declaratively. React components re-render only when their data changes.
- **AI Friendly**: Reviewing AI-generated changes is easier because all logic is expressed through pure, isolated functions, making each change understandable, verifiable, and deterministic.

## How it works

Reflex keeps your mental model simple: dispatch events, intercept them, update state, and let subscriptions feed your UI.

### Core loop

1. **Initialize your app db**: Define the single source of truth once via initAppDb. Everything else queries or transforms the db.
2. **Register events**: Events are pure reducers that optionally return side effects. They run through interceptors before mutating the draft db.
3. **Register and use subscriptions**: Subscriptions describe the data graph. Components use a hook useSubscription to react to changes.
4. **Dispatch and render**: Dispatch events from anywhere in your app. React Native or web consume the same state layer.

### Architecture pillars

- **Interceptors**: Compose cross-cutting concerns like logging, tracing, permissions, or async coordination around events.
- **Effects & Co-effects**: Isolate side effects so reducers remain pure. Inject anything from HTTP to device APIs without polluting event logic.
- **Devtools**: Time-travel, event history, and subscription graphs. Reflex Devtools gives end-to-end visibility.

## Try It Out

Get a taste of Reflex in minutes:

```bash
npm install @flexsurfer/reflex
```

First, set up your state management:

```typescript
import { initAppDb, regEvent, regSub } from '@flexsurfer/reflex'

initAppDb({ counter: 0 })
regEvent('increment', ({ draftDb }) => {
  draftDb.counter += 1
})
regSub('counter')
```

Then use it in your React components:

```typescript
import { useSubscription, dispatch } from '@flexsurfer/reflex'

function Counter() {
  const count = useSubscription(["counter"])
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(["increment"])}>
        Increment
      </button>
    </div>
  )
}
```

## Documentation Sections

- **[Quick Start](./quick-start.md)**: Step-by-step installation and setup guide with real-world TodoMVC example
- **[Reflex vs Redux/Zustand](./redux-zustand-comparison.md)**: Comprehensive comparison with popular state management solutions
- **[Reflex vs re-frame](./re-frame-comparison.md)**: Key architectural differences and migration guide from re-frame
- **[Testing](./testing.md)**: Why Reflex is so effective for testing - pure events enable predictable, replayable tests
- **[Shared Code](./shared-code.md)**: Cross-platform development with effects - up to 90%+ code reuse across platforms
- **[Best Practices](./best-practices.md)**: Recommended patterns and conventions for scalable apps
- **[API Reference](./api-reference.md)**: Complete API documentation with TypeScript types
- **[FAQ](./faq.md)**: Common questions and troubleshooting

## Need Help?

- [GitHub Repository](https://github.com/flexsurfer/reflex)
- [Issues & Discussions](https://github.com/flexsurfer/reflex/issues)

