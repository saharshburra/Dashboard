export type ArticleForAnalysis = {
  title: string;
  description?: string | null;
  category: string;
};

export type ArticleAnalysis = {
  simplifiedTitle: string;
  summary: string;
  worthReading: boolean;
  relevanceScore: number;
};

export async function analyzeArticle(
  article: ArticleForAnalysis,
): Promise<ArticleAnalysis> {
  if (process.env.AI_PROVIDER === 'gemini') {
    return analyzeWithGemini(article);
  }

  return analyzeWithOllama(article);
}

async function analyzeWithOllama(
  article: ArticleForAnalysis,
): Promise<ArticleAnalysis> {
  const baseUrl = process.env.OLLAMA_URL ?? 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL ?? 'gemma4:e2b';

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
      body: JSON.stringify({
      model,
      stream: false,
      format: 'json',
        prompt: `You are a news analysis assistant for a personalized news dashboard.

AUDIENCE:
The dashboard is designed for a reader interested primarily in:
- Technology and software
- AI/ML and emerging AI systems
- Cybersecurity
- Finance, markets, and trading
- Business and major companies
- Important developments in India and the United States

The reader is particularly interested in significant developments that
affect technology, finance, business, markets, or the broader tech industry.

ARTICLE CATEGORY:
${article.category}

Given the article title and description:

1. Rewrite the title in simple, clear language.
   - Keep important names, companies, numbers, technologies, and events.
   - Do not remove important context.
   - If the original title is already clear, keep it mostly unchanged.

2. Summarize the article in 2-3 sentences.
   - Use ONLY information present in the title and description.
   - Do not invent or infer facts.

3. Decide whether the article is worth reading for this audience.

An article can be important news without being highly relevant to this
specific audience.

Prioritize relevance to the reader's interests rather than the general
importance of the event.

For India and US news, prioritize stories that have meaningful
connections to technology, AI, cybersecurity, business, finance,
markets, economics, regulation, or major national developments.

Do not give a high score simply because an article concerns a politician,
election, city, or other prominent public figure.
An article is more likely to be worth reading if it involves:
- A significant technology or AI development
- Important cybersecurity incidents or vulnerabilities
- Major business or company developments
- Significant financial or market developments
- Important economic or regulatory changes
- Major developments in India or the United States
- Developments with meaningful implications for technology, business,
  finance, or markets

Do NOT mark an article as highly relevant merely because it mentions:
- India or the United States
- A politician
- A city
- A company
- A generic technology term
- A keyword from the category

Routine, repetitive, promotional, entertainment, lifestyle, or
low-impact stories should generally receive lower relevance.

4. Give a relevance score from 0 to 100.

Use this scale:
90-100: Major development with strong relevance to the audience
75-89: Significant and clearly useful
60-74: Moderately useful
40-59: Some relevance but limited importance
0-39: Low relevance to this audience

5. Set worthReading to true when the article provides meaningful value
to this audience, and false when it does not.

Return JSON matching exactly this structure:

{
  "simplifiedTitle": string,
  "summary": string,
  "worthReading": boolean,
  "relevanceScore": number
}

Category: ${article.category}

Title: ${article.title}

Description: ${article.description ?? ''}`,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Ollama request failed with HTTP ${response.status}`,
    );
  }

  const payload = (await response.json()) as {
    response?: string;
  };

  if (!payload.response) {
    throw new Error('Ollama returned an empty response');
  }

  return parseAnalysis(payload.response);
}

async function analyzeWithGemini(
  _article: ArticleForAnalysis,
): Promise<ArticleAnalysis> {
  throw new Error('Gemini analysis is not configured yet');
}

function parseAnalysis(value: string): ArticleAnalysis {
  const json = value
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  const parsed = JSON.parse(json) as {
    simplifiedTitle?: unknown;
    summary?: unknown;
    worthReading?: unknown;
    relevanceScore?: unknown;
  };
  const relevanceScore = Number(parsed.relevanceScore);
  const worthReading =
    typeof parsed.worthReading === 'string'
      ? parsed.worthReading.toLowerCase() === 'true'
      : parsed.worthReading;

  if (
    typeof parsed.simplifiedTitle !== 'string' ||
    typeof parsed.summary !== 'string' ||
    typeof worthReading !== 'boolean' ||
    !Number.isFinite(relevanceScore) ||
    relevanceScore < 0 ||
    relevanceScore > 100
  ) {
    throw new Error('Invalid article analysis returned by AI provider');
  }

  return {
    simplifiedTitle: parsed.simplifiedTitle,
    summary: parsed.summary,
    worthReading,
    relevanceScore,
  };
}