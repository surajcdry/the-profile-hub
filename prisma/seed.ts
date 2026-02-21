import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { nanoid } from "nanoid";

// Use standard pg (TCP) for seed — @neondatabase/serverless needs Edge/WebSocket env
const pool = new Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/** Generates a short URL-friendly code of given length */
function generateListCode(length = 6): string {
    return nanoid(length);
}

async function main() {
    console.log("🌱 Seeding database...");

    const user = await prisma.user.upsert({
        where: { email: "seed@example.com" },
        update: {},
        create: {
            name: "Seed User",
            email: "seed@example.com",
            bio: "This is a seeded test user.",
            githubUrl: "https://github.com/seeduser",
        },
    });
    console.log("✅ User:", user.id, user.email);

    const list = await prisma.list.upsert({
        where: { code: "seed01" },
        update: { name: "Test List" },
        create: {
            name: "Test List",
            code: "seed01",
            creatorId: user.id,
        },
    });
    console.log("✅ List:", list.id, `code: ${list.code}`);

    const membership = await prisma.listMember.upsert({
        where: { listId_userId: { listId: list.id, userId: user.id } },
        update: {},
        create: { listId: list.id, userId: user.id },
    });
    console.log("✅ Membership:", membership.id);

    console.log("🔑 Sample generated code:", generateListCode(6));
    console.log("✨ Seeding complete.");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
