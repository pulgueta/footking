import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { phoneNumber } from "better-auth/plugins";

import { db } from "@/db/config";
import * as schema from "@/db/schema";
import { getCacheKey, setCacheKey } from "./cache";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: false,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            createdAt: new Date(),
            updatedAt: new Date(),
            role: "user",
          },
        }),
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL ?? ""],
  rateLimit: {
    enabled: true,
    storage: "secondary-storage",
    customStorage: {
      get: getCacheKey,
      set: setCacheKey,
    },
  },
  plugins: [phoneNumber()],
});

export type User = typeof auth.$Infer.Session.user | null;
export type Session = typeof auth.$Infer.Session.session | null;
