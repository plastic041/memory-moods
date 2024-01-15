import { db, categoriesTable } from "@/app/db/schema";
import { desc } from "drizzle-orm";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { ilike } from "drizzle-orm";
import Link from "next/link";
import Highlighter from "react-highlight-words";
import { TimeAgo } from "@/components/time-ago";

const PER_PAGE = 30;

export async function getCategoriesCount() {
  const count = await db
    .select({ id: categoriesTable.id })
    .from(categoriesTable);

  return count.length;
}

export async function getCategories({
  q,
  limit = PER_PAGE,
}: {
  q: string | null;
  limit?: number;
}) {
  return await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      created_at: categoriesTable.created_at,
      updated_at: categoriesTable.updated_at,
    })
    .from(categoriesTable)
    .orderBy(desc(categoriesTable.created_at))
    .where(categoriesWhere({ q }))
    .limit(limit);
}

function categoriesWhere({ q }: { q: string | null }) {
  return q != null && q.length
    ? ilike(categoriesTable.name, `%${q}%`)
    : undefined;
}

export async function Categories({ q = null }: { q?: string | null }) {
  const uid = headers().get("x-vercel-id") ?? nanoid();
  console.time(`fetch categories ${uid}`);
  const categories = await getCategories({ q });
  console.timeEnd(`fetch categories ${uid}`);

  const now = Date.now();
  return categories.length ? (
    <div>
      <ul className="space-y-2">
        {categories.map((category, n) => {
          return (
            <li key={category.id} className="flex gap-2">
              <div>
                <Link
                  prefetch={true}
                  href={`/item/${category.id.replace(/^category_/, "")}`}
                  className="text-[#000000] hover:underline"
                >
                  {q == null ? (
                    category.name
                  ) : (
                    <Highlighter
                      searchWords={[q]}
                      autoEscape={true}
                      textToHighlight={category.name}
                    />
                  )}
                </Link>
                <p className="text-xs text-[#666] md:text-[#828282]">
                  <TimeAgo now={now} date={category.created_at} /> |{" "}
                  <span
                    className="cursor-default"
                    aria-hidden="true"
                    title="Not implemented"
                  >
                    flag
                  </span>{" "}
                  |{" "}
                  <span
                    className="cursor-default"
                    aria-hidden="true"
                    title="Not implemented"
                  >
                    hide
                  </span>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  ) : (
    <div>No categories to show</div>
  );
}
