import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Proxy to NestJS Backend
        // Assuming Backend is running on localhost:3001 or similar.
        // In a real environment, this should be an env var.
        const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

        const res = await fetch(`${BACKEND_URL}/api/intentify2/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json({ error: `Backend Error: ${text}` }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Proxy Error:', error);
        return NextResponse.json(
            { error: `Proxy Failed: ${error.message}` },
            { status: 500 }
        );
    }
}
