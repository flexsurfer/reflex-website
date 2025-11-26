# AI-Powered Debugging with DevTools MCP

**Debug smarter with AI assistance using Reflex DevTools MCP server.**

The Model Context Protocol (MCP) server for Reflex DevTools enables AI assistants like Claude and Cursor to inspect your running application, query state, and dispatch events for faster debugging and testing.

## What is MCP?

The Model Context Protocol is an open standard that enables AI assistants to connect to external tools and data sources. Reflex DevTools MCP server acts as a bridge between your Reflex application and AI assistants, providing debugging capabilities through a standardized interface.

## Quick Start

### Prerequisites

1. **Install Reflex DevTools** in your app:
   ```bash
   npm install --save-dev @flexsurfer/reflex-devtools
   ```

2. **Enable DevTools in your app**:
   ```typescript
   import { enableTracing } from '@flexsurfer/reflex';
   import { enableDevtools } from '@flexsurfer/reflex-devtools';

   enableTracing();
   enableDevtools();
   ```

3. **Start the DevTools server** with MCP support:
   ```bash
   npx reflex-devtools --mcp
   ```

   **Important:** The `--mcp` flag enables trace storage and REST API required for MCP functionality.

4. **Install the MCP server**:
   ```bash
   npm install -g @flexsurfer/reflex-devtools-mcp
   ```

### Configure Your AI Assistant

#### Cursor IDE
Add to your Cursor settings (`~/Library/Application Support/Cursor/settings.json`):

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

#### Claude Desktop
Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

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

## Available Tools

### Inspect Execution Traces

View events, effects, subscriptions, and render cycles with timing data:

- **Recent traces**: "Show me the last 10 event traces"
- **Performance issues**: "Find all traces with duration over 100ms"
- **Specific events**: "Show me traces for the 'fetch-user' event"
- **Operation types**: Filter by `event`, `render`, `sub/create`, `sub/run`, `sub/dispose`

### Query Application State

Examine the current app database and subscription values:

- **Full state**: "What's the current app state?"
- **Specific data**: "Show me the user profile data"
- **Nested paths**: "What's in the items array?"

### Dispatch Events for Testing

Trigger event handlers directly from your AI assistant:

- **Simple events**: "Dispatch a 'clear-cache' event"
- **With parameters**: "Call 'update-settings' with dark mode enabled"
- **User actions**: "Dispatch a login event with test user data"

### Monitor Active Subscriptions

View currently active reactive queries:

- **All subscriptions**: "What subscriptions are currently active?"
- **Filtered**: "Show me user-related subscriptions"

## Debugging Workflow Examples

### Performance Investigation

**You:** "My app feels slow. Can you help me identify bottlenecks?"

**AI Assistant:**
```
Let me check the traces for slow operations...

*calls get_traces with minDuration: 50*

I found several events taking over 50ms:
- "fetch-user-data": 234ms (3 times)
- "process-large-list": 156ms (1 time)
- "render": 89ms (5 times)

The "fetch-user-data" event seems to be the main bottleneck.
Let me check what effects it's triggering...

*calls get_handlers with type: "fx"*

I see it's using a "fetch-api" effect. Consider:
1. Adding request caching
2. Using optimistic updates
3. Implementing pagination
```

### Testing Event Flow

**You:** "Can you test what happens when a user logs in?"

**AI Assistant:**
```
I'll dispatch a login event with test user data...

*calls dispatch_event with eventName: "user-login", params: [{"id": 999, "name": "Test User"}]*

Event dispatched successfully. Let me check the resulting state...

*calls get_app_state*

The state has been updated with:
- user.id: 999
- user.name: "Test User"
- user.isAuthenticated: true

The login flow appears to be working correctly!
```

### Architecture Understanding

**You:** "What effects are available in this app?"

**AI Assistant:**
```
*calls get_handlers with type: "fx"*

Your app has 8 effect handlers registered:
1. fetch-api (used 45 times)
2. local-storage (used 12 times)
3. analytics-track (used 34 times)
4. navigate (used 8 times)
5. websocket-send (used 23 times)
...

The most-used effect is "fetch-api" which handles HTTP requests.
```

## Architecture Overview

```
┌─────────────────┐    WebSocket    ┌─────────────────────────┐    HTTP    ┌─────────────────┐
│   Your App      │◀───────────────▶│   DevTools Server       │◀──────────▶│   MCP Server    │
│  + Reflex SDK   │                 │   + Trace Storage       │            │                 │
└─────────────────┘                 │   + REST API            │            └─────────────────┘
                                    └─────────────────────────┘                    │
                                                                                   │ MCP (stdio)
                                                                                   ▼
                                                                           ┌─────────────────┐
                                                                           │  AI Assistant   │
                                                                           │  (Claude/Cursor)│
                                                                           └─────────────────┘
```

The DevTools server collects traces and exposes them via REST API. The MCP server queries this API and presents the data to AI assistants through the standardized MCP protocol.

## Configuration

### DevTools Server Options

```bash
npx reflex-devtools [options]

Options:
  -p, --port <port>         Port to run the server on (default: 4000)
  -h, --host <host>         Host to bind the server to (default: localhost)
  --mcp                     Enable MCP support with trace storage (required)
  --max-traces <number>     Maximum traces to store (default: 1000)
```

### MCP Server Options

```bash
npx reflex-devtools-mcp [options]

Options:
  -p, --port <port>         DevTools server port (default: 4000)
  -h, --host <host>         DevTools server host (default: localhost)
```

### Custom Server Configuration

For remote debugging or custom ports:

```json
{
  "mcp.servers": {
    "reflex-devtools": {
      "command": "npx",
      "args": ["reflex-devtools-mcp", "--port", "3000", "--host", "192.168.1.10"],
      "env": {}
    }
  }
}
```

## Benefits for Development

### Faster Debugging
- **Real-time inspection**: See exactly what happens when events fire
- **State exploration**: Query any part of your app state instantly
- **Event testing**: Dispatch events without UI interactions

### AI-Assisted Development
- **Natural language queries**: "What's causing the performance issue?"
- **Automated analysis**: AI can identify patterns and suggest fixes
- **Documentation**: AI can explain complex state flows

### Quality Assurance
- **Integration testing**: Test event chains without complex setup
- **Edge case exploration**: Dispatch events with unusual parameters
- **Regression testing**: Verify fixes don't break existing functionality

## Troubleshooting

### MCP Not Enabled Error
Make sure to start DevTools server with `--mcp` flag:
```bash
npx reflex-devtools --mcp
```

### Connection Issues
- Verify DevTools server is running
- Check port configuration matches between server and MCP client
- Ensure firewall allows connections to the DevTools port

### Missing Traces
- Confirm `enableTracing()` is called in your app
- Check that events are being dispatched
- Verify DevTools server has trace storage enabled

## Related Resources

- [Reflex DevTools GitHub](https://github.com/flexsurfer/reflex-devtools)
- [Reflex DevTools MCP GitHub](https://github.com/flexsurfer/reflex-devtools-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Reflex Documentation](./index.md)
