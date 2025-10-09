# Reflex - Landing Page & Documentation

This project contains both the landing page and documentation for Reflex, a reactive state management library for React and TypeScript.

## Project Structure

```
reflex-landing/
├── src/                    # React landing page (for development)
├── docs/                   # VitePress documentation (main site)
├── dist/                   # Built React app (generated)
└── docs/.vitepress/       # VitePress config and assets
```

## Features

### Landing Page (Embedded in Docs)
- Beautiful hero section with branding
- Feature highlights (Event-driven, Reactive, Type-safe, Cross-platform)
- Interactive code examples with tab switching
- Quick start guide
- Call-to-action sections
- Fully responsive design

### Documentation (`docs/`)
- Built with VitePress
- Markdown-based content
- Search functionality
- Responsive design
- Fast static generation
- Professional navigation

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start React landing page dev server (for development) |
| `npm run docs:dev` | Start VitePress documentation dev server (main development) |
| `npm run build` | Build React landing page |
| `npm run docs:build` | Build documentation site |
| `npm run preview` | Preview built React app |
| `npm run docs:preview` | Preview built documentation |

### Site URLs
- Landing: `https://flexsurfer.github.io/reflex-website/`
- Docs: `https://flexsurfer.github.io/reflex-website/docs/`

## Contributing

1. **Landing Page**: Edit the HTML/CSS in `docs/index.md` (or use React components in `src/` for development)
2. **Documentation**: Edit `.md` files in `docs/`
3. **Test**: Run `npm run docs:dev` to see changes

## Tech Stack

- **Documentation Site**: VitePress, Markdown, HTML, CSS, JavaScript
- **Development**: React, JavaScript, CSS
- **Build Tools**: Vite, esbuild
- **Styling**: Custom CSS with modern features
- **Deployment**: GitHub Pages (static site hosting)
