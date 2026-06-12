import { defineConfig } from 'vite';
import { resolve, parse } from 'path';
import { globSync } from 'glob';

// Find all HTML files in the project root
const htmlFiles = globSync('*.html');

const input = {};
htmlFiles.forEach((file) => {
  const name = parse(file).name;
  input[name] = resolve(__dirname, file);
});

export default defineConfig({
  base: '/nearconnect-web/',
  build: {
    rollupOptions: {
      input
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
