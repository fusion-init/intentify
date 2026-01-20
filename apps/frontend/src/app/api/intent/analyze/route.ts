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
    try {
        const body = await request.json();
        const { query } = QuerySchema.parse(body);
        const queryHash = Buffer.from(query).toString('base64');

        // 1. Check Redis Cache
        const cachedResult = await redis.get(`intent:${queryHash}`);
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
            } catch (e) {
                console.error("AI Parse Error:", e);
                analysisResult = {
                    intent_type: "General Research",
                    confidence: "Low",
                    user_goal: "Understand topic",
                    keywords: query.split(" ")
                };
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

        // 3. Save to History
        await sql`
      INSERT INTO query_history (query_text, intent_type, confidence, result)
      VALUES (${query}, ${analysisResult.intent_type}, ${analysisResult.confidence}, ${JSON.stringify(analysisResult)})
    `;

        // 4. Cache Result
        await redis.set(`intent:${queryHash}`, analysisResult, { ex: 3600 });

        return NextResponse.json({ ...analysisResult, source: 'api' });

    } catch (error) {
        console.error("Analysis Error:", error);
        return NextResponse.json(
            { error: 'Failed to analyze query' },
            { status: 500 }
        );
    }
}
