import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
    strictPort: false,
  },
  build: {
    // Split the big, rarely-changing vendor libraries out of the app bundle so
    // they cache independently across deploys and parse in parallel with app
    // code. React and the `motion` animation lib are the two heavyweights.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
              return 'react-vendor'
            }
            if (id.includes('motion')) return 'motion-vendor'
          }
        },
      },
    },
  },
})
