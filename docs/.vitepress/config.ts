import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Reflex',
  description: 'A reactive state management library for React and TypeScript',
  base: '/docs/',
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quick Start', link: '/quick-start' },
      { text: 'API Reference', link: '/api-reference' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Quick Start', link: '/quick-start' },
          { text: 'FAQ', link: '/faq' },
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'API Reference', link: '/api-reference' },
          { text: 'Best Practices', link: '/best-practices' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/reflex-landing' }
    ],

    search: {
      provider: 'local'
    }
  }
})
