"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type JoinListState = {
    success: boolean;
    message?: string;
};

export async function joinList(
    _prev: JoinListState,
    formData: FormData
): Promise<JoinListState> {
    const session = await auth();

    if (!session?.user?.id) {
        return { success: false, message: "You must be signed in to join." };
    }

    const code = formData.get("code") as string;
    if (!code) {
        return { success: false, message: "Group code is required." };
    }

    try {
        const list = await db.list.findUnique({
            where: { code },
            select: { id: true, passwordEnabled: true, password: true },
        });

        if (!list) {
            return { success: false, message: "Group not found. Check the code and try again." };
        }

        // Validate password if protection is enabled and a password has been set
        if (list.passwordEnabled && list.password) {
            // If the user already unlocked the list via the cookie, skip the password check
            const cookieStore = await cookies();
            const isUnlocked = cookieStore.get(`unlocked_list_${code}`)?.value === "true";

            if (!isUnlocked) {
                const submitted = (formData.get("password") as string)?.trim() || "";
                if (!submitted || submitted !== list.password) {
                    return { success: false, message: "Incorrect password." };
                }
            }
        }

        await db.listMember.create({
            data: { listId: list.id, userId: session.user.id },
        });

        revalidatePath(`/list/${code}`);
        return { success: true };
    } catch (error: unknown) {
        const prismaError = error as { code?: string };
        if (prismaError?.code === "P2002") {
            return { success: false, message: "You're already a member of this group." };
        }
        return { success: false, message: "An error occurred. Please try again." };
    }
}
