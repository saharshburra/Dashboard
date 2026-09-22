import { db } from '@/prisma/db';
import { fetchFeed } from '@/lib/rss';
import { isRelevant } from '@/lib/filter';

export async function ingestSources() {
	const sources = await db.orm.public.Source.all();
	let inserted = 0;
	let skipped = 0;
	let deleted = 0;
	const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;

	const existingArticles = await db.orm.public.Article.all();
	for (const article of existingArticles) {
		const publishedAt = new Date(article.publishedAt).getTime();

		if (Number.isFinite(publishedAt) && publishedAt < cutoff) {
			await db.orm.public.Article
				.where({ id: article.id })
				.delete();
			deleted++;
		}
	}

	for (const source of sources) {
		const articles = await fetchFeed(source.rssUrl);

		for (const article of articles) {
			if (!article.title || !article.url || !article.publishedAt) {
				skipped++;
				continue;
			}
        
            const relevant = isRelevant(article, source.category);
            console.log(
            `[${source.name}] ${relevant ? 'KEEP' : 'SKIP'}: ${article.title}`,
            );

            if (!relevant) {
				skipped++;
            continue;
            }
            
			const existingArticle = await db.orm.public.Article
				.where({ url: article.url })
				.first();

			if (!existingArticle) {
				await db.orm.public.Article.create({
					title: article.title,
					url: article.url,
					description: article.description ?? null,
					publishedAt: article.publishedAt,
					sourceId: source.id,
				});
				inserted++;
			} else {
				skipped++;
			}
		}
	}

	return { inserted, skipped, deleted };
}