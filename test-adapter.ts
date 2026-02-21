import "dotenv/config";
import { db } from "./src/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";

async function run() {
  const adapter = PrismaAdapter(db);
  try {
     console.log("Creating user...");
     const user = await adapter.createUser({
        email: "test@example.com",
        emailVerified: new Date(),
        name: "Test User",
        image: "http://example.com/avatar.png"
     });
     console.log("User created:", user);
     
     console.log("Linking account...");
     const account = await adapter.linkAccount({
        userId: user.id,
        type: "oauth",
        provider: "github",
        providerAccountId: "123456789",
        access_token: "mock-token"
     });
     console.log("Account linked:", account);
  } catch (err) {
      console.error("Adapter Error:");
      console.error(err);
  }
}
run();
