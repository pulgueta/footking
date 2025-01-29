import { index, int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { TypeOf } from "zod";

import { userTable } from "./user";

export const fieldTable = sqliteTable(
  "field",
  {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    address: text().notNull(),
    state: text().notNull(),
    hourlyRate: int().notNull(),
    userId: int()
      .notNull()
      .references(() => userTable.id),
    createdAt: integer({ mode: "timestamp" }),
    updatedAt: integer({ mode: "timestamp" }),
  },
  (t) => [
    index("by_userId_idx").on(t.userId),
    index("by_createdAt_idx").on(t.createdAt),
    index("by_name_idx").on(t.name),
  ],
);

export const createFieldSchema = createInsertSchema(fieldTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const fieldSchema = createSelectSchema(fieldTable);

export type Field = TypeOf<typeof fieldSchema>;
export type CreateField = TypeOf<typeof createFieldSchema>;
