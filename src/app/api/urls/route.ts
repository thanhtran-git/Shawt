import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { urlsTable } from '@/db/schema';

const db = drizzle(process.env.POSTGRES_URL!);

export async function GET() {
  try {
    const urlList = await db.select().from(urlsTable);
    return NextResponse.json(urlList);
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json({ error: 'Failed to fetch URL List' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);
    await db.insert(urlsTable).values(body);
    return NextResponse.json({ message: 'URL successfully inserted into database' });
  } catch (error) {
    console.error('Error in POST:', error); 
    return NextResponse.json({ error: 'Failed to save URL into database' }, { status: 500 });
  }
}