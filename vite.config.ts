import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import path from 'path'

// Prevent treeshaking of Icon.tsx (dynamic icon lookup)
const preventIconTreeshake = () => ({
  name: 'prevent-icon-treeshake',
  resolveId(source) {
    if (source.endsWith('core/ui/Icon.tsx') || source.includes('core/ui/Icon')) {
      return { id: source, moduleSideEffects: true };
    }
    return null;
  },
});

export default defineConfig({
  plugins: [
    react(),
    preventIconTreeshake(),
    {
      name: 'fix-iife-html',
      closeBundle() {
        const htmlPath = path.join(__dirname, 'dist', 'index.html')
        if (fs.existsSync(htmlPath)) {
          let html = fs.readFileSync(htmlPath, 'utf8')
          // Remove type="module" and add defer for IIFE bundle
          html = html.replace(
            '<script type="module" crossorigin src="/assets/',
            '<script defer crossorigin src="/assets/'
          )
          fs.writeFileSync(htmlPath, html)
          console.log('[fix-iife-html] Fixed script tag: removed type=module, added defer')
        }
      },
    },
  ],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
      '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    strictPort: false,
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    cache: false,
    modulePreload: { polyfill: true },
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
})
