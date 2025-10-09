#!/bin/bash

# Exit on error
set -e

echo "🧹 Cleaning previous builds..."
rm -rf dist-final

echo "📦 Building landing page..."
npm run build

echo "📚 Building VitePress docs..."
npm run docs:build

echo "🔨 Combining builds..."
mkdir -p dist-final
cp -r dist/* dist-final/
mkdir -p dist-final/docs
cp -r docs/.vitepress/dist/* dist-final/docs/

echo "✅ Build complete! Output in dist-final/"


