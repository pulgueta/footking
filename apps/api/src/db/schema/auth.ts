import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { userTable } from "./user";

export const sessionTable = sqliteTable("session", {
  id: text().primaryKey(),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
  token: text().notNull().unique(),
  ipAddress: text(),
  userAgent: text(),
  userId: int()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const account = sqliteTable("account", {
  id: int().primaryKey({ autoIncrement: true }),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: int()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  scope: text(),
  password: text(),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const verification = sqliteTable("verification", {
  id: int().primaryKey({ autoIncrement: true }),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const jwks = sqliteTable("jwks", {
  id: int().primaryKey({ autoIncrement: true }),
  publicKey: text().notNull(),
  privateKey: text().notNull(),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});
