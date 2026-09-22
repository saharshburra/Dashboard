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

  {
    name: 'Times of India',
    category: 'India',
    websiteUrl: 'https://timesofindia.indiatimes.com',
    rssUrl: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
  },

  // US
  {
    name: 'NPR',
    category: 'US',
    websiteUrl: 'https://www.npr.org',
    rssUrl: 'https://feeds.npr.org/1001/rss.xml',
  },
  {
    name: 'CNN',
    category: 'US',
    websiteUrl: 'https://www.cnn.com',
    rssUrl: 'http://rss.cnn.com/rss/edition.rss',
  },
  {
    name: 'BBC US & Canada',
    category: 'US',
    websiteUrl: 'https://www.bbc.com/news',
    rssUrl: 'https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml',
  },
  {
    name: 'The New York Times',
    category: 'US',
    websiteUrl: 'https://www.nytimes.com',
    rssUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/US.xml',
  },
  {
    name: 'The Washington Post',
    category: 'US',
    websiteUrl: 'https://www.washingtonpost.com',
    rssUrl: 'https://feeds.washingtonpost.com/rss/national',
  },
  {
    name: 'The Wall Street Journal',
    category: 'US',
    websiteUrl: 'https://www.wsj.com',
    rssUrl: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
  },
  {
    name: 'Bloomberg Markets',
    category: 'US',
    websiteUrl: 'https://www.bloomberg.com',
    rssUrl: 'https://feeds.bloomberg.com/markets/news.rss',
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
  {
    name: 'MIT Technology Review',
    category: 'AI/ML',
    websiteUrl: 'https://www.technologyreview.com',
    rssUrl: 'https://www.technologyreview.com/feed/',
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
  {
    name: 'The Hacker News',
    category: 'Cybersecurity',
    websiteUrl: 'https://thehackernews.com',
    rssUrl: 'https://feeds.feedburner.com/TheHackersNews',
  },
  {
    name: 'SecurityWeek',
    category: 'Cybersecurity',
    websiteUrl: 'https://www.securityweek.com',
    rssUrl: 'https://feeds.feedburner.com/securityweek',
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
