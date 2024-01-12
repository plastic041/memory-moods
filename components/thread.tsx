import { db, postsTable, threadsTable, usersTable } from "@/app/db/schema";
import { sql, asc } from "drizzle-orm";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { TimeAgo } from "@/components/time-ago";
import Link from "next/link";

async function getData({ threadId }: { threadId?: string }) {
  const thread = (
    await db
      .select({
        id: threadsTable.id,
        name: threadsTable.name,
        category_id: threadsTable.category_id,
        created_at: threadsTable.created_at,
      })
      .from(threadsTable)
      .where(
        threadId != null ? sql`${threadsTable.id} = ${threadId}` : sql`1 = 1`
      )
      .limit(1)
  )[0];

  const posts = await db
    .select({
      id: postsTable.id,
      thread_id: postsTable.thread_id,
      user_id: usersTable.id,
      text: postsTable.text,
      created_at: postsTable.created_at,
    })
    .from(postsTable)
    .where(sql`${postsTable.thread_id} = ${thread.id}`)
    .orderBy(asc(postsTable.created_at))
    .leftJoin(usersTable, sql`${postsTable.userId} = ${usersTable.id}`);

  return { thread, posts };
}

type Thread = Awaited<ReturnType<typeof getData>>["thread"];
type Post = Awaited<ReturnType<typeof getData>>["posts"][0];

export async function ThreadView({ threadId }: { threadId: string }) {
  const rid = headers().get("x-vercel-id") ?? nanoid();

  console.time(`fetch threads ${threadId} (req: ${rid})`);
  const { thread, posts } = await getData({ threadId });
  console.timeEnd(`fetch threads ${threadId} (req: ${rid})`);

  return (
    <article className="flex flex-col">
      <ThreadHeader thread={thread} />
      <PostList posts={posts} />
    </article>
  );
}

function ThreadHeader({ thread }: { thread: Thread }) {
  return <h2 className="h2">{thread.name}</h2>;
}

function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="flex flex-col">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  );
}

function PostItem({ post }: { post: Post }) {
  const now = Date.now();
  return (
    <li>
      <p className="p">{post.text}</p>
      <span className="p muted">
        <TimeAgo date={post.created_at} now={now} />
      </span>
    </li>
  );
}
