"use server";

import { type Mood, db, memoriesTable } from "@/app/db/schema.ts";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { startOfDay } from "date-fns";

export async function addMood(mood: Mood, date: Date) {
  const id = nanoid();
  const startOfDate = startOfDay(date);
  const memory = (
    await db
      .insert(memoriesTable)
      .values([{ id, date: startOfDate, mood }])
      .returning()
  )[0];

  revalidatePath("/");

  console.log(memory);
  return memory;
}
