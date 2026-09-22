import { ingestSources } from '@/lib/ingest';
import { processArticles } from '@/lib/processArticles';

export async function POST() {
  try {
    const ingestion = await ingestSources();
    const processing = await processArticles();

    return Response.json({
      success: true,
      ingestion,
      processing,
    });
  } catch (error) {
    console.error('News pipeline failed:', error);

    return Response.json(
      { success: false, error: 'News pipeline failed' },
      { status: 500 },
    );
  }
}