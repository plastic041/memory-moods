"use server";

import { Mood, db, moodsTable } from "@/app/db/schema.ts";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function addMood(mood: Mood["mood"]) {
  const id = nanoid();
  const created_at = new Date();

  await db.insert(moodsTable).values([{ id, mood, created_at }]);

  revalidatePath("/");
}
