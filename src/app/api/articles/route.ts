import { db } from '@/prisma/db';

const categories = ['India', 'US', 'AI/ML', 'Cybersecurity'] as const;

export async function GET() {
  try {
    const articles = await db.orm.public.Article
      .include('source')
      .all();

    const curatedArticles = articles
      .filter((article) => article.processedAt && article.worthReading === true)
      .sort((first, second) => {
        const scoreDifference =
          (second.relevanceScore ?? 0) - (first.relevanceScore ?? 0);

        if (scoreDifference !== 0) {
          return scoreDifference;
        }

        return (
          new Date(second.publishedAt).getTime() -
          new Date(first.publishedAt).getTime()
        );
      })
      .map((article) => ({
        id: article.id,
        title: article.title,
        simplifiedTitle: article.simplifiedTitle,
        url: article.url,
        description: article.description,
        summary: article.summary,
        worthReading: article.worthReading,
        relevanceScore: article.relevanceScore,
        publishedAt: article.publishedAt,
        processedAt: article.processedAt,
        source: {
          id: article.source.id,
          name: article.source.name,
          category: article.source.category,
          websiteUrl: article.source.websiteUrl,
        },
      }));

    const articlesByCategory = Object.fromEntries(
      categories.map((category) => [
        category,
        curatedArticles
          .filter((article) => article.source.category === category)
          .slice(0, 10),
      ]),
    ) as Record<(typeof categories)[number], typeof curatedArticles>;

    return Response.json({ articles: articlesByCategory });
  } catch (error) {
    console.error('Failed to load articles:', error);

    return Response.json(
      { error: 'Failed to load articles' },
      { status: 500 },
    );
  }
}
