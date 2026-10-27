import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// El contenido vive en ../contenido; la app lo lee en tiempo de build.
export default defineConfig({
  base: process.env.BASE ?? '/',
  server: { fs: { allow: ['..'] } },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icono.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Ruta de datos',
        short_name: 'Ruta datos',
        description: 'Aprende datos desde cero: 1 hora al día, de lunes a viernes.',
        lang: 'es',
        theme_color: '#0f5257',
        background_color: '#f6f4ef',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icono-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icono-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icono-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // sql-wasm.wasm (~650 KB) debe quedar en caché para funcionar sin conexión
        globPatterns: ['**/*.{js,css,html,wasm,png,svg}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
    }),
  ],
});
