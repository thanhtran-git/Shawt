import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { urlsTable } from '@/db/schema';
import { eq } from "drizzle-orm";

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

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required for deletion' }, { status: 400 });
    }

    const existingUrl = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.id, Number(id)))
    .limit(1);

    if (existingUrl.length === 0) {
      return NextResponse.json({ error: 'URL not found' }, { status: 404 });
    }

    await db.delete(urlsTable).where(eq(urlsTable.id, Number(id)));
    return NextResponse.json({ message: 'URL successfully deleted' });
  } catch (error) {
    console.error('Error in DELETE:', error);
    return NextResponse.json({ error: 'Failed to delete URL from database' }, { status: 500 });
  }
}