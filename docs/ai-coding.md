# AI-Assisted Coding with llms.txt

**Get better AI-generated Reflex code by feeding your assistant the right context.**

Reflex provides an [`llms.txt`](https://raw.githubusercontent.com/flexsurfer/reflex/main/llms.txt) file — a concise reference that teaches AI coding assistants (Cursor, Copilot, Claude, ChatGPT, etc.) the library's architecture, conventions, and patterns. Using it dramatically improves the quality of generated code.

## What is llms.txt?

`llms.txt` is a single-file summary of Reflex's best practices designed specifically for LLM consumption. It covers:

- **State architecture** — recommended file structure and naming
- **Event conventions** — synchronous handlers, effect tuples, `current()` usage
- **Subscription patterns** — root vs. computed subs, view-ready data
- **Component contract** — minimal subscriptions, dispatch-only user intent
- **Effect/coeffect rules** — isolating I/O
- **Testing patterns** — event and subscription test examples
- **Starter skeleton** — a complete copy-paste pattern

## How to Use

### Option 1: Add as a Cursor Rule (Recommended for Cursor users)

Create a project-level rule that automatically includes the Reflex conventions in every AI interaction:

1. Create `.cursor/rules/reflex.mdc` in your project root:

   ```markdown
   ---
   description: Reflex state management conventions
   globs: "**/*.{ts,tsx,js,jsx}"
   ---

   @https://raw.githubusercontent.com/flexsurfer/reflex/main/llms.txt
   ```

2. The AI assistant will now follow Reflex patterns whenever you work on matching files.

### Option 2: Paste into Chat Context

Copy the contents of the file and paste it directly into your AI assistant's chat:

1. Open [llms.txt](https://raw.githubusercontent.com/flexsurfer/reflex/main/llms.txt)
2. Copy the entire contents
3. Paste it at the beginning of your conversation (or attach as a file)
4. Then ask your question or describe the feature you want to build

### Option 3: Reference the URL Directly

Many AI tools support fetching URLs. You can reference the file directly:

- **Cursor**: Use `@https://raw.githubusercontent.com/flexsurfer/reflex/main/llms.txt` in chat
- **Claude**: Attach the URL or paste the contents
- **ChatGPT**: Paste the contents or provide the URL for web-browsing-enabled models

### Option 4: Add to Your Project

Download the file into your repository so it's always available as local context:

```bash
curl -o llms.txt https://raw.githubusercontent.com/flexsurfer/reflex/main/llms.txt
```

Then reference it from your AI tool (e.g., `@llms.txt` in Cursor).

## Example Prompts

Once your AI assistant has the `llms.txt` context, try prompts like:

> "Create a new `notifications` feature with events for fetching from API, marking as read, and a subscription for unread count."

> "Add a `settings` slice to the app DB with events for updating theme and language, persisted to localStorage via effects."

> "Write tests for my `todos/add` event handler and `todos/open_count` subscription."

The AI will follow the correct patterns: namespaced event IDs, effect tuples for side effects, `current()` for draft data, view-ready subscriptions, and proper component contracts.

## Keeping Up to Date

The `llms.txt` file is maintained alongside the Reflex library. When referencing it via URL, you always get the latest version. If you've downloaded a local copy, update it periodically:

```bash
curl -o llms.txt https://raw.githubusercontent.com/flexsurfer/reflex/main/llms.txt
```

## Related Resources

- [llms.txt (raw)](https://raw.githubusercontent.com/flexsurfer/reflex/main/llms.txt)
- [Best Practices](./best-practices.md)
- [AI Debugging with DevTools MCP](./ai-debugging.md)
- [Reflex Documentation](./index.md)
