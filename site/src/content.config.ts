import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Log posts live at the repo root in ../log so they render on GitHub too.
const log = defineCollection({
  loader: glob({ base: '../log', pattern: '[0-9]*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    source: z.string().optional(),
  }),
});

export const collections = { log };
