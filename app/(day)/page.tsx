import z from "zod";
import { format } from "date-fns";
import { Suspense } from "react";

import { DatePicker } from "./date-picker.tsx";
import WithData from "./with-data.tsx";

const SearchParamsSchema = z.object({
  date: z
    .string()
    .pipe(z.coerce.date())
    .optional()
    .default(format(new Date(), "yyyy-MM-dd")),
});

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = SearchParamsSchema.safeParse(searchParams);

  if (!query.success) {
    return <p>Bad request</p>;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col">
        <div className="flex justify-end">
          <DatePicker />
        </div>
        <Suspense fallback={null}>
          <WithData date={query.data.date} />
        </Suspense>
      </div>
    </div>
  );
}
