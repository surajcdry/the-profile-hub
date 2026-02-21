import "dotenv/config";
import { db } from "./src/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";

async function run() {
  const adapter = PrismaAdapter(db);
  try {
     const email = `test+${Date.now()}@example.com`;
     console.log("Creating user...", email);
     const user = await adapter.createUser({
        email,
        emailVerified: new Date(),
        name: "Test User 2",
        image: "http://example.com/avatar.png"
     });
     console.log("User created:", user.id);
     
     console.log("Linking account...");
     const account = await adapter.linkAccount({
        userId: user.id,
        type: "oauth",
        provider: "github",
        providerAccountId: `github-${Date.now()}`,
        access_token: "mock-token"
     });
     console.log("Account linked successfully!");
  } catch (err) {
      console.error("Adapter Error:");
      console.error(err);
  }
}
run();
