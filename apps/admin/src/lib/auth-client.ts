import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { auth } from "api/auth";

const authClient = createAuthClient({
  baseURL: process.env.API_URL,
  fetchOptions: {},
  plugins: [inferAdditionalFields<typeof auth>(), jwtClient()],
});

export type User = typeof auth.$Infer.Session.user | null;
export type Session = typeof auth.$Infer.Session.session | null;

export const { useSession } = authClient;
