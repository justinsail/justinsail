import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

// Every image under the repo-root log/images, keyed by file name.
const files = import.meta.glob<{ default: ImageMetadata }>('../../../log/images/*.{jpg,jpeg,png,webp}', { eager: true });
const byName: Record<string, ImageMetadata> = {};
for (const [p, mod] of Object.entries(files)) byName[p.split('/').pop()!] = mod.default;

export async function posts() {
  const all = await getCollection('log');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** The first image a post uses, for list thumbnails. */
export function thumb(entry: CollectionEntry<'log'>): ImageMetadata | undefined {
  const m = entry.body?.match(/!\[[^\]]*\]\(images\/([^)\s]+)\)/);
  return m ? byName[m[1]] : undefined;
}

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
