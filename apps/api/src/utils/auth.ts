import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@footking/db";
import { getCacheKey, setCacheKey } from "@footking/db/cache";
import * as schema from "@footking/db/schemas";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.userTable,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
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
});

export type User = typeof auth.$Infer.Session.user | null;
export type Session = typeof auth.$Infer.Session.session | null;
