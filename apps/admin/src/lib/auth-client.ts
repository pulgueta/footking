import { inferAdditionalFields, phoneNumberClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { auth } from "api/auth";

const authClient = createAuthClient({
  baseURL: process.env.PUBLIC_API_URL,
  plugins: [inferAdditionalFields<typeof auth>(), phoneNumberClient()],
});

export type User = typeof authClient.$Infer.Session.user | null;
export type Session = typeof authClient.$Infer.Session.session | null;

export function useSession() {
  const { data, isPending } = authClient.useSession();

  return {
    user: data?.user,
    isPending,
  };
}

export const { signIn } = authClient;
