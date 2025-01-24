import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { urlsTable } from '@/db/schema';

const db = drizzle(process.env.POSTGRES_URL!);

export async function GET() {
  try {
    const messages = await db.select().from(urlsTable);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error in GET:', error); // Log the error
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);
    await db.insert(urlsTable).values(body);
    return NextResponse.json({ message: 'Message created successfully' });
  } catch (error) {
    console.error('Error in POST:', error); // Log the error
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}