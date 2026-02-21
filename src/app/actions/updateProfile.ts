"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const urlField = z.string().url("Must be a valid URL").or(z.literal("")).optional();

const ProfileSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    bio: z.string().max(500).optional(),
    contactEmail: z.string().email("Must be a valid email").or(z.literal("")).optional(),
    phoneNumber: z.string().max(30).optional(),
    websiteUrl: urlField,
    linkedinUrl: urlField,
    githubUrl: urlField,
    instagramUrl: urlField,
    youtubeUrl: urlField,
    twitterUrl: urlField,
});

export type ProfileFormState = {
    success: boolean;
    errors?: Partial<Record<keyof z.infer<typeof ProfileSchema>, string[]>>;
    message?: string;
};

export async function updateProfile(
    _prev: ProfileFormState,
    formData: FormData
): Promise<ProfileFormState> {
    const session = await auth();

    if (!session?.user?.id) {
        return { success: false, message: "You must be signed in." };
    }

    const raw = {
        name: formData.get("name") as string,
        bio: (formData.get("bio") as string) || undefined,
        contactEmail: (formData.get("contactEmail") as string) || undefined,
        phoneNumber: (formData.get("phoneNumber") as string) || undefined,
        websiteUrl: (formData.get("websiteUrl") as string) || undefined,
        linkedinUrl: (formData.get("linkedinUrl") as string) || undefined,
        githubUrl: (formData.get("githubUrl") as string) || undefined,
        instagramUrl: (formData.get("instagramUrl") as string) || undefined,
        youtubeUrl: (formData.get("youtubeUrl") as string) || undefined,
        twitterUrl: (formData.get("twitterUrl") as string) || undefined,
    };

    const parsed = ProfileSchema.safeParse(raw);

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors as ProfileFormState["errors"],
        };
    }

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: {
                name: parsed.data.name,
                bio: parsed.data.bio ?? null,
                contactEmail: parsed.data.contactEmail || null,
                phoneNumber: parsed.data.phoneNumber || null,
                websiteUrl: parsed.data.websiteUrl || null,
                linkedinUrl: parsed.data.linkedinUrl || null,
                githubUrl: parsed.data.githubUrl || null,
                instagramUrl: parsed.data.instagramUrl || null,
                youtubeUrl: parsed.data.youtubeUrl || null,
                twitterUrl: parsed.data.twitterUrl || null,
            },
        });

        return { success: true, message: "Profile updated." };
    } catch {
        return { success: false, message: "Something went wrong. Please try again." };
    }
}
