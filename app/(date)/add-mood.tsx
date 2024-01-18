import { startTransition, useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import { OPTIONS } from "./constants.ts";
import { startOfDay } from "date-fns";
import type { Memory, Mood } from "@/app/db/schema.ts";

type ItemProps = {
  option: (typeof OPTIONS)[number];
  count: number;
};
function Item({ option, count }: ItemProps) {
  return (
    <div
      key={`${option.value}-${count}`}
      className="flex items-center space-x-0.5 tabular-nums sm:space-x-2"
    >
      <span>{option.label}</span>
      <span className="animate-scale-up">{count}</span>
    </div>
  );
}

const today = startOfDay(new Date());

type AddMoodProps = {
  moodCounts: { mood: Mood; count: number }[];
  addMood: () => Promise<Memory>;
  addOptimisticMood: (mood: Mood) => void;
  mood: Mood;
  setMood: (mood: Mood) => void;
};
export function AddMood({
  moodCounts,
  addMood,
  addOptimisticMood,
  mood,
  setMood,
}: AddMoodProps) {
  const [localStorageVotedToday, setLocalStorageVotedToday] = useState<
    string | null
  >(null);

  useEffect(() => {
    setLocalStorageVotedToday(localStorage.getItem(`voted-${today}`));
  }, []);

  const isVotedToday = localStorageVotedToday === "true";

  async function vote() {
    startTransition(() => {
      addOptimisticMood(mood);
    });
    await addMood();
    localStorage.setItem(`voted-${today}`, "true");
    setLocalStorageVotedToday("true");
  }

  function handleClick() {
    if (isVotedToday) {
      return;
    }
    vote();
  }

  return (
    <div className="flex w-full flex-col items-center">
      <ToggleGroup
        defaultValue="0"
        type="single"
        variant="outline"
        value={mood}
        onValueChange={(value) => setMood(value as typeof mood)}
        className="grid w-full grid-cols-5"
      >
        {OPTIONS.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className="px-2 py-1.5 sm:px-8 sm:py-4 sm:text-2xl"
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
        className="mt-2 text-base sm:text-lg"
        onClick={handleClick}
        aria-disabled={isVotedToday}
      >
        {isVotedToday ? "오늘은 이미 기록했습니다." : "마음 기록"}
      </Button>
    </div>
  );
}
