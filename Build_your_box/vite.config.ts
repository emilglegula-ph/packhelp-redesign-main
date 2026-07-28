import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.hdr'],
  build: {
    // Chrome refuses to load <script type="module"> (and its stylesheet)
    // over file://, treating it as a cross-origin request and blocking it
    // via CORS. A classic IIFE bundle isn't subject to that restriction, so
    // this is what makes `dist/index.html` work when double-clicked with no
    // dev server running.
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
})
