import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { memoriesTable } from "./schema.ts";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";

const envPath = process.cwd() + "/.env.local";
dotenv.config({ path: envPath });

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

type MoodInsert = typeof memoriesTable.$inferInsert;

faker.seed(123);

const main = async () => {
  const db = drizzle(sql);

  const date = new Date("2020-06-06");

  const mood1: MoodInsert = {
    id: faker.string.nanoid(),
    mood: "2",
    date,
  };

  const mood2: MoodInsert = {
    id: faker.string.nanoid(),
    mood: "1",
    date,
  };

  const mood3: MoodInsert = {
    id: faker.string.nanoid(),
    mood: "0",
    date,
  };

  await db.insert(memoriesTable).values([mood1, mood2, mood3]);

  console.log("Seed done");
};

main();
