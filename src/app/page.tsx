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
      <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-12">
        <header className="mb-10 border-b border-[var(--line)] pb-10 pt-8 sm:pt-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-5 text-sm font-semibold tracking-[-0.01em] text-[var(--ink)]">
                The Signal <span className="text-[var(--accent)]">&#9679;</span>
              </p>

              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">
                The news that moves<br className="hidden sm:block" /> your world.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-7 tracking-[-0.01em] text-[var(--muted)]">
                A considered view of technology, business, finance, India, and US news.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setRefreshKey((current) => current + 1)}
                disabled={isLoading || isRunningPipeline}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/60 px-5 py-2.5 text-sm font-medium shadow-sm transition hover:bg-white disabled:cursor-wait disabled:opacity-50"
              >
                <span aria-hidden="true">&#8635;</span>
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                type="button"
                onClick={runPipeline}
                disabled={isLoading || isRunningPipeline}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:cursor-wait disabled:opacity-50"
              >
                <span aria-hidden="true">&#9654;</span>
                {isRunningPipeline ? 'Updating...' : 'Update feed'}
              </button>
            </div>
          </div>
        </header>

        <nav className="mb-8 flex gap-2 overflow-x-auto pb-1" aria-label="Filter articles by category">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                category === item
                  ? 'bg-[var(--ink)] text-white shadow-sm'
                  : 'bg-white/65 text-[var(--muted)] hover:bg-white hover:text-[var(--ink)]'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <section>
          {!isLoading && !error && (
            <div className="mb-5 flex items-center justify-between text-sm tracking-[-0.01em] text-[var(--muted)]">
              <span>{visibleArticles.length} curated stories</span>
              {category !== 'All' && <span>Filtered: {category}</span>}
            </div>
          )}

          {isLoading && (
            <p className="py-16 text-center text-2xl font-medium tracking-[-0.03em] text-[var(--muted)]">
              Gathering the signal...
            </p>
          )}

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
              {error}
            </p>
          )}

          {!isLoading && !error && visibleArticles.length === 0 && (
            <p className="py-16 text-center text-2xl font-medium tracking-[-0.03em] text-[var(--muted)]">
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