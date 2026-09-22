import Parser from "rss-parser";

const parser = new Parser();

const feeds = [
  ["Indian Express", "https://indianexpress.com/section/india/feed/"],
  ["The Hindu", "https://www.thehindu.com/news/national/feeder/default.rss"],
  ["NDTV", "https://feeds.feedburner.com/ndtvnews-top-stories"],
  ["BBC News", "https://feeds.bbci.co.uk/news/topics/cx1m7zg01xyt/rss.xml"],
  ["Ars Technica AI", "https://arstechnica.com/ai/feed/"],
  ["TechCrunch AI", "https://techcrunch.com/category/artificial-intelligence/feed/"],
  ["BleepingComputer", "https://www.bleepingcomputer.com/feed/"],
  ["Krebs on Security", "https://krebsonsecurity.com/feed/"],
];

for (const [name, url] of feeds) {
  try {
    const feed = await parser.parseURL(url);
    console.log(`${name}: ${feed.items.length} items`);
  } catch (error) {
    console.error(`${name}: FAILED`);
  }
}