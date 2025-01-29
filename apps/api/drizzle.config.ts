import { defineConfig } from "drizzle-kit";

import "dotenv/config";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL ?? "",
    authToken: process.env.TURSO_AUTH_TOKEN ?? "",
  },
});
