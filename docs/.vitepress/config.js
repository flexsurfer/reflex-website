import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Reflex',
  description: 'Reactive, functional state management for React and TypeScript',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quick Start', link: '/quick-start' },
      { text: 'API Reference', link: '/api-reference' },
      { text: 'Best Practices', link: '/best-practices' },
      { text: 'FAQ', link: '/faq' },
      { text: 'GitHub', link: 'https://github.com/flexsurfer/reflex' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Quick Start', link: '/quick-start' },
          { text: 'Best Practices', link: '/best-practices' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'API Reference', link: '/api-reference' },
          { text: 'FAQ', link: '/faq' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/flexsurfer/reflex' }
    ]
  }
})
