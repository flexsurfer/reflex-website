import { Highlight, themes } from 'prism-react-renderer'
import { useState } from 'react'
import { SectionHeader } from '../components/SectionHeader.jsx'

const tabs = {
  db: {
    label: 'Database',
    code: "// db.ts\nimport { initAppDb } from '@flexsurfer/reflex'\n\n// Type definitions\nexport interface Todo {\n  title: string\n  done: boolean\n}\n\nexport type Todos = Todo[]\n\nexport type Showing = 'all' | 'active' | 'done'\n\nexport interface DB {\n  todos: Todos\n  showing: Showing\n}\n\n// Initialize database with types\nconst defaultDB: DB = {\n  todos: [], // Array of todos\n  showing: 'all',\n}\n\ninitAppDb(defaultDB)",
  },
  events: {
    label: 'Events',
    code: "// events.ts\nimport { regEvent } from '@flexsurfer/reflex'\nimport { EVENT_IDS } from 'shared/event-ids'\nimport { EFFECT_IDS } from './effect-ids'\nimport type { Todo } from './db'\n\n// Fetch todos from API\nregEvent(EVENT_IDS.FETCH_TODOS, () => {\n  // Return effect: triggers side effects (like HTTP requests) that run after the event\n  // Effect function is defined in effects.ts under regEffect(EFFECT_IDS.FETCH, ...)\n  return [\n    [EFFECT_IDS.FETCH, {\n      url: '/api/todos',\n      onSuccess: [EVENT_IDS.LOAD_TODOS],\n      onFailure: [EVENT_IDS.FETCH_FAILED]\n    }]\n  ]\n})\n\n// Load todos from API response\nregEvent(EVENT_IDS.LOAD_TODOS, ({ draftDb }, todos: Todo[]) => {\n  // Mutate app db: changes to draftDb trigger subscriptions and re-render view if value changed\n  draftDb.todos = todos\n})\n\n// Handle fetch failure\nregEvent(EVENT_IDS.FETCH_FAILED, ({ draftDb }, error: string) => {\n  console.error('Failed to fetch todos:', error)\n  // Could set an error state in DB here\n})\n\n// Add new todo\nregEvent(EVENT_IDS.ADD_TODO, ({ draftDb }, title: string) => {\n  const newTodo: Todo = {\n    title: title.trim(),\n    done: false\n  }\n  draftDb.todos.push(newTodo)\n  return [\n    [EFFECT_IDS.FETCH, {\n      url: '/api/todos',\n      method: 'POST',\n      body: JSON.stringify(newTodo),\n      headers: { 'Content-Type': 'application/json' },\n      onSuccess: [EVENT_IDS.SAVE_TODO_SUCCESS],\n      onFailure: [EVENT_IDS.SAVE_TODO_FAILED]\n    }]\n  ]\n})\n\n// Handle successful todo save\nregEvent(EVENT_IDS.SAVE_TODO_SUCCESS, ({ draftDb }, savedTodo: Todo) => {\n  // Todo already added optimistically, could update with server response if needed\n  console.log('Todo saved successfully:', savedTodo)\n})\n\n// Handle save failure\nregEvent(EVENT_IDS.SAVE_TODO_FAILED, ({ draftDb }, error: string) => {\n  console.error('Failed to save todo:', error)\n  // Could remove the optimistically added todo or show error state\n})\n\n// Toggle todo completion\nregEvent(EVENT_IDS.TOGGLE_DONE, ({ draftDb }, title: string) => {\n  const todoIndex = draftDb.todos.findIndex(todo => todo.title === title)\n  if (todoIndex !== -1) {\n    draftDb.todos[todoIndex].done = !draftDb.todos[todoIndex].done\n  }\n})\n\n// Delete todo\nregEvent(EVENT_IDS.DELETE_TODO, ({ draftDb }, title: string) => {\n  draftDb.todos = draftDb.todos.filter(todo => todo.title !== title)\n})\n\n// Toggle all todos\nregEvent(EVENT_IDS.COMPLETE_ALL_TOGGLE, ({ draftDb }) => {\n  const allComplete = draftDb.todos.length > 0 && draftDb.todos.every(todo => todo.done)\n  draftDb.todos.forEach(todo => {\n    todo.done = !allComplete\n  })\n})\n\n// Set visibility filter\nregEvent(EVENT_IDS.SET_SHOWING, ({ draftDb }, showing: 'all' | 'active' | 'done') => {\n  draftDb.showing = showing\n})",
  },
  effects: {
    label: 'Effects',
    code: "// effects.ts\nimport { regEffect, dispatch } from '@flexsurfer/reflex'\nimport { EFFECT_IDS } from './effect-ids'\n\n// Fetch effect\nregEffect(EFFECT_IDS.FETCH, async ({ url, method = 'GET', body, headers, onSuccess, onFailure }) => {\n    try {\n        const response = await fetch(url, { method, body, headers })\n        if (!response.ok) {\n            throw new Error(`HTTP ${response.status}: ${response.statusText}`)\n        }\n        const data = await response.json()\n        if (onSuccess) {\n            dispatch(onSuccess.concat([data]))\n        }\n    } catch (error) {\n        console.error('HTTP request failed:', error)\n        if (onFailure) {\n            dispatch(onFailure.concat([error.message]))\n        }\n    }\n})",
  },
  subscriptions: {
    label: 'Subscriptions',
    code: "// subs.ts\nimport { regSub } from '@flexsurfer/reflex'\nimport { SUB_IDS } from './sub-ids'\nimport type { Todos, Showing } from './db'\n\n// Root subscriptions (directly from app state)\nregSub(SUB_IDS.TODOS, 'todos')  // Returns Todo[]\nregSub(SUB_IDS.SHOWING, 'showing')  // Returns 'all' | 'active' | 'done'\n\n// Computed subscriptions (derived data)\nregSub(SUB_IDS.VISIBLE_TODOS, (todos: Todos, showing: Showing) => {\n  if (!todos) return []\n  switch (showing) {\n    case 'active':\n      return todos.filter(todo => !todo.done)\n    case 'done':\n      return todos.filter(todo => todo.done)\n    default:\n      return todos\n  }\n}, () => [[SUB_IDS.TODOS], [SUB_IDS.SHOWING]])\n\nregSub(SUB_IDS.ALL_COMPLETE, (todos: Todos) => {\n  return todos.length > 0 && todos.every(todo => todo.done)\n}, () => [[SUB_IDS.TODOS]])",
  },
  view: {
    label: 'View',
    code: "// views.tsx\nimport React, { useEffect } from 'react'\nimport { useSubscription, dispatch } from '@flexsurfer/reflex'\nimport { EVENT_IDS } from 'shared/event-ids'\nimport { SUB_IDS } from './sub-ids'\nimport type { Todo } from './db'\n\n// Main Todo App Component\nexport const TodoApp: React.FC = () => {\n  const visibleTodos = useSubscription<Todo[]>([SUB_IDS.VISIBLE_TODOS])\n  const allComplete = useSubscription<boolean>([SUB_IDS.ALL_COMPLETE])\n\n  // Fetch todos on component mount\n  useEffect(() => {\n    dispatch([EVENT_IDS.FETCH_TODOS])\n  }, [])\n\n  return (\n    \u003csection className=\"todoapp\"\u003e\n      \u003cheader className=\"header\"\u003e\n        \u003ch1\u003etodos\u003c/h1\u003e\n        \u003cinput\n          className=\"new-todo\"\n          placeholder=\"What needs to be done?\"\n          onKeyDown={(e) => {\n            if (e.key === 'Enter') {\n              const title = (e.target as HTMLInputElement).value.trim()\n              if (title) {\n                dispatch([EVENT_IDS.ADD_TODO, title])\n                ;(e.target as HTMLInputElement).value = ''\n              }\n            }\n          }}\n        /\u003e\n      \u003c/header\u003e\n\n      \u003csection className=\"main\"\u003e\n        \u003cinput\n          id=\"toggle-all\"\n          className=\"toggle-all\"\n          type=\"checkbox\"\n          checked={allComplete}\n          onChange={() => dispatch([EVENT_IDS.COMPLETE_ALL_TOGGLE])}\n        /\u003e\n        \u003clabel htmlFor=\"toggle-all\"\u003eMark all as complete\u003c/label\u003e\n        \u003cul className=\"todo-list\"\u003e\n          {visibleTodos.map(todo => (\n            \u003cli key={todo.title}\u003e\n              \u003cdiv className=\"view\"\u003e\n                \u003cinput\n                  className=\"toggle\"\n                  type=\"checkbox\"\n                  checked={todo.done}\n                  onChange={() => dispatch([EVENT_IDS.TOGGLE_DONE, todo.title])}\n                /\u003e\n                \u003clabel\u003e{todo.title}\u003c/label\u003e\n                \u003cbutton\n                  className=\"destroy\"\n                  onClick={() => dispatch([EVENT_IDS.DELETE_TODO, todo.title])}\n                /\u003e\n              \u003c/div\u003e\n            \u003c/li\u003e\n          ))}\n        \u003c/ul\u003e\n      \u003c/section\u003e\n    \u003c/section\u003e\n  )\n}",
  },
}

export function CodeShowcase() {
  const [activeTab, setActiveTab] = useState('db')

  return (
    <section className="section" id="code">
      <SectionHeader
        eyebrow="Show me the code"
        title="A TodoMVC app in 5 building blocks."
        subtitle="Real-world implementation with HTTP API persistence and proper TypeScript types."
      />

      <div className="code-showcase">
        <div className="code-tabs">
          {Object.entries(tabs).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              className={`code-tab ${activeTab === key ? 'code-tab--active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="code-block">
          <span className="code-block__label">{tabs[activeTab].label}</span>
          <Highlight
            theme={themes.vsDark}
            code={tabs[activeTab].code}
            language="typescript"
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre style={{ ...style, background: 'transparent', padding: '0', margin: '0', fontSize: '0.95rem' }} className={className}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </div>
    </section>
  )
}
