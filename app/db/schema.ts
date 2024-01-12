import { pgTable, text, index, varchar, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as dotenv from "dotenv";

const envPath = process.cwd() + "/.env.local";
dotenv.config({ path: envPath });

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

export const db = drizzle(sql);

export const genUserId = () => {
  return `user_${nanoid()}`;
};

export const usersTable = pgTable(
  "users",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    username: varchar("username", { length: 256 }).notNull().unique(),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    username_idx: index("users_username_idx").on(t.username),
  })
);

export const genCategoryId = () => {
  return `category_${nanoid()}`;
};

export const categoriesTable = pgTable(
  "categories",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    name: varchar("title", { length: 256 }).notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    name_idx: index("categories_name_idx").on(t.name),
    created_at_idx: index("categories_created_at_idx").on(t.created_at),
  })
);

export const genThreadId = () => {
  return `thread_${nanoid()}`;
};

export const threadsTable = pgTable(
  "threads",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    category_id: varchar("category_id", { length: 256 }).references(
      () => categoriesTable.id
    ),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    name_idx: index("threads_name_idx").on(t.name),
    created_at_idx: index("threads_created_at_idx").on(t.created_at),
  })
);

export const genPostId = () => {
  return `post_${nanoid()}`;
};

export const postsTable = pgTable(
  "posts",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    text: text("text").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    thread_id: varchar("thread_id", { length: 256 }).references(
      () => threadsTable.id
    ),
    userId: varchar("user_id", { length: 256 }).references(() => usersTable.id),
  },
  (t) => ({
    created_at_idx: index("posts_created_at_idx").on(t.created_at),
  })
);
