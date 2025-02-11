import { relations } from "drizzle-orm";
import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { TypeOf } from "zod";

import type { Field } from "./field";
import { fieldTable } from "./field";

export const bookingTable = sqliteTable("booking", {
  id: int().primaryKey({ autoIncrement: true }),
  reservedBy: text().notNull(),
  fieldId: int()
    .notNull()
    .references(() => fieldTable.id, { onDelete: "cascade" }),
  day: text().notNull(),
  startHour: text().notNull(),
  endHour: text().notNull(),
  bookingTotalValue: int().notNull(),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const bookingRelations = relations(bookingTable, ({ one }) => ({
  field: one(fieldTable, {
    fields: [bookingTable.fieldId],
    references: [fieldTable.id],
  }),
}));

export const createBookingSchema = createInsertSchema(bookingTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectBooking = createSelectSchema(bookingTable);

export type Booking = TypeOf<typeof selectBooking>;
export type BookingWithField = Booking & { field: Field };
export type CreateBooking = TypeOf<typeof createBookingSchema>;
export type UpdateBooking = Partial<CreateBooking>;
