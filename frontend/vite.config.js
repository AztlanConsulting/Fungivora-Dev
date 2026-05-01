import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Actualiza la app automáticamente cuando hay cambios
      includeAssets: ['icons/*.png'], // Archivos en /public a cachear
      manifest: {
        name: 'Fungivora Cultivos',
        short_name: 'Fungivora',
        description: 'Administrador de cultivos de hongos',
        theme_color: '#3b3fb6',      // El azul para la barra superior
        background_color: '#faeed0', // El crema para el fondo de carga
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-splash.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
      }
    })
  ],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['localhost'],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  }
})
