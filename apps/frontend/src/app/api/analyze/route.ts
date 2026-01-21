import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { redis } from '@/lib/redis';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const QuerySchema = z.object({
    query: z.string().min(3).max(500),
});

export async function POST(request: Request) {
    console.log('API /api/analyze: Request received');
    console.log('API /api/analyze: GOOGLE_API_KEY present?', !!process.env.GOOGLE_API_KEY);
    try {
        const body = await request.json();
        const { query } = QuerySchema.parse(body);
        const queryHash = Buffer.from(query).toString('base64');

        // 1. Check Redis Cache (Optional)
        let cachedResult;
        try {
            if (process.env.UPSTASH_REDIS_REST_URL) {
                cachedResult = await redis.get(`intent:${queryHash}`);
            }
        } catch (e) {
            console.warn("Redis Cache Error (Ignored):", e);
        }

        if (cachedResult) {
            return NextResponse.json({ ...cachedResult as object, source: 'cache' });
        }

        // 2. Call Google Gemini API
        let analysisResult;

        if (process.env.GOOGLE_API_KEY) {
            const prompt = `Analyze the search intent for: "${query}". Return a valid JSON object (no markdown formatting) with the following fields: intent_type, confidence(High/Medium/Low), user_goal, content_suggestions(array of strings), keywords(array of strings), seo_priority(High/Medium/Low).`;

            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();

                // Cleanup generic markdown wrappers if present
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();

                analysisResult = JSON.parse(text);
            } catch (e: any) {
                console.error("AI Parse Error:", e);
                // Return actual error if AI fails
                return NextResponse.json(
                    { error: `AI Processing Failed: ${e.message || 'Unknown error'}` },
                    { status: 500 }
                );
            }

        } else {
            // Mock fallback
            await new Promise(r => setTimeout(r, 1000));
            analysisResult = {
                intent_type: "Commercial Investigation (Mock)",
                confidence: "High",
                user_goal: `Analyze: ${query}`,
                content_suggestions: ["Top 10 Guide", "Buyer's Guide"],
                keywords: query.split(" "),
                seo_priority: "Medium"
            };
        }

        // 3. Save to History (Optional)
        try {
            if (process.env.POSTGRES_URL) {
                await sql`
                  INSERT INTO query_history (query_text, intent_type, confidence, result)
                  VALUES (${query}, ${analysisResult.intent_type}, ${analysisResult.confidence}, ${JSON.stringify(analysisResult)})
                `;
            }
        } catch (e) {
            console.warn("Database Save Error (Ignored):", e);
        }

        // 4. Cache Result (Optional)
        try {
            if (process.env.UPSTASH_REDIS_REST_URL) {
                await redis.set(`intent:${queryHash}`, analysisResult, { ex: 3600 });
            }
        } catch (e) {
            console.warn("Redis Set Error (Ignored):", e);
        }

        return NextResponse.json({ ...analysisResult, source: 'api' });

    } catch (error: any) {
        console.error("Analysis Error:", error);
        return NextResponse.json(
            { error: `Critical Failure: ${error.message || JSON.stringify(error)}` },
            { status: 500 }
        );
    }
}
