// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://saulogalvao.adv.br',
  integrations: [sitemap({ filter: (page) => !page.includes('/obrigado') && !page.includes('/admin') })],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'always' },
});
