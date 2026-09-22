import type { Article } from '@/types/article';

type ArticleCardProps = {
  article: Article;
};

function formatPublishedAt(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function ArticleCard({ article }: ArticleCardProps) {
  const score = Math.max(0, Math.min(100, article.relevanceScore ?? 0));

  return (
    <article className="group relative flex h-full flex-col border-t border-[var(--line)] py-6 transition-colors first:border-t-0 sm:first:border-t sm:hover:border-[var(--ink)]">
      <div className="mb-5 flex items-center justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        <span className="text-[var(--accent)]">{article.source.name}</span>
        <span>{formatPublishedAt(article.publishedAt)}</span>
      </div>

      <h2 className="max-w-2xl font-serif text-[clamp(1.45rem,2.4vw,2.1rem)] leading-[1.08] tracking-[-0.02em] text-[var(--ink)]">
        {article.simplifiedTitle || article.title}
      </h2>

      {article.summary && (
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[var(--muted)]">
          {article.summary}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          <span>{article.source.category}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--accent)]" />
          <span className="inline-flex items-center gap-2">
            <span
              aria-label={`Relevance score ${score} out of 100`}
              className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--line)]"
            >
              <span
                className="block h-full bg-[var(--accent)]"
                style={{ width: `${score}%` }}
              />
            </span>
            <span>Score {score}</span>
          </span>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-[var(--ink)] underline decoration-[var(--accent)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--accent)]"
        >
          Read article <span aria-hidden="true">&#8594;</span>
        </a>
      </div>
    </article>
  );
}
