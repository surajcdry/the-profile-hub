"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function deleteList(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return;

    const listId = formData.get("listId") as string;
    if (!listId) return;

    const list = await db.list.findUnique({
        where: { id: listId },
        select: { creatorId: true },
    });
    if (!list || list.creatorId !== session.user.id) return;

    await db.list.delete({ where: { id: listId } });
    redirect("/dashboard");
}
