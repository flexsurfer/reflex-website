# Reflex vs re-frame: Architectural Differences

While Reflex draws heavy inspiration from re-frame's proven architecture, there are key differences in how state management and reactivity work. This guide explains the architectural divergences and why they matter for JavaScript/TypeScript developers.

## Core Architecture Comparison

### State Management: Immer vs immutable cljs

**re-frame**: Uses ClojureScript's immutable data structures. Events return new db values:
```clojure
(reg-event-db
  :increment
  (fn [db [_]]
    (update db :counter inc)))
```

**Reflex**: Uses Immer for mutable drafts. Events mutate the draft and return effects:
```typescript
regEvent('increment', ({ draftDb }) => {
  draftDb.counter += 1
})
```

### Reactivity Model

**re-frame**: Database is inherently reactive. Any change triggers subscription recalculation:
```clojure
(reg-sub
  :counter
  (fn [db _]
    (:counter db)))
```

**Reflex**: Database is not reactive by default. Root subscriptions must be explicitly registered:
```typescript
regSub('counter', 'counter')
```

## Key Differences Explained

### 1. Database Reactivity

**re-frame**: The db atom is reactive. When you update it, all dependent subscriptions automatically recalculate.

**Reflex**: The db is a plain JavaScript object managed by Immer. Subscriptions only update when their dependencies change, but the db itself doesn't trigger reactivity. This provides better performance control.

### 2. Subscription Registration

**re-frame**: Subscriptions access the db directly and can compute derived data:
```clojure
(reg-sub
  :filtered-items
  (fn [db [_ filter-type]]
    (filter #(= (:type %) filter-type) (:items db))))
```

**Reflex**: Subscriptions don't have direct db access. Root subscriptions must be registered:
```typescript
// Root subscription - ID matches db key
regSub('counter', 'counter')

// Derived subscriptions can depend on other subscriptions
regSub('double-counter', 
       ( counter ) => counter * 2,
       () => [['counter']])
```

### 3. Event Signatures

**re-frame**: Events return the new db state. Effects are handled separately via `:fx`:
```clojure
(reg-event-fx
  :fetch-data
  (fn [{db :db} [_ id]]
    {:db (assoc db :loading true)
     :fx [[:http {:url "/api/data" :on-success [:data-loaded]}]]}))
```

**Reflex**: Events mutate the Immer draft and return effects directly:
```typescript
regEvent('fetch-data', ({ draftDb }, id) => {
  draftDb.loading = true
  return [
    ['http': {
      url: '/api/data',
      onSuccess: ['data-loaded']
    }]
  ]
})
```

## Migration Guide

### From re-frame to Reflex

1. **Replace immutable operations with mutations**:
   ```clojure
   ; re-frame
   (assoc db :key value)
   ```
   ```typescript
   // Reflex
   draftDb.key = value
   ```

2. **Register all root subscriptions explicitly**:
   ```clojure
   ; re-frame - implicit
   (:counter db)
   ```
   ```typescript
   // Reflex - explicit
   regSub('counter', 'counter')
   ```

3. **Move effects from `:fx` to return value**:
   ```clojure
   ; re-frame
   {:fx [[:dispatch [:event]]]}
   ```
   ```typescript
   // Reflex
   return [[DISPATCH, ['event']]] 
   ```

## Common Patterns

### Counter Example

**re-frame**:
```clojure
(reg-event-db :inc (fn [db] (update db :counter inc)))
(reg-event-db :dec (fn [db] (update db :counter dec)))
(reg-sub :counter (fn [db] (:counter db)))
```

**Reflex**:
```typescript
regEvent('inc', ({ draftDb }) => { draftDb.counter += 1 })
regEvent('dec', ({ draftDb }) => { draftDb.counter -= 1 })
regSub('counter', 'counter')
```

### Async Data Fetching

**re-frame**:
```clojure
(reg-event-fx
  :fetch-user
  (fn [_ [_ id]]
    {:http {:url (str "/users/" id)
            :on-success [:user-loaded]
            :on-failure [:fetch-failed]}}))
```

**Reflex**:
```typescript
regEvent('fetch-user', ({ draftDb }, id) => {
  return [
    ['http': {
      url: `/users/${id}`,
      onSuccess: ['user-loaded'],
      onFailure: ['fetch-failed']
    }]
  ]
})
```

## Need More Help?

- [API Reference](./api-reference.md) - Complete Reflex API documentation
- [Best Practices](./best-practices.md) - Recommended patterns for scalable apps
- [GitHub Repository](https://github.com/flexsurfer/reflex) - Source code and examples
