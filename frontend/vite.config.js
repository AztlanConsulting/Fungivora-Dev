import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// DOTENV para cargar allowedHosts
const dotenv = require('dotenv')
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const ALLOWED_HOSTS = process.env.ALLOWED_HOSTS?.split(',') || [];

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
    allowedHosts: ALLOWED_HOSTS
  }
})
