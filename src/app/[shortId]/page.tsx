import { redirect } from "next/navigation";
import { urlsTable } from "@/db/schema";
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from "drizzle-orm";

const db = drizzle(process.env.POSTGRES_URL!);

interface RedirectPageProps {
  params: { shortId: string };
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  const { shortId } = params;
  let destination: string | undefined
  
  try {
    const [urlEntry] = await db
      .select()      
      .from(urlsTable)
      .where(eq(urlsTable.shortId, String(shortId)))
      .limit(1);

    destination = urlEntry?.longUrl; 
  } catch {
    console.error(`No URL found for shortId: ${shortId}`);
    redirect("/404")
  }

  if (!destination) {
    return <div>404 URL Not Found.</div>
  }
  redirect(destination);
}