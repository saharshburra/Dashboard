const KEYWORDS = {
  India: [
    "india",
    "indian",
    "modi",
    "bjp",
    "congress",
    "telangana",
    "bengaluru",
    "noida",
    "delhi",
    "mumbai",
    "supreme court",
    "parliament",
    "lok sabha",
    "rajya sabha",
    "rbi",
    "election",
    "tech",
    "trading",
    "finance",
  ],

  US: [
    "united states",
    "u.s.",
    "american",
    "trump",
    "senate",
    "congress",
    "white house",
    "federal reserve",
    "fed",
    "tariff",
    "supreme court",
    "election",
    "tech",
    "trading",
    "finance",
    "georgia",
  ],

  "AI/ML": [
    "artificial intelligence",
    "ai model",
    "ai agent",
    "agentic ai",
    "machine learning",
    "llm",
    "large language model",
    "language model",
    "foundation model",
    "transformer",
    "generative ai",
    "openai",
    "anthropic",
    "gemini",
    "deep learning",
    "inference",
    "fine-tuning",
    "model training",
    "pytorch",
    "gpu",
    "ai chip",
    "neural network",
    "computer vision",
    "natural language processing",
    "reinforcement learning",
  ],

  Cybersecurity: [
    "cybersecurity",
    "cyber attack",
    "cyberattack",
    "vulnerability",
    "cve",
    "zero-day",
    "exploit",
    "ransomware",
    "malware",
    "phishing",
    "data breach",
    "botnet",
    "ddos",
    "identity theft",
    "security vulnerability",
    "threat actor",
    "apt",
  ],
};

export type CandidateCategory = keyof typeof KEYWORDS;

export type CandidateArticle = {
  title?: string;
  description?: string;
};

export function isRelevant(
  article: CandidateArticle,
  category: string,
): boolean {
  const text = `${article.title ?? ''} ${article.description ?? ''}`.toLowerCase();
  const keywords = KEYWORDS[category as CandidateCategory];

  if (!keywords) {
    return false;
  }

  return keywords.some((keyword) =>
    text.includes(keyword.toLowerCase()),
  );
}