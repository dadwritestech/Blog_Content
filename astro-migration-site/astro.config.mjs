import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import remarkCallout from '@r4ai/remark-callout';

export default defineConfig({
  site: 'https://www.dad-writes-tech.com',
  integrations: [react(), tailwind()],
  markdown: {
    remarkPlugins: [remarkCallout],
  },
});
