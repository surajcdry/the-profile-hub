import { PrismaClient } from "@/generated/prisma";
import { generateListCode } from "@/lib/utils";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create a test user
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

    console.log("✅ User created:", user.id, user.email);

    // Create a test list
    const list = await prisma.list.upsert({
        where: { code: "abc123" },
        update: {},
        create: {
            name: "Test List",
            code: generateListCode(6),
            creatorId: user.id,
        },
    });

    console.log("✅ List created:", list.id, `code: ${list.code}`);

    // Add user as a member of the list
    const membership = await prisma.listMember.upsert({
        where: { listId_userId: { listId: list.id, userId: user.id } },
        update: {},
        create: {
            listId: list.id,
            userId: user.id,
        },
    });

    console.log("✅ Membership created:", membership.id);

    console.log("✨ Seeding complete.");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
