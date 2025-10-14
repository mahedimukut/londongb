// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

// Only use Prisma adapter in Node.js environment
let adapter: any;

if (typeof window === 'undefined' && process.env.NEXT_RUNTIME !== 'edge') {
  // Server-side only - import Prisma adapter
  const { PrismaAdapter } = require("@auth/prisma-adapter");
  const { prisma } = require("@/lib/prisma");
  adapter = PrismaAdapter(prisma);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    }),
  ],
  // Use JWT strategy for better Edge compatibility
  session: {
    strategy: "jwt",
  },
});