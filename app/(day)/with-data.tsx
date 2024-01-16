import { getDay } from "./get-moods.ts";
import { AddMood } from "./add-mood.tsx";
import { BarChart } from "./bar-chart.tsx";
import { MOODS } from "./constants.ts";

export default async function WithData({ date }: { date: string }) {
  const day = await getDay(new Date(date));
  const moodCounts = MOODS.map((mood) => {
    const moodCount = day[mood];
    return {
      mood,
      count: moodCount,
    };
  });

  return (
    <>
      <div className="mt-4 flex flex-col items-center">
        <BarChart moodCounts={moodCounts} />
      </div>
      <div className="flex">
        <AddMood date={date} moodCounts={moodCounts} key={date} />
      </div>
    </>
  );
}
