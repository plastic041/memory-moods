import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { daysTable } from "./schema.ts";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";

const envPath = process.cwd() + "/.env.local";
dotenv.config({ path: envPath });

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

type DayInsert = typeof daysTable.$inferInsert;

faker.seed(123);

const main = async () => {
  const db = drizzle(sql);

  const date = new Date("2024-01-16");

  const day1: DayInsert = {
    created_at: date,
    mood_negative_2: faker.number.int({ min: 0, max: 100 }),
    mood_negative_1: faker.number.int({ min: 0, max: 100 }),
    mood_neutral: faker.number.int({ min: 0, max: 100 }),
    mood_positive_1: faker.number.int({ min: 0, max: 100 }),
    mood_positive_2: faker.number.int({ min: 0, max: 100 }),
  };

  await db.insert(daysTable).values([day1]);

  console.log("Seed done");
};

main();
