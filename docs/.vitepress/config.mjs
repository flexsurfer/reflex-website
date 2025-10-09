import { defineConfig } from 'vitepress'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const base = process.env.VITEPRESS_BASE ?? (isGitHubActions ? '/docs/' : '/')

export default defineConfig({
  title: 'Reflex Docs',
  description: 'Documentation for Reflex',
  base,
})


