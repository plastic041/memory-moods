import { getMoods } from "./get-moods.ts";
import type { Mood } from "@/app/db/schema.ts";
import { WithOptimistic } from "./with-optimistic.tsx";

export default async function StoriesPage({ date }: { date: Date }) {
  const moods = await getMoods(date);

  const moodCounts: {
    [key in Mood]: number;
  } = moods
    .map((m) => m.mood)
    .reduce(
      (acc, mood) => {
        acc[mood] = acc[mood] + 1;
        return acc;
      },
      { "-2": 0, "-1": 0, "0": 0, "1": 0, "2": 0 },
    );

  const moodCountsArray: { mood: Mood; count: number }[] = [
    { mood: "-2", count: moodCounts[-2] },
    { mood: "-1", count: moodCounts[-1] },
    { mood: "0", count: moodCounts[0] },
    { mood: "1", count: moodCounts[1] },
    { mood: "2", count: moodCounts[2] },
  ];

  return <WithOptimistic moodCounts={moodCountsArray} date={date} />;
}
