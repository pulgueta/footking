import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { TypeOf } from "zod";

import { fieldTable } from "./field";

export const userTable = sqliteTable(
  "user",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text().notNull(),
    email: text().notNull().unique(),
    emailVerified: integer({ mode: "boolean" }).notNull(),
    image: text(),
    role: text({ enum: ["admin", "owner"] }).default("owner"),
    phoneNumber: text().unique(),
    phoneNumberVerified: integer({ mode: "boolean" }),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
    updatedAt: integer({ mode: "timestamp" })
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("by_id_idx").on(t.id),
    uniqueIndex("by_phoneNumber_idx").on(t.phoneNumber),
    index("by_user_name_idx").on(t.name),
  ],
);

export const userRelations = relations(userTable, ({ many }) => ({
  fields: many(fieldTable),
}));

export const createUserSchema = createInsertSchema(userTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const userSchema = createSelectSchema(userTable);

export type User = TypeOf<typeof userSchema>;
export type CreateUser = TypeOf<typeof createUserSchema>;
export type UpdateUser = Partial<CreateUser>;
