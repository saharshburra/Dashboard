import Parser from "rss-parser";

const parser = new Parser();

const feeds = [
  ["Indian Express", "https://indianexpress.com/section/india/feed/"],
  ["The Hindu", "https://www.thehindu.com/news/national/feeder/default.rss"],
  ["NDTV", "https://feeds.feedburner.com/ndtvnews-top-stories"],
  ["Times of India", "https://timesofindia.indiatimes.com/rssfeedstopstories.cms"],
  ["NPR", "https://feeds.npr.org/1001/rss.xml"],
  ["CNN", "http://rss.cnn.com/rss/edition.rss"],
  ["BBC US & Canada", "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml"],
  ["The New York Times", "https://rss.nytimes.com/services/xml/rss/nyt/US.xml"],
  ["The Washington Post", "https://feeds.washingtonpost.com/rss/national"],
  ["The Wall Street Journal", "https://feeds.a.dj.com/rss/RSSWorldNews.xml"],
  ["Bloomberg Markets", "https://feeds.bloomberg.com/markets/news.rss"],
  ["Ars Technica AI", "https://arstechnica.com/ai/feed/"],
  ["TechCrunch AI", "https://techcrunch.com/category/artificial-intelligence/feed/"],
  ["MIT Technology Review", "https://www.technologyreview.com/feed/"],
  ["BleepingComputer", "https://www.bleepingcomputer.com/feed/"],
  ["Krebs on Security", "https://krebsonsecurity.com/feed/"],
  ["The Hacker News", "https://feeds.feedburner.com/TheHackersNews"],
  ["SecurityWeek", "https://feeds.feedburner.com/securityweek"],
];

for (const [name, url] of feeds) {
  try {
    const feed = await parser.parseURL(url);
    console.log(`${name}: ${feed.items.length} items`);
  } catch (error) {
    console.error(`${name}: FAILED`);
  }
}