"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type LeaveListState = {
    success: boolean;
    message?: string;
};

export async function leaveList(
    _prev: LeaveListState,
    formData: FormData
): Promise<LeaveListState> {
    const session = await auth();
    if (!session?.user?.id) return { success: false, message: "Not signed in." };

    const listId = formData.get("listId") as string;
    const code = formData.get("code") as string;
    if (!listId || !code) return { success: false, message: "Missing data." };

    const list = await db.list.findUnique({
        where: { id: listId },
        select: { creatorId: true, _count: { select: { members: true } } },
    });
    if (!list) return { success: false, message: "List not found." };

    if (list.creatorId === session.user.id) {
        if (list._count.members > 1) {
            return {
                success: false,
                message: "You're the owner. Transfer ownership in group settings before leaving.",
            };
        }
        // Creator is the only member — delete the whole list
        await db.list.delete({ where: { id: listId } });
        redirect("/dashboard");
    }

    // Regular member — remove their membership
    await db.listMember.deleteMany({
        where: { listId, userId: session.user.id },
    });

    revalidatePath(`/list/${code}`);
    revalidatePath("/dashboard");
    redirect("/dashboard");
}
