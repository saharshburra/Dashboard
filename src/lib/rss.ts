import Parser from "rss-parser";

const parser = new Parser();

export async function fetchFeed(url: string) {
  const feed = await parser.parseURL(url);
  return feed.items
    .filter(
      (item) =>
        Boolean(item.title?.trim()) &&
        Boolean(item.link?.trim()) &&
        Boolean(item.isoDate?.trim()),
    )
    .map((item) => ({
        title: item.title,
        url: item.link,
        publishedAt: item.isoDate,
    }));
}