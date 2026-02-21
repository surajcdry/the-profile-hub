import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { neon } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

// Dedicated PrismaClient for auth using Neon HTTP driver (no TCP handshake on cold start)
const sql = neon(process.env.DATABASE_URL!);
const neonAdapter = new PrismaNeon(sql);
const prismAuth = new PrismaClient({ adapter: neonAdapter });

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prismAuth),
    // Required for Vercel / any deployment behind a reverse proxy.
    // Without this, NextAuth cannot determine the callback URL and throws
    // a "server error" during the OAuth flow in production.
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        GitHub({
            clientId: process.env.NODE_ENV === "development" ? process.env.GITHUB_CLIENT_ID_LOCAL! : process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.NODE_ENV === "development" ? process.env.GITHUB_CLIENT_SECRET_LOCAL! : process.env.GITHUB_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    session: { strategy: "database" },
    callbacks: {
        session({ session, user }) {
            // Attach the DB user.id to the session object
            if (session.user && user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
});
