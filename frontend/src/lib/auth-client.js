import { createAuthClient } from "better-auth/react";

const authUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : process.env.BETTER_AUTH_URL;

export const authClient = createAuthClient({
  baseURL: authUrl,
});

export const { signIn, signUp, signOut, useSession } = authClient;
