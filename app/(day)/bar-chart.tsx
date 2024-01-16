import type { Mood } from "./constants.ts";

function map(min: number, max: number, value: number) {
  return ((value - min) * 100) / (max - min);
}

const COLORS: { [key in Mood]: string } = {
  mood_negative_2: "bg-violet-200",
  mood_negative_1: "bg-blue-200",
  mood_neutral: "bg-gray-200",
  mood_positive_1: "bg-yellow-200",
  mood_positive_2: "bg-green-200",
} as const;

type BarChartProps = {
  moodCounts: { mood: Mood; count: number }[];
};
export function BarChart({ moodCounts }: BarChartProps) {
  const minCount = 0;
  const maxCount = Math.max(
    50,
    Math.max(...moodCounts.map((moodCount) => moodCount.count)),
  );

  return (
    <div className="grid h-64 w-full grid-cols-5 place-items-center items-end gap-1">
      {moodCounts.map((moodCount) => {
        const color = COLORS[moodCount.mood];
        const y = map(minCount, maxCount, moodCount.count);
        const translateY = `translateY(calc(100% - ${y}%))`;
        return (
          <div
            key={moodCount.mood}
            className="h-full w-full min-w-0 overflow-hidden px-4"
          >
            <div
              className={`h-full w-full rounded-t-lg ${color} transition-transform duration-300 ease-in-out`}
              style={{ transform: translateY }}
            />
          </div>
        );
      })}
    </div>
  );
}
