import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

// [DA COMPILARE] Imposta SITE_URL (file .env o variabili del servizio di hosting)
// con il dominio definitivo. Finché manca, canonical e sitemap puntano a example.com.
const SITE_URL = env.SITE_URL || 'https://www.example.com';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
