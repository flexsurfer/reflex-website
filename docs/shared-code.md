# Shared Code

Reflex enables powerful cross-platform applications by separating **business logic** from **platform-specific effects**. Events and subscriptions remain identical across platforms, while effects handle platform differences - enabling up to 90%+ code sharing.

## The Power of Effects

Effects isolate platform-specific code, allowing your core business logic to remain pure and platform-agnostic. The same events and subscriptions work seamlessly across web, mobile, desktop, and more.

### Platform-Specific Effects

```typescript
// Mobile (React Native)
regEffect('LOCAL_STORAGE_SET', async ({ key, value }) => {
  await AsyncStorage.setItem(key, JSON.stringify(value))
})

regEffect('CONFIRM_DIALOG', ({ message }) => {
  Alert.alert('Confirm', message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'OK', onPress: () => dispatch(['CONFIRMED']) }
  ])
})

// Web (Browser)
regEffect('LOCAL_STORAGE_SET', ({ key, value }) => {
  localStorage.setItem(key, JSON.stringify(value))
})

regEffect('CONFIRM_DIALOG', ({ message }) => {
  if (window.confirm(message)) {
    dispatch(['CONFIRMED'])
  }
})
```

### Shared Business Logic

```typescript
// This event works identically across all platforms
regEvent('SAVE_USER_PREFERENCES', ({ draftDb }, preferences) => {
  draftDb.userPreferences = preferences
  return [
    ['LOCAL_STORAGE_SET', { key: 'userPreferences', value: preferences }],
    ['SHOW_SUCCESS_MESSAGE', { message: 'Preferences saved!' }]
  ]
})

// This subscription works identically across all platforms
regSub('USER_PREFERENCES', (userPreferences) => userPreferences)
```

## Real-World Example: Einbürgerungstest

The [Einbürgerungstest app](https://github.com/flexsurfer/einburgerungstest) demonstrates extreme code sharing across web and mobile platforms with Reflex.

### Shared Events (100% Reusable)

```typescript
// packages/shared/src/events.js - Works on both web and mobile
regEvent(EVENT_IDS.ANSWER_QUESTION, ({ draftDb }, questionIndex, answer) => {
  draftDb.userAnswers[questionIndex] = answer
  return [[EFFECT_IDS.LOCAL_STORAGE_SET, {
    key: 'userAnswers',
    value: draftDb.userAnswers
  }]]
})

regEvent(EVENT_IDS.SET_SELECTED_CATEGORY, ({ draftDb }, category) => {
  draftDb.selectedCategory = category
  draftDb.currentQuestionIndex = 0

  return [
    [EFFECT_IDS.SCROLL_TO_TOP],
    [EFFECT_IDS.LOCAL_STORAGE_SET, { key: 'selectedCategory', value: category }],
    [EFFECT_IDS.LOCAL_STORAGE_SET, { key: 'currentQuestionIndex', value: 0 }]
  ]
})
```

### Platform-Specific Effects

**Mobile Implementation:**
```typescript
// app/mobile/src/effects.ts
regEffect(EFFECT_IDS.LOCAL_STORAGE_SET, async ({ key, value }) => {
  await AsyncStorage.setItem(key, JSON.stringify(value))
})

regEffect(EFFECT_IDS.SCROLL_TO_TOP, () => {
  questionListRef.current?.scrollToOffset({ animated: true, offset: 0 })
})

regEffect(EFFECT_IDS.CONFIRM_CLEAR, () => {
  Alert.alert('Clear progress', 'Are you sure?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'OK', onPress: () => dispatch([EVENT_IDS.CLEAR_ANSWERS]) }
  ])
})
```

**Web Implementation:**
```typescript
// app/web/src/effects.js
regEffect(EFFECT_IDS.LOCAL_STORAGE_SET, ({ key, value }) => {
  localStorage.setItem(key, JSON.stringify(value))
})

regEffect(EFFECT_IDS.SCROLL_TO_TOP, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

regEffect(EFFECT_IDS.CONFIRM_CLEAR, () => {
  if (window.confirm("Are you sure you want to clear ALL your progress?")) {
    dispatch([EVENT_IDS.CLEAR_ANSWERS])
  }
})
```

### Shared Subscriptions (100% Reusable)

```typescript
// packages/shared/src/subs.js - Works on both web and mobile
regSub('FILTERED_QUESTIONS', (questions, selectedCategory, favorites) => {
  if (!selectedCategory || selectedCategory === 'all') {
    return questions
  }

  if (selectedCategory === 'favorites') {
    return questions.filter(q => favorites.includes(q.globalIndex))
  }

  return questions.filter(q => q.category === selectedCategory)
})

regSub('STATISTICS', (filteredQuestions, userAnswers) => {
  const total = filteredQuestions.length
  const answered = Object.keys(userAnswers).length
  const correct = filteredQuestions.filter(q =>
    userAnswers[q.globalIndex] === q.correct
  ).length

  return {
    correct,
    incorrect: answered - correct,
    totalAnswered: answered,
    totalVisible: total,
    accuracy: total > 0 ? Math.round((correct / answered) * 100) : 0
  }
})
```

## Code Sharing Metrics

The Einbürgerungstest achieves **90%+ code reuse** across platforms:

- **Events**: 100% shared (2,000+ lines)
- **Subscriptions**: 100% shared (500+ lines)
- **Business Logic**: 100% shared
- **UI Components**: 70% shared with platform-specific adaptations
- **Effects**: Platform-specific implementations

## Architecture Benefits

### 1. **Single Source of Truth**
Business logic lives in one place, ensuring consistency across platforms.

### 2. **Platform Independence**
Add new platforms (desktop, TV, etc.) without changing core logic.

### 3. **Easier Testing**
Test business logic once, test platform effects separately.

### 4. **Team Specialization**
Different teams can work on different platform effects while sharing core logic.

### 5. **Future-Proof**
Platform APIs change, but your business logic remains stable.

## Implementation Pattern

```typescript
// 1. Define shared event IDs and effect IDs
export const EVENT_IDS = {
  SAVE_DATA: 'save-data',
  LOAD_DATA: 'load-data'
}

export const EFFECT_IDS = {
  STORAGE_SAVE: 'storage-save',
  STORAGE_LOAD: 'storage-load'
}

// 2. Implement shared events
regEvent(EVENT_IDS.SAVE_DATA, ({ draftDb }, data) => {
  draftDb.data = data
  return [[EFFECT_IDS.STORAGE_SAVE, { key: 'app-data', value: data }]]
})

// 3. Implement platform-specific effects
// Mobile: AsyncStorage
// Web: localStorage
// Desktop: File system
// Cloud: API calls

// 4. Import shared events in each platform
import './shared/events'
```

## Beyond Web/Mobile

Effects enable Reflex to target any platform:

```typescript
// Desktop effects
regEffect('FILE_SAVE', async ({ path, content }) => {
  await fs.writeFile(path, content)
})

// Server effects
regEffect('DATABASE_SAVE', async ({ table, data }) => {
  await db.table(table).insert(data)
})

// IoT effects
regEffect('HARDWARE_CONTROL', ({ device, command }) => {
  hardwareApi.send(device, command)
})
```

Reflex's effect system makes cross-platform development not just possible, but elegant and maintainable. Your business logic stays pure and platform-agnostic, while effects handle the messy details of platform integration.
