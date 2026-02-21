"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// ── Social prefix config (must match the client component) ────────────────────

const SOCIAL_PREFIXES: Record<string, string> = {
    linkedinUrl: "https://linkedin.com/in/",
    githubUrl: "https://github.com/",
    instagramUrl: "https://instagram.com/",
    youtubeUrl: "https://youtube.com/@",
    twitterUrl: "https://x.com/",
};

/** Build a full URL from a username, or return null if empty. */
function buildUrl(field: string, username: string | undefined): string | null {
    const trimmed = username?.trim();
    if (!trimmed) return null;
    const prefix = SOCIAL_PREFIXES[field];
    if (!prefix) return trimmed;
    // If the user pasted a full URL anyway, just keep it
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `${prefix}${trimmed}`;
}

// ── Validation ────────────────────────────────────────────────────────────────

const urlField = z.string().url("Must be a valid URL").or(z.literal("")).optional();

// For social fields, accept a simple username string (no dots required, just non-empty)
const usernameField = z.string().max(200).optional();

const ProfileSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    bio: z.string().max(500).optional(),
    contactEmail: z.string().email("Must be a valid email").or(z.literal("")).optional(),
    phoneNumber: z.string().max(30).optional(),
    websiteUrl: urlField,
    linkedinUrl: usernameField,
    githubUrl: usernameField,
    instagramUrl: usernameField,
    youtubeUrl: usernameField,
    twitterUrl: usernameField,
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
                linkedinUrl: buildUrl("linkedinUrl", parsed.data.linkedinUrl),
                githubUrl: buildUrl("githubUrl", parsed.data.githubUrl),
                instagramUrl: buildUrl("instagramUrl", parsed.data.instagramUrl),
                youtubeUrl: buildUrl("youtubeUrl", parsed.data.youtubeUrl),
                twitterUrl: buildUrl("twitterUrl", parsed.data.twitterUrl),
            },
        });

        return { success: true, message: "Profile updated." };
    } catch {
        return { success: false, message: "Something went wrong. Please try again." };
    }
}
