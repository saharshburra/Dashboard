import { ingestSources } from '@/lib/ingest';

export async function POST() {
    try {
        const result = await ingestSources();
        return Response.json({ success: true, ...result });
    } catch (error) {
        console.error('Ingestion failed:', error);
        return Response.json(
            { success: false, error: 'Ingestion failed' },
            { status: 500 },
        );
    }
}
