import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { urlsTable } from '@/db/schema';

const db = drizzle(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const messages = await db.select().from(urlsTable);
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body)
    await db.insert(urlsTable).values(body);
    return NextResponse.json({ message: 'Message created successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}