import { createAuthClient } from "better-auth/react";

import { cache } from "react";

const authClient = createAuthClient({
  baseURL: process.env.PUBLIC_API_URL,
});

export type User = typeof authClient.$Infer.Session.user | null;
export type Session = typeof authClient.$Infer.Session.session | null;

export const currentUser = cache(async () => {
  const { data } = await authClient.getSession();

  return data?.user;
});

export function useSession() {
  const { data, isPending } = authClient.useSession();

  return {
    user: data?.user,
    isPending,
  };
}

export const { signIn, signUp, signOut } = authClient;
