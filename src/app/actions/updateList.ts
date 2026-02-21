"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const UpdateListSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().max(500).optional(),
    passwordEnabled: z.boolean(),
    password: z.string().max(100).optional(),
});

export type UpdateListState = {
    success: boolean;
    message?: string;
    errors?: Partial<Record<string, string[]>>;
};

export async function updateList(
    _prev: UpdateListState,
    formData: FormData
): Promise<UpdateListState> {
    const session = await auth();
    if (!session?.user?.id) return { success: false, message: "You must be signed in." };

    const listId = formData.get("listId") as string;
    if (!listId) return { success: false, message: "List ID is required." };

    const list = await db.list.findUnique({
        where: { id: listId },
        select: { creatorId: true, code: true },
    });
    if (!list) return { success: false, message: "List not found." };
    if (list.creatorId !== session.user.id) return { success: false, message: "Not authorized." };

    const passwordEnabled = formData.get("passwordEnabled") === "true";
    const raw = {
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || undefined,
        passwordEnabled,
        password: (formData.get("password") as string) || undefined,
    };

    if (passwordEnabled && !raw.password?.trim()) {
        return { success: false, errors: { password: ["A password is required when protection is enabled."] } };
    }

    const parsed = UpdateListSchema.safeParse(raw);
    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    await db.list.update({
        where: { id: listId },
        data: {
            name: parsed.data.name.trim(),
            description: parsed.data.description?.trim() || null,
            passwordEnabled: parsed.data.passwordEnabled,
            password: parsed.data.passwordEnabled ? parsed.data.password?.trim() ?? null : null,
        },
    });

    revalidatePath(`/list/${list.code}`);
    revalidatePath("/dashboard");
    return { success: true, message: "Group updated." };
}
