# Reflex DevTools

**Real-time debugging and inspection for Reflex applications**

## What is Reflex DevTools?

Reflex DevTools is a powerful debugging toolkit for applications built with the [`@flexsurfer/reflex`](https://github.com/flexsurfer/reflex) library. It provides real-time inspection of your application's state, events, and traces through an intuitive web-based dashboard.

### Key Features

- **📊 Database State Inspection** - Visualize your entire application state in real-time
- **🔄 Real-time Event Tracing** - Watch events and state changes as they happen
- **🔥 Real-time Reactions and Render Tracing** - Watch all reactions being created and run, and rendering processes
- **⏱ Performance Profiling** - Analyze events and reactions times and bottlenecks in real-time
- **🤖 AI-Powered Debugging** - MCP integration enables AI assistants like Claude or Cursor to inspect traces and dispatch events
- **🎨 Beautiful Dashboard** - Clean, modern UI with dark/light theme support
- **📱 React & React Native Support** - Works seamlessly with both platforms
- **⚡ Zero Configuration** - Get started with just two lines of code

---

## Quick Start

### Installation

```bash
npm install --save-dev @flexsurfer/reflex-devtools
# or
yarn add -D @flexsurfer/reflex-devtools
# or
pnpm add -D @flexsurfer/reflex-devtools
```

### 1. Enable in Your App

Add these lines to your app's entry point (e.g., `main.tsx` or `App.tsx`):

```typescript
import { enableTracing } from '@flexsurfer/reflex';
import { enableDevtools } from '@flexsurfer/reflex-devtools';

// Enable tracing for Reflex events
enableTracing();

// Connect to devtools server
enableDevtools({
  serverUrl: 'localhost:4000' // Optional: defaults to localhost:4000
});
```

### 2. Start the DevTools Server

```bash
npx reflex-devtools
```

Or with custom configuration:

```bash
npx reflex-devtools --port 3000 --host 0.0.0.0
```

### 3. Open the Dashboard

Navigate to `http://localhost:4000` in your browser to see the DevTools dashboard.

---

## Usage Examples

### Basic Setup

```typescript
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { enableTracing } from '@flexsurfer/reflex';
import { enableDevtools } from '@flexsurfer/reflex-devtools';
import App from './App';

enableTracing();
enableDevtools();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Custom Configuration

```typescript
enableDevtools({
  serverUrl: 'localhost:3001',
  enabled: process.env.NODE_ENV === 'development'
});
```

---

## AI-Powered Debugging with MCP

Reflex DevTools now supports the [Model Context Protocol (MCP)](https://modelcontextprotocol.io), enabling AI assistants like Claude and Cursor to directly inspect your application traces and dispatch events!

### Quick Setup

1. **Install the MCP server:**
   ```bash
   npm install -g @flexsurfer/reflex-devtools-mcp
   ```

2. **Start DevTools server with MCP support:**
   ```bash
   npx reflex-devtools --mcp
   ```
   **Important:** The `--mcp` flag enables trace storage. Without it, MCP will not work.

3. **Configure your AI client:**

   **For Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "reflex-devtools": {
         "command": "npx",
         "args": ["reflex-devtools-mcp"],
         "env": {}
       }
     }
   }
   ```

   **For Cursor IDE** (Cursor Settings → `settings.json`):
   ```json
   {
     "mcp.servers": {
       "reflex-devtools": {
         "command": "npx",
         "args": ["reflex-devtools-mcp"],
         "env": {}
       }
     }
   }
   ```

4. **Restart your AI client** and ask questions like:
   - "What's the current app state and what user actions led to this state?"
   - "Navigate to the user profile page and select the first item in the list"
   - "Find slow event handlers that take longer than 100ms to execute"
   - "Show me active subscriptions that might be causing unnecessary re-renders"

📚 **[Full MCP Documentation →](./ai-debugging.md)**

---

## Configuration Options

### Client Configuration

```typescript
interface DevtoolsConfig {
  serverUrl?: string;  // Default: 'localhost:4000'
  enabled?: boolean;   // Default: true
}
```

### Server Configuration

```bash
npx reflex-devtools [options]

Options:
  -p, --port <port>    Port number (default: 4000)
  -h, --host <host>    Host address (default: localhost)
  --help              Show help message
```

---

## Features in Detail

### Database State Inspection

The DevTools dashboard shows your entire application state in a hierarchical, searchable tree view. You can:

- **Expand/collapse** state branches
- **Search** for specific keys or values
- **Watch changes** in real-time as you interact with your app
- **Copy state paths** for use in subscriptions or events

### Real-time Event Tracing

Every event dispatched in your Reflex app is captured and displayed in the Events panel:

- **Event timeline** with timestamps
- **Event parameters** and payloads
- **State changes** caused by each event
- **Performance metrics** for event execution time

### Reactions and Render Tracing

Monitor how your app responds to state changes:

- **Subscription creation** and disposal
- **Reaction execution** with timing
- **Component re-renders** triggered by subscriptions
- **Performance bottlenecks** in reactive chains

### Performance Profiling

Identify and optimize slow operations:

- **Event execution times** with detailed breakdowns
- **Subscription computation times**
- **Render performance** metrics
- **Memory usage** patterns

---

## Related Resources

- [Reflex DevTools GitHub](https://github.com/flexsurfer/reflex-devtools)
- [AI-Powered Debugging Guide](./ai-debugging.md)
