import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { TypeOf } from "zod";

import { bookingTable } from "./booking";
import { fieldTable } from "./field";

export const userTable = sqliteTable(
  "user",
  {
    id: text()
      .primaryKey()
      .unique()
      .$defaultFn(() => crypto.randomUUID()),
    name: text().notNull(),
    email: text().notNull().unique(),
    emailVerified: integer({ mode: "boolean" }).notNull(),
    image: text(),
    role: text({ enum: ["admin", "owner"] }).notNull(),
    phoneNumber: text().unique(),
    phoneNumberVerified: integer({ mode: "boolean" }),
    phone: text().notNull().unique(),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer({ mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    uniqueIndex("by_id_idx").on(t.id),
    uniqueIndex("by_email_idx").on(t.email),
    index("by_user_name_idx").on(t.name),
    uniqueIndex("by_phoneNumber_idx").on(t.phoneNumber),
  ],
);

export const userRelations = relations(userTable, ({ many }) => ({
  fields: many(fieldTable),
  bookings: many(bookingTable),
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
