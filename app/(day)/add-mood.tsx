import { startTransition } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { OPTIONS } from "./constants.ts";
import { isBefore, isAfter, sub } from "date-fns";
import type { Memory, Mood } from "@/app/db/schema.ts";

type ItemProps = {
  option: (typeof OPTIONS)[number];
  count: number;
};
function Item({ option, count }: ItemProps) {
  return (
    <div
      key={`${option.value}-${count}`}
      className="flex items-center space-x-2 tabular-nums"
    >
      <span>{option.label}</span>
      <span className="animate-scale-up">{count}</span>
    </div>
  );
}

type AddMoodProps = {
  date: Date;
  moodCounts: { mood: Mood; count: number }[];
  addMood: () => Promise<Memory>;
  addOptimisticMood: (mood: Mood) => void;
  mood: Mood;
  setMood: (mood: Mood) => void;
};
export function AddMood({
  date,
  moodCounts,
  addMood,
  addOptimisticMood,
  mood,
  setMood,
}: AddMoodProps) {
  // const [optimisticMoodsCount, addOptimisticMood] = useOptimistic(
  //   moodCounts,
  //   (state: typeof moodCounts, newMood: Mood) => {
  //     return state.map((moodCount) => {
  //       if (moodCount.mood === newMood) {
  //         return {
  //           ...moodCount,
  //           count: moodCount.count + 1,
  //         };
  //       }
  //       return moodCount;
  //     });
  //   },
  // );

  const prevWeek = sub(new Date(), { weeks: 1 });
  const isRecentWeek =
    isAfter(new Date(date), prevWeek) && isBefore(new Date(date), new Date());

  return (
    <div className="flex flex-col items-center">
      <ToggleGroup
        defaultValue="0"
        type="single"
        variant="outline"
        size="lg"
        value={mood}
        onValueChange={(value) => setMood(value as typeof mood)}
      >
        {OPTIONS.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className="text-2xl"
          >
            <Item
              option={option}
              count={
                moodCounts.find((moodCount) => moodCount.mood === option.value)
                  ?.count ?? 0
              }
            />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Button
        size="lg"
        type="button"
        className="mt-2"
        onClick={async () => {
          if (isRecentWeek) {
            startTransition(() => {
              addOptimisticMood(mood);
            });
            await addMood();
          }
        }}
        aria-disabled={!isRecentWeek}
      >
        {isRecentWeek ? "기분 기록" : `지난 일주일만 기록할 수 있습니다.`}
      </Button>
    </div>
  );
}
