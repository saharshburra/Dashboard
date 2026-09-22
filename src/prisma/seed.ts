import { db } from './db.ts';

const sources = [
  {
    name: 'Indian Express',
    category: 'India',
    websiteUrl: 'https://indianexpress.com',
    rssUrl: 'https://indianexpress.com/section/india/feed/',
  },
  {
    name: 'The Hindu',
    category: 'India',
    websiteUrl: 'https://www.thehindu.com',
    rssUrl: 'https://www.thehindu.com/news/national/feeder/default.rss',
  },
  {
    name: 'NDTV',
    category: 'India',
    websiteUrl: 'https://www.ndtv.com',
    rssUrl: 'https://feeds.feedburner.com/ndtvnews-top-stories',
  },
  {
    name: 'BBC News',
    category: 'World',
    websiteUrl: 'https://www.bbc.com/news',
    rssUrl: 'https://feeds.bbci.co.uk/news/rss.xml',
  }
];

export async function seed() {
  for (const source of sources) {
    await db.orm.public.Source.upsert({
      create: source,
      update: source,
      conflictOn: { websiteUrl: source.websiteUrl },
    });
  }
}

seed();
