import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://destroywebsite.com',
  trailingSlash: 'always',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date(),
    }),
  ],
});
