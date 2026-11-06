import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vitest 3 transforma con esbuild: se fuerza el runtime automático de JSX (sin `import React`).
  esbuild: { jsx: 'automatic' },
  test: {
    // Las pruebas de lógica pura corren igual en jsdom; las de componentes lo necesitan.
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.js',
    css: false,
  },
})
