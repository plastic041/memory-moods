import { format, startOfDay } from "date-fns";
import { Suspense } from "react";

import WithData from "./with-data.tsx";
import { AddMoodLoader } from "@/app/(date)/add-mood-loader.tsx";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  const date = startOfDay(new Date());

  return {
    title: `Mood for ${format(date, "yyyy-MM-dd, EEEE")}`,
    description: `Mood for ${format(date, "yyyy-MM-dd, EEEE")}`,
  };
}

export default async function Page() {
  const date = startOfDay(new Date());

  return (
    <div className="mx-auto flex h-full w-full max-w-xs flex-col justify-center sm:max-w-2xl">
      <div className="flex flex-col">
        <div className="flex">
          <h2 className="h2 w-full text-right">
            {format(date, "yyyy-MM-dd, EEEE")}
          </h2>
        </div>
        <div className="mt-8 flex h-[320px] flex-col items-center">
          <Suspense
            fallback={
              <div className="flex h-full w-full items-end">
                <AddMoodLoader />
              </div>
            }
            key={date.toISOString()}
          >
            <WithData date={date} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
