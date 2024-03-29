"use client";

import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function DatePicker() {
  const router = useRouter();
  const { date: dateParam } = useParams();
  invariant(typeof dateParam === "string", "dateParam must be a string");

  const date = dateParam ? new Date(dateParam) : new Date();

  function setDate(date: Date | undefined) {
    if (!date) {
      return;
    }

    router.push(`/${format(date, "yyyy-MM-dd")}`);
  }

  return (
    <div className="flex flex-row gap-2">
      <Button
        variant="outline"
        onClick={() => {
          setDate(new Date());
        }}
      >
        오늘
      </Button>
      <Button
        size="icon"
        variant="outline"
        className="ml-4"
        onClick={() => {
          const prevDay = new Date(date);
          prevDay.setDate(prevDay.getDate() - 1);

          setDate(prevDay);
        }}
      >
        <ArrowLeftIcon className="h-4 w-4" />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              <span className="tabular-nums">{format(date, "yyyy-MM-dd")}</span>
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Button
        size="icon"
        variant="outline"
        onClick={() => {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);

          setDate(nextDay);
        }}
      >
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
