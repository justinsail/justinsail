import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://justinbradshaw.com',
  // Content (README, facets, log) lives one level up, at the repo root.
  vite: { server: { fs: { allow: ['..'] } } },
});
