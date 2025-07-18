import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(),],
  server: {
    host: true, // 👈 autorise l'accès depuis le réseau local
    port: 3000, // (optionnel) pour forcer un port précis
  },
})
