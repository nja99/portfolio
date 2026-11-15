import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Vite build config. `base: './'` makes the built site work from any folder
// (GitHub Pages sub-paths, Netlify, opening dist/ locally, etc.).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});
