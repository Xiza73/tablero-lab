import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages sirve el sitio en /tablero-lab/; en local queda en /.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
