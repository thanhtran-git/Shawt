import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { urlsTable } from '@/db/schema';
import { eq, inArray } from "drizzle-orm";

const db = drizzle(process.env.POSTGRES_URL!);

// ✅ GET: Fetch URLs that match stored shortIds from localStorage
export async function GET(request: NextRequest) {
  try {
    // Parse shortIds from query string (localStorage cannot be accessed directly in API)
    const shortIdsParam = request.nextUrl.searchParams.get('shortIds');
    if (!shortIdsParam) return NextResponse.json([]);

    const shortIds = shortIdsParam.split(',');

    const filteredUrls = await db.select().from(urlsTable).where(inArray(urlsTable.shortId, shortIds));
    return NextResponse.json(filteredUrls);
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json({ error: 'Failed to fetch URLs' }, { status: 500 });
  }
}

// ✅ POST: Insert new URL, return shortId
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Request body:', body);

    await db.insert(urlsTable).values(body);

    return NextResponse.json({ shortId: body.shortId, message: 'URL successfully inserted' });
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json({ error: 'Failed to save URL' }, { status: 500 });
  }
}

// ✅ DELETE: Remove URL from database
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required for deletion' }, { status: 400 });
    }

    const existingUrl = await db.select().from(urlsTable).where(eq(urlsTable.id, Number(id))).limit(1);
    if (existingUrl.length === 0) {
      return NextResponse.json({ error: 'URL not found' }, { status: 404 });
    }

    await db.delete(urlsTable).where(eq(urlsTable.id, Number(id)));

    return NextResponse.json({ message: 'URL successfully deleted' });
  } catch (error) {
    console.error('Error in DELETE:', error);
    return NextResponse.json({ error: 'Failed to delete URL' }, { status: 500 });
  }
}
