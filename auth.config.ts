import type { NextAuthConfig } from "next-auth";
export const authConfig = {
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
