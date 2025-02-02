import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { TypeOf } from "zod";

import { fieldTable } from "./field";
import { userTable } from "./user";

export const bookingTable = sqliteTable("booking", {
  id: int().primaryKey({ autoIncrement: true }),
  userId: text()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  fieldId: int()
    .notNull()
    .references(() => fieldTable.id, { onDelete: "cascade" }),
  day: text().notNull(),
  startHour: text().notNull(),
  endHour: text().notNull(),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const createBookingSchema = createInsertSchema(bookingTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectBooking = createSelectSchema(bookingTable);

export type Booking = TypeOf<typeof selectBooking>;
export type CreateBooking = TypeOf<typeof createBookingSchema>;
export type UpdateBooking = Partial<CreateBooking>;
