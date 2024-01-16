"use server";

import { type Mood, db, memoriesTable } from "@/app/db/schema.ts";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { startOfDay } from "date-fns";

export async function addMood(mood: Mood, date: string) {
  const id = nanoid();
  const startOfDate = startOfDay(new Date(date));
  await db.insert(memoriesTable).values([{ id, date: startOfDate, mood }]);

  revalidatePath("/");
}
