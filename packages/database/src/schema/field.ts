import { relations } from "drizzle-orm";
import { index, int, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { TypeOf } from "zod";

import { bookingTable } from "./booking";
import { userTable } from "./user";

export type FieldAvailability = {
  [day: string]: {
    open: string;
    close: string;
  };
};

export const fieldTable = sqliteTable(
  "field",
  {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull().unique(),
    address: text().notNull(),
    state: text().notNull(),
    city: text().notNull(),
    hourlyRate: int().notNull(),
    userId: text()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    availability: text({ mode: "json" }).$type<FieldAvailability>().notNull(),
    daysToBookAhead: int().notNull(),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
    updatedAt: integer({ mode: "timestamp" })
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    index("by_userId_idx").on(t.userId),
    index("by_createdAt_idx").on(t.createdAt),
    uniqueIndex("by_field_name_idx").on(t.name),
  ],
);

export const fieldRelations = relations(fieldTable, ({ many }) => ({
  bookings: many(bookingTable),
}));

export const createFieldSchema = createInsertSchema(fieldTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const fieldSchema = createSelectSchema(fieldTable);

export type Field = TypeOf<typeof fieldSchema>;
export type CreateField = TypeOf<typeof createFieldSchema>;
export type UpdateField = Partial<CreateField>;
