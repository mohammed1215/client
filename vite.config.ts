import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server:{
    sourcemapIgnoreList: false,
  },
  build: {
    sourcemap:true,
  },
  css:{
    devSourcemap:true
  },esbuild: {
    sourcemap: 'both' 
  }
})
