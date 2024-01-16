import { pgTable, varchar, index, pgEnum, date } from "drizzle-orm/pg-core";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
// import * as dotenv from "dotenv";

// const envPath = process.cwd() + "/.env.local";
// dotenv.config({ path: envPath });

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

export const db = drizzle(sql);

export const moodEnum = pgEnum("mood", ["-2", "-1", "0", "1", "2"]);

export const memoriesTable = pgTable(
  "memories",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    date: date("date", { mode: "date" }).notNull(),
    mood: moodEnum("mood").notNull(),
  },
  (table) => ({
    date_index: index("date_index").on(table.date),
  }),
);

export type Memory = typeof memoriesTable.$inferSelect;
export type Mood = Memory["mood"];
