import { db, postsTable, threadsTable, usersTable } from "@/app/db/schema";
import { sql, asc } from "drizzle-orm";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { TimeAgo } from "@/components/time-ago";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { revalidatePath } from "next/cache";

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
      user_name: usersTable.username,
      text: postsTable.text,
      created_at: postsTable.created_at,
    })
    .from(postsTable)
    .where(sql`${postsTable.thread_id} = ${thread.id}`)
    .orderBy(asc(postsTable.created_at))
    .leftJoin(usersTable, sql`${postsTable.user_id} = ${usersTable.id}`);

  return { thread, posts };
}

// async function postData({ threadId }: { threadId: string }) {

//   return post;
// }

type Thread = Awaited<ReturnType<typeof getData>>["thread"];
type Post = Awaited<ReturnType<typeof getData>>["posts"][0];

export async function ThreadView({ threadId }: { threadId: string }) {
  const rid = headers().get("x-vercel-id") ?? nanoid();

  console.time(`fetch threads ${threadId} (req: ${rid})`);
  const { thread, posts } = await getData({ threadId });
  console.timeEnd(`fetch threads ${threadId} (req: ${rid})`);

  return (
    <article className="flex flex-col w-full">
      <ThreadHeader thread={thread} />
      <div className="mt-16 max-w-[65ch]">
        <PostList posts={posts} />
        <div className="mt-8">
          <PostForm threadId={threadId} />
        </div>
      </div>
    </article>
  );
}

function ThreadHeader({ thread }: { thread: Thread }) {
  return (
    <div className="flex flex-row w-full">
      <Button
        size="icon"
        variant="ghost"
        className="shrink-0 md:-ml-11 ml-0"
        asChild
      >
        <Link href="/">
          <ArrowLeftIcon />
        </Link>
      </Button>
      <h2 className="h2 grow mt-0 ml-2">{thread.name}</h2>
    </div>
  );
}

function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="flex flex-col space-y-4">
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
      <Card>
        <CardHeader>
          <CardTitle>{post.user_name}</CardTitle>
          <CardDescription>
            {post.created_at.toLocaleString()}
            {" - "}
            <TimeAgo date={post.created_at} now={now} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="p">{post.text}</p>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </li>
  );
}

function PostForm({ threadId }: { threadId: string }) {
  async function handleSubmit(formData: FormData) {
    "use server";

    const text = formData.get("text") as string;

    await db
      .insert(postsTable)
      .values({
        id: nanoid(),
        text,
        created_at: new Date(),
        thread_id: threadId,
        user_id: "SmzFVObi8hQYX7ccKLWML",
      })
      .execute();

    revalidatePath("/thread/[id]", "page");
  }

  return (
    <form className="flex flex-col space-y-4" action={handleSubmit}>
      <div className="flex flex-col">
        <label className="label" htmlFor="text">
          New Post
        </label>
        <Textarea className="mt-2" name="text" id="text" />
      </div>
      <Button type="submit" variant="default">
        Post
      </Button>
    </form>
  );
}
