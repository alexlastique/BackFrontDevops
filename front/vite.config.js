import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    port: 8080,
    strictPort: true,
    host: '0.0.0.0', // Autoriser l'accès depuis l'extérieur
    origin: "http://pg2.finder-me.com",
    allowedHosts: ['pg2.finder-me.com']
  }

  
}) 
