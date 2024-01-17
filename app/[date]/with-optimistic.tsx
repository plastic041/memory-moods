"use client";

import { useOptimistic, useState } from "react";
import { AddMood } from "./add-mood.tsx";
import { BarChart } from "./bar-chart.tsx";
import type { Mood } from "@/app/db/schema.ts";
import { addMood } from "@/app/[date]/action.ts";

type WithOptimisticProps = {
  moodCounts: { mood: Mood; count: number }[];
  date: Date;
};
export function WithOptimistic({ moodCounts, date }: WithOptimisticProps) {
  const [optimisticMoodsCount, addOptimisticMood] = useOptimistic(
    moodCounts,
    (state: typeof moodCounts, newMood: Mood) => {
      return state.map((moodCount) => {
        if (moodCount.mood === newMood) {
          return {
            ...moodCount,
            count: moodCount.count + 1,
          };
        }
        return moodCount;
      });
    },
  );
  const [mood, setMood] = useState<Mood>("0");
  const addMoodBind = addMood.bind(null, mood).bind(null, date);

  return (
    <>
      <BarChart moodCounts={optimisticMoodsCount} />
      <AddMood
        date={date}
        moodCounts={optimisticMoodsCount}
        key={date.toISOString()}
        addMood={addMoodBind}
        addOptimisticMood={addOptimisticMood}
        mood={mood}
        setMood={setMood}
      />
    </>
  );
}
