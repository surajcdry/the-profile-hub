"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

function generateCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export type CreateListState = {
    success: boolean;
    message?: string;
    code?: string;
};

export async function createList(
    _prev: CreateListState,
    formData: FormData
): Promise<CreateListState> {
    const session = await auth();

    if (!session?.user?.id) {
        return { success: false, message: "You must be signed in to create a group." };
    }

    const name = formData.get("name") as string;
    if (!name || name.trim().length === 0) {
        return { success: false, message: "Group name is required." };
    }
    if (name.trim().length > 100) {
        return { success: false, message: "Group name must be 100 characters or less." };
    }

    const description = (formData.get("description") as string)?.trim() || null;
    const passwordEnabled = formData.get("passwordEnabled") === "true";
    const passwordRaw = (formData.get("password") as string)?.trim() || null;

    if (passwordEnabled && !passwordRaw) {
        return { success: false, message: "Please enter a password for this group." };
    }

    // Try up to 3 times to handle extremely rare code collisions
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const list = await db.list.create({
                data: {
                    name: name.trim(),
                    description,
                    code: generateCode(),
                    creatorId: session.user.id,
                    passwordEnabled,
                    password: passwordEnabled ? passwordRaw : null,
                },
            });

            await db.listMember.create({
                data: { listId: list.id, userId: session.user.id },
            });

            return { success: true, code: list.code };
        } catch (error: unknown) {
            const prismaError = error as { code?: string };
            if (prismaError?.code === "P2002" && attempt < 2) continue;
            console.error("Failed to create list:", error);
            return { success: false, message: "An error occurred. Please try again." };
        }
    }
    return { success: false, message: "An error occurred. Please try again." };
}
