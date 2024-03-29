import { type Memory, memoriesTable, db } from "@/app/db/schema.ts";
import { eq } from "drizzle-orm";
import { startOfDay } from "date-fns";

export async function getMoods(date: Date = new Date()): Promise<Memory[]> {
  const nextDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1,
  );
  const [start, end] = [startOfDay(date), startOfDay(nextDate)];

  const moods = await db
    .select({
      id: memoriesTable.id,
      mood: memoriesTable.mood,
      date: memoriesTable.date,
    })
    .from(memoriesTable)
    .where(eq(memoriesTable.date, start));

  return moods;
}
