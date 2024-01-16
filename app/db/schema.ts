import { pgTable, date, integer } from "drizzle-orm/pg-core";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
// import * as dotenv from "dotenv";

// const envPath = process.cwd() + "/.env.local";
// dotenv.config({ path: envPath });

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

export const db = drizzle(sql);

export const daysTable = pgTable("days", {
  created_at: date("created_at", { mode: "date" }).notNull(),
  mood_negative_2: integer("mood_negative_2").notNull(),
  mood_negative_1: integer("mood_negative_1").notNull(),
  mood_neutral: integer("mood_neutral").notNull(),
  mood_positive_1: integer("mood_positive_1").notNull(),
  mood_positive_2: integer("mood_positive_2").notNull(),
});

export type Day = typeof daysTable.$inferSelect;
