import { createEnv } from "@t3-oss/env-core";
import { string } from "zod";

export const env = createEnv({
  server: {
    TWILIO_ACCOUNT_SID: string().min(4),
    TWILIO_AUTH_TOKEN: string().min(4),
  },
  runtimeEnv: {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  },
  emptyStringAsUndefined: true,
});
