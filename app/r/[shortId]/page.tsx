import { redirect } from "next/navigation";
import { urlsTable } from "@/db/schema";
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from "drizzle-orm";

const db = drizzle(process.env.POSTGRES_URL!);

type paramsType = Promise<{ shortId: string }>

export default async function RedirectPage(props: { params : paramsType}) {
  const { shortId } = await props.params;
  let destination: string | undefined
  
  try {
    const [urlEntry] = await db
      .select()      
      .from(urlsTable)
      .where(eq(urlsTable.shortId, shortId))
      .limit(1);

    destination = urlEntry?.longUrl; 

    await db
    .update(urlsTable)
    .set({ views: urlEntry.views + 1})
    .where(eq(urlsTable.shortId, shortId));

  } catch {
    console.error(`No URL found for shortId: ${shortId}`);
    redirect("/404")
  }

  if (!destination) {
    return <div>404 URL Not Found.</div>
  }



  redirect(destination);
}