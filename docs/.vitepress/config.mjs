import { defineConfig } from 'vitepress'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1]
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'

// When hosted on GitHub Pages under "/reflex-website/docs/", prefix all asset urls accordingly.
// Allow override via VITEPRESS_BASE env if needed.
const base = process.env.VITEPRESS_BASE ?? (isGitHubActions ? '/reflex-website/docs/' : '/')

export default defineConfig({
  title: 'Reflex Docs',
  description: 'Documentation for Reflex',
  base,
})


