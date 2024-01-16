"use client";

import { useOptimistic, useState, startTransition } from "react";
import { addMood } from "./action.ts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { OPTIONS } from "./constants.ts";
import { isBefore, isAfter, sub } from "date-fns";
import type { Mood } from "@/app/db/schema.ts";

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
  date: string;
  moodCounts: { mood: Mood; count: number }[];
};
export function AddMood({ date, moodCounts }: AddMoodProps) {
  const [mood, setMood] = useState<Mood>("0");

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
  const addMoodWithMood = addMood.bind(null, mood).bind(null, date);

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
                optimisticMoodsCount.find(
                  (moodCount) => moodCount.mood === option.value,
                )?.count ?? 0
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
              return addOptimisticMood(mood);
            });
            await addMoodWithMood();
          }
        }}
        aria-disabled={!isRecentWeek}
      >
        {isRecentWeek ? "기분 기록" : `최근 일주일만 기록할 수 있습니다.`}
      </Button>
    </div>
  );
}
