import { daysTable, type Day, db } from "@/app/db/schema.ts";
import { eq } from "drizzle-orm";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export async function getDay(date: Date = new Date()): Promise<Day> {
  const start = startOfDay(date);

  const day = (
    await db
      .select({
        created_at: daysTable.created_at,
        mood_negative_2: daysTable.mood_negative_2,
        mood_negative_1: daysTable.mood_negative_1,
        mood_neutral: daysTable.mood_neutral,
        mood_positive_1: daysTable.mood_positive_1,
        mood_positive_2: daysTable.mood_positive_2,
      })
      .from(daysTable)
      .where(eq(daysTable.created_at, start))
      .limit(0)
  )[0];

  return day;
}
