import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1]
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'

// When building on GitHub Actions for Pages, serve under "/reflex-website/"
// Locally and in non-GitHub environments, default to root "/"
const basePath = process.env.VITE_BASE ?? (isGitHubActions ? '/reflex-website/' : '/')

export default defineConfig({
  plugins: [react()],
  base: basePath,
})
