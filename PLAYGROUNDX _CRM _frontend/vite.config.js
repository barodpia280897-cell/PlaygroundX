import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            if (id.includes('lucide-react') || id.includes('framer-motion')) {
              return 'vendor-ui';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-core';
            }
            return 'vendor-others';
          }
          if (id.includes('/src/components/') || id.includes('/src/ui/') || id.includes('/src/modals/') || id.includes('/src/contexts/')) {
            return 'app-components';
          }
          if (id.includes('/src/dashboards/') || id.includes('/src/layouts/') || id.includes('/src/utils/') || id.includes('/src/data/')) {
            return 'app-common';
          }
        }
      }
    }
  },
})
