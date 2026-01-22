import { NextResponse } from 'next/server';

export async function GET() {
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

    try {
        // Call Backend Health Check
        const res = await fetch(`${BACKEND_URL}/intentify/health`, {
            next: { revalidate: 0 } // No cache
        });

        if (res.ok) {
            const data = await res.json();
            return NextResponse.json(data);
        } else {
            return NextResponse.json({ status: 'error', message: 'Backend unhealthy' }, { status: 503 });
        }
    } catch (error) {
        return NextResponse.json({ status: 'down', message: 'Backend unreachable' }, { status: 503 });
    }
}
