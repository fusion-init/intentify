import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        if (!process.env.POSTGRES_URL) {
            return NextResponse.json([]);
        }
        const { rows } = await sql`
      SELECT * FROM query_history 
      ORDER BY created_at DESC 
      LIMIT 10
    `;

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json([]);
    }
}
