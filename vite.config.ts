import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export const KDS_CONFIG = {
  refreshInterval: 3000,
  warningTime: 8 * 60 * 1000,
}

export default defineConfig({
  plugins: [react()],
})

