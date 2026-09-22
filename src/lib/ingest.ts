import { db } from '@/prisma/db';
import { fetchFeed } from '@/lib/rss';

export async function ingestSources() {
	const sources = await db.orm.public.Source.all();

	for (const source of sources) {
		const articles = await fetchFeed(source.rssUrl);

		for (const article of articles) {
			if (!article.title || !article.url || !article.publishedAt) {
				continue;
			}

			const existingArticle = await db.orm.public.Article
				.where({ url: article.url })
				.first();

			if (!existingArticle) {
				await db.orm.public.Article.create({
					title: article.title,
					url: article.url,
					publishedAt: article.publishedAt,
					sourceId: source.id,
				});
			}
		}
	}
}