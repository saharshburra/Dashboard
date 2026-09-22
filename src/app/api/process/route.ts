import { processArticles } from '@/lib/processArticles';

export async function POST() {
  try {
    const result = await processArticles();

    return Response.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Article processing failed:', error);

    return Response.json(
      {
        success: false,
        error: 'Article processing failed',
      },
      { status: 500 },
    );
  }
}