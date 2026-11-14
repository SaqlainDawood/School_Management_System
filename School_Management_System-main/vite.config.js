import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  build: {
    // Target modern browsers — smaller output than the default es2015
    target: 'es2020',

    // Raise the warning threshold to 600 kB (vendor chunks are legitimately large)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Manual vendor chunk splitting for better long-term caching
        manualChunks(id) {
          // React ecosystem core
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }

          // React Router
          if (id.includes('node_modules/react-router') ||
              id.includes('node_modules/@remix-run/')) {
            return 'vendor-router';
          }

          // Recharts (largest single dependency — isolate for independent caching)
          if (id.includes('node_modules/recharts') ||
              id.includes('node_modules/d3-') ||
              id.includes('node_modules/victory-vendor') ||
              id.includes('node_modules/eventemitter3')) {
            return 'vendor-recharts';
          }

          // Framer Motion (second-largest dependency)
          if (id.includes('node_modules/framer-motion') ||
              id.includes('node_modules/motion')) {
            return 'vendor-motion';
          }

          // Form & validation utilities
          if (id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/react-toastify') ||
              id.includes('node_modules/react-hot-toast')) {
            return 'vendor-forms';
          }

          // Icons (tree-shaken, but still a named chunk for clarity)
          if (id.includes('node_modules/react-icons')) {
            return 'vendor-icons';
          }

          // Date utilities
          if (id.includes('node_modules/date-fns') ||
              id.includes('node_modules/axios')) {
            return 'vendor-utils';
          }

          // Redux
          if (id.includes('node_modules/@reduxjs/') ||
              id.includes('node_modules/redux') ||
              id.includes('node_modules/react-redux') ||
              id.includes('node_modules/immer')) {
            return 'vendor-redux';
          }
        },
      },
    },
  },
})