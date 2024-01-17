import z from "zod";
import { format } from "date-fns";
import { Suspense } from "react";

import { DatePicker } from "./date-picker.tsx";
import WithData from "./with-data.tsx";
import { AddMoodLoader } from "@/app/[date]/add-mood-loader.tsx";

const ParamsSchema = z
  .string()
  .pipe(z.coerce.date())
  .optional()
  .default(format(new Date(), "yyyy-MM-dd"));

export default async function Page({
  params,
}: {
  params: {
    date: string;
  };
}) {
  const date = ParamsSchema.parse(params.date);

  return (
    <div className="mx-auto flex h-full w-full max-w-xs flex-col justify-center sm:max-w-2xl">
      <div className="flex flex-col">
        <div className="flex justify-end">
          <DatePicker />
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
