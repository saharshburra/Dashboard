import { db } from './db.ts';

const sources = [
  // India
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

  // US
  {
    name: 'BBC News',
    category: 'US',
    websiteUrl: 'https://www.bbc.com/news',
    rssUrl: 'https://feeds.bbci.co.uk/news/topics/cx1m7zg01xyt/rss.xml',
  },

  // AI/ML
  {
    name: 'Ars Technica AI',
    category: 'AI/ML',
    websiteUrl: 'https://arstechnica.com',
    rssUrl: 'https://arstechnica.com/ai/feed/',
  },
  {
    name: 'TechCrunch AI',
    category: 'AI/ML',
    websiteUrl: 'https://techcrunch.com',
    rssUrl: 'https://techcrunch.com/category/artificial-intelligence/feed/',
  },

  // Cybersecurity
  {
    name: 'BleepingComputer',
    category: 'Cybersecurity',
    websiteUrl: 'https://www.bleepingcomputer.com',
    rssUrl: 'https://www.bleepingcomputer.com/feed/',
  },
  {
    name: 'Krebs on Security',
    category: 'Cybersecurity',
    websiteUrl: 'https://krebsonsecurity.com',
    rssUrl: 'https://krebsonsecurity.com/feed/',
  },
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
