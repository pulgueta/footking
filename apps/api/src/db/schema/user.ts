import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { fieldTable } from "./field";

export const userTable = sqliteTable("user", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: int(),
  image: text(),
  role: text({ enum: ["admin", "owner"] }).notNull(),
  phone: text().unique(),
  createdAt: int().default(Date.now()),
  updatedAt: int()
    .default(Date.now())
    .$onUpdateFn(() => Date.now()),
});

export const userRelations = relations(userTable, ({ many }) => ({
  fields: many(fieldTable),
}));
