import z from "zod";
import { headers as dynamic } from "next/headers";
import { ThreadsView } from "@/app/(stories)/threads";

const SearchParamsSchema = z.object({
  p: z.coerce.number().min(1).max(100).optional().default(1),
});

/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/Clo34SuEDxI
 */

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  dynamic();

  // const query = SearchParamsSchema.safeParse(searchParams);

  // if (!query.success) {
  //   return <p>Bad request</p>;
  // }

  // const page = query.data.p;

  return <ThreadsView />;
}
