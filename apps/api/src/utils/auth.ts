import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, phoneNumber } from "better-auth/plugins";

import { db } from "@/db/config";
import * as schema from "@/db/schema";
import { sendOTPMessage } from "@/services/twilio";
import { getCacheKey, setCacheKey } from "./cache";

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
  plugins: [
    phoneNumber({
      sendOTP: async ({ code, phoneNumber }) => {
        await sendOTPMessage(phoneNumber, code);
      },
    }),
    openAPI(),
  ],
});

export type User = typeof auth.$Infer.Session.user | null;
export type Session = typeof auth.$Infer.Session.session | null;
