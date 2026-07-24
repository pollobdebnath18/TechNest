import { createAuthClient } from "better-auth/react";

const authUrl =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export const authClient = createAuthClient({
  baseURL: authUrl,
});

export const { signIn, signUp, signOut, useSession } = authClient;
