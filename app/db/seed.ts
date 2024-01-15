import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { nanoid } from "nanoid/non-secure";
import {
  usersTable,
  categoriesTable,
  postsTable,
  threadsTable,
} from "./schema.ts";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";

const envPath = process.cwd() + "/.env.local";
dotenv.config({ path: envPath });

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

type UserInsert = typeof usersTable.$inferInsert;
type CategoryInsert = typeof categoriesTable.$inferInsert;
type ThreadInsert = typeof threadsTable.$inferInsert;
type PostInsert = typeof postsTable.$inferInsert;

faker.seed(123);

const main = async () => {
  const db = drizzle(sql);

  const data: (typeof usersTable.$inferInsert)[] = [];

  const user1: UserInsert = {
    id: nanoid(),
    username: "user1",
    created_at: new Date(),
  };

  const user2: UserInsert = {
    id: nanoid(),
    username: "user2",
    created_at: new Date(),
  };

  const category1: CategoryInsert = {
    id: nanoid(),
    name: "category1",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const category2: CategoryInsert = {
    id: nanoid(),
    name: "category2",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const thread1: ThreadInsert = {
    id: nanoid(),
    name: "thread1",
    category_id: category1.id,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const thread2: ThreadInsert = {
    id: nanoid(),
    name: "thread2",
    category_id: category2.id,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const post1: PostInsert = {
    id: nanoid(),
    thread_id: thread1.id,
    text: faker.lorem.paragraph(),
    created_at: new Date(),
    user_id: user1.id,
  };

  const post2: PostInsert = {
    id: nanoid(),
    thread_id: thread1.id,
    text: faker.lorem.paragraph(),
    created_at: new Date(),
    user_id: user2.id,
  };

  const post3: PostInsert = {
    id: nanoid(),
    thread_id: thread2.id,
    text: faker.lorem.paragraph(),
    created_at: new Date(),
    user_id: user1.id,
  };

  console.log("Seed start");

  await db.insert(usersTable).values([user1, user2]);
  await db.insert(categoriesTable).values([category1, category2]);
  await db.insert(threadsTable).values([thread1, thread2]);
  await db.insert(postsTable).values([post1, post2, post3]);

  console.log("Seed done");
};

main();
