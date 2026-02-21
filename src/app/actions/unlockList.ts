"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type UnlockListState = {
    success: boolean;
    message?: string;
};

export async function unlockList(
    _prev: UnlockListState,
    formData: FormData
): Promise<UnlockListState> {
    const code = formData.get("code") as string;
    const password = formData.get("password") as string;

    if (!code || !password) {
        return { success: false, message: "Code and password are required." };
    }

    try {
        const list = await db.list.findUnique({
            where: { code },
            select: { passwordEnabled: true, password: true },
        });

        if (!list) {
            return { success: false, message: "Group not found." };
        }

        if (list.passwordEnabled && list.password !== password) {
            return { success: false, message: "Incorrect password." };
        }

        const cookieStore = await cookies();
        cookieStore.set(`unlocked_list_${code}`, "true", {
            maxAge: 60 * 60 * 24 * 7, // 1 week
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: `/list/${code}`,
        });

        revalidatePath(`/list/${code}`);
        return { success: true };
    } catch (error) {
        return { success: false, message: "An error occurred. Please try again." };
    }
}
