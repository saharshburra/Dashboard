'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArticleCard } from '@/components/ArticleCard';
import type { Article, ArticlesResponse } from '@/types/article';

const categories = ['All', 'India', 'US', 'AI/ML', 'Cybersecurity'];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);

  useEffect(() => {
    async function loadArticles() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/articles');

        if (!response.ok) {
          throw new Error('Unable to load articles');
        }

        const data = (await response.json()) as ArticlesResponse;

        setArticles(Object.values(data.articles).flat());
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load articles',
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadArticles();
  }, [refreshKey]);

  async function runPipeline() {
    try {
      setIsRunningPipeline(true);
      setError(null);

      const response = await fetch('/api/pipeline', { method: 'POST' });

      if (!response.ok) {
        throw new Error('Unable to update the news feed');
      }

      setRefreshKey((current) => current + 1);
    } catch (pipelineError) {
      setError(
        pipelineError instanceof Error
          ? pipelineError.message
          : 'Unable to update the news feed',
      );
    } finally {
      setIsRunningPipeline(false);
    }
  }

  const visibleArticles = useMemo(() => {
    if (category === 'All') {
      return articles;
    }

    return articles.filter(
      (article) => article.source.category === category,
    );
  }, [articles, category]);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10 border-b border-[var(--border)] pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
                News Dashboard
              </p>

              <h1 className="font-serif text-5xl font-bold tracking-tight">
                The Signal
              </h1>

              <p className="mt-3 max-w-2xl text-base text-[var(--muted)]">
                Curated technology, business, finance, India, and US news.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setRefreshKey((current) => current + 1)}
                disabled={isLoading || isRunningPipeline}
                className="inline-flex items-center justify-center gap-2 border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:border-[var(--foreground)] disabled:cursor-wait disabled:opacity-50"
              >
                <span aria-hidden="true">&#8635;</span>
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                type="button"
                onClick={runPipeline}
                disabled={isLoading || isRunningPipeline}
                className="inline-flex items-center justify-center gap-2 bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)] transition hover:opacity-85 disabled:cursor-wait disabled:opacity-50"
              >
                <span aria-hidden="true">&#9654;</span>
                {isRunningPipeline ? 'Updating...' : 'Update feed'}
              </button>
            </div>
          </div>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`px-4 py-2 text-sm font-medium transition ${
                category === item
                  ? 'bg-black text-white'
                  : 'border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-black/5'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <section>
          {!isLoading && !error && (
            <div className="mb-5 flex items-center justify-between text-sm text-[var(--muted)]">
              <span>{visibleArticles.length} curated stories</span>
              {category !== 'All' && <span>Filtered: {category}</span>}
            </div>
          )}

          {isLoading && (
            <p className="py-16 text-center font-serif text-2xl text-[var(--muted)]">
              Gathering the signal...
            </p>
          )}

          {error && (
            <p className="border border-red-200 bg-red-50 p-5 text-sm text-red-800">
              {error}
            </p>
          )}

          {!isLoading && !error && visibleArticles.length === 0 && (
            <p className="py-16 text-center font-serif text-2xl text-[var(--muted)]">
              No curated stories in this category yet.
            </p>
          )}

          {!isLoading && !error && visibleArticles.length > 0 && (
            <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
              {visibleArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}