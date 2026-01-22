import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // SINGLE SOURCE OF TRUTH: BASE_API_PATH = "/intentify"
        // Ensure this matches the backend controller.
        const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

        // Correct Path: /intentify/analyze
        const targetUrl = `${BACKEND_URL}/intentify/analyze`;

        const res = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        // Pass through status code from backend
        return NextResponse.json(data, { status: res.status });

    } catch (error: any) {
        // FAIL SAFE PROXY ERROR
        console.error('[Proxy Error] Request failed:', error);

        return NextResponse.json(
            {
                success: false,
                error_code: 'PROXY_CONNECTION_ERROR',
                message: 'Unable to connect to Intentify Backend. Please ensure the server is running on port 3001.',
                debug: error.message
            },
            { status: 503 } // Service Unavailable
        );
    }
}
