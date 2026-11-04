import rss from '@astrojs/rss';
import { posts } from '../lib/log';

export async function GET(context) {
  const items = await posts();
  return rss({
    title: 'Justin Bradshaw: the log',
    description: 'What Justin Bradshaw is learning building with AI day to day.',
    site: context.site,
    items: items.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.description,
      link: `/log/${p.id}/`,
    })),
  });
}
