import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Reflex',
  description: 'Reactive, functional state management for React and TypeScript',
  base: '/docs/',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quick Start', link: '/quick-start' },
      { text: 'Best Practices', link: '/best-practices' },
      { text: 'Testing', link: '/testing' },
      { text: 'Shared Code', link: '/shared-code' },
      { text: 'API Reference', link: '/api-reference' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Quick Start', link: '/quick-start' },
          { text: 'Best Practices', link: '/best-practices' },
          { text: 'DevTools', link: '/devtools' },
          { text: 'AI Debugging', link: '/ai-debugging' },
          { text: 'Testing', link: '/testing' },
          { text: 'Shared Code', link: '/shared-code' },
          { text: 'Redux/Zustand Comparison', link: '/redux-zustand-comparison' },
          { text: 'Re-frame Comparison', link: '/re-frame-comparison' },
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'API Reference', link: '/api-reference' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/flexsurfer/reflex' }
    ]
  }
})
