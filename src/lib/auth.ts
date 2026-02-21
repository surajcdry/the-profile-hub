import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { Pool } from "@neondatabase/serverless";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Build a dedicated PrismaClient for auth (separate from the hot-reload singleton)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prismAuth = new PrismaClient({ adapter });

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prismAuth),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHub({
            clientId: process.env.NODE_ENV === "development" ? process.env.GITHUB_CLIENT_ID_LOCAL! : process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.NODE_ENV === "development" ? process.env.GITHUB_CLIENT_SECRET_LOCAL! : process.env.GITHUB_CLIENT_SECRET!,
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
