import { db } from '@/prisma/db';
import { analyzeArticle } from '@/lib/ai';

export async function processArticles() {
  const articles = await db.orm.public.Article
    .include('source')
    .all();
  const pendingArticles = articles.filter((article) => !article.processedAt);

  let processed = 0;
  const skipped = articles.length - pendingArticles.length;

  for (const article of pendingArticles) {
    try {
      const analysis = await analyzeArticle({
        title: article.title,
        description: article.description,
        category: article.source.category,
      });

      await db.orm.public.Article
        .where({ id: article.id })
        .update({
          simplifiedTitle: analysis.simplifiedTitle,
          summary: analysis.summary,
          worthReading: analysis.worthReading,
          relevanceScore: analysis.relevanceScore,
          processedAt: new Date().toISOString(),
        });

      processed++;

      console.log(
        `[AI] ${article.title} → ${analysis.relevanceScore}`,
      );
    } catch (error) {
      console.error(
        `[AI] Failed to process article ${article.id}:`,
        error,
      );
    }
  }

  return {
    processed,
    skipped,
  };
}