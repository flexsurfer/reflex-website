import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Reflex',
  description: 'Reactive, functional state management for React and TypeScript',
  base: '/docs/',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quick Start', link: '/quick-start' },
      { text: 'Testing', link: '/testing' },
      { text: 'Shared Code', link: '/shared-code' },
      { text: 'API Reference', link: '/api-reference' },
      { text: 'Best Practices', link: '/best-practices' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Quick Start', link: '/quick-start' },
          { text: 'Testing', link: '/testing' },
          { text: 'Shared Code', link: '/shared-code' },
          { text: 'Best Practices', link: '/best-practices' },
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
