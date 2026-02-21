"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type TransferOwnershipState = {
    success: boolean;
    message?: string;
};

export async function transferOwnership(
    _prev: TransferOwnershipState,
    formData: FormData
): Promise<TransferOwnershipState> {
    const session = await auth();
    if (!session?.user?.id) return { success: false, message: "Not signed in." };

    const listId = formData.get("listId") as string;
    const newOwnerId = formData.get("newOwnerId") as string;
    if (!listId || !newOwnerId) return { success: false, message: "Missing data." };

    const list = await db.list.findUnique({
        where: { id: listId },
        select: { creatorId: true, code: true, members: { select: { userId: true } } },
    });
    if (!list) return { success: false, message: "List not found." };
    if (list.creatorId !== session.user.id) return { success: false, message: "Not authorized." };
    if (newOwnerId === session.user.id) return { success: false, message: "You're already the owner." };

    const isMember = list.members.some((m) => m.userId === newOwnerId);
    if (!isMember) return { success: false, message: "That person must be a member first." };

    await db.list.update({
        where: { id: listId },
        data: { creatorId: newOwnerId },
    });

    revalidatePath(`/list/${list.code}`);
    revalidatePath("/dashboard");
    return { success: true, message: "Ownership transferred successfully." };
}
