import { db, postsTable, threadsTable } from "@/app/db/schema";
import { sql, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import Link from "next/link";
import { Button } from "@/components/ui/button.tsx";

async function getThreads(categoryId?: string) {
  const threads = await db
    .select({
      id: threadsTable.id,
      name: threadsTable.name,
      category_id: threadsTable.category_id,
      created_at: threadsTable.created_at,
      posts: sql<number>`cast(count(${postsTable.id}) as int)`,
    })
    .from(threadsTable)
    .where(
      categoryId != null
        ? sql`${threadsTable.category_id} = ${categoryId}`
        : sql`1 = 1`
    )
    .leftJoin(postsTable, eq(threadsTable.id, postsTable.thread_id))
    .groupBy(threadsTable.id)
    .orderBy(asc(threadsTable.created_at));

  return threads;
}

export async function ThreadsView({ categoryId }: { categoryId?: string }) {
  const rid = headers().get("x-vercel-id") ?? nanoid();

  console.time(`fetch threads ${categoryId} (req: ${rid})`);
  const threads = await getThreads(categoryId);
  console.timeEnd(`fetch threads ${categoryId} (req: ${rid})`);

  return (
    <article className="flex flex-col w-full">
      <h2 className="h2">Threads</h2>

      <ul className="flex flex-col mt-16 space-y-4">
        {threads.map((thread) => (
          <li key={thread.id}>
            <Button asChild variant="link">
              <Link href={`/thread/${thread.id}`}>
                <h2 className="h3">{thread.name}</h2>
              </Link>
            </Button>
            <span className="small">{thread.posts} posts</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
