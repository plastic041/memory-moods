import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { OPTIONS } from "./constants.ts";
import { Button } from "@/components/ui/button.tsx";
import { LoaderIcon } from "lucide-react";

type ItemProps = {
  option: (typeof OPTIONS)[number];
};
function Item({ option }: ItemProps) {
  return (
    <div
      key={`${option.value}`}
      className="flex items-center space-x-0.5 tabular-nums sm:space-x-2"
    >
      <span>{option.label}</span>
      <div className="h-2 w-2 animate-pulse bg-slate-200 sm:h-6 sm:w-4" />
    </div>
  );
}

export function AddMoodLoader() {
  return (
    <div className="flex w-full flex-col items-center">
      <ToggleGroup
        type="single"
        variant="outline"
        className="grid w-full grid-cols-5"
      >
        {OPTIONS.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className="px-2 py-1.5 sm:px-8 sm:py-4 sm:text-2xl"
          >
            <Item option={option} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Button size="lg" type="button" className="mt-2" aria-disabled>
        <LoaderIcon className="animate-spin" />
      </Button>
    </div>
  );
}
