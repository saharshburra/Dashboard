export type Article = {
  id: number;
  title: string;
  simplifiedTitle: string | null;
  url: string;
  description: string | null;
  summary: string | null;
  worthReading: boolean | null;
  relevanceScore: number | null;
  publishedAt: string;
  processedAt: string | null;
  source: {
    id: number;
    name: string;
    category: string;
    websiteUrl: string;
  };
};

export type ArticlesResponse = {
  articles: Article[];
};
