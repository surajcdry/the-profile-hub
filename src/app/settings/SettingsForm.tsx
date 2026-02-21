"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateProfile, type ProfileFormState } from "@/app/actions/updateProfile";
import type { User } from "@/generated/prisma/client";

type Props = {
    user: Pick<
        User,
        | "name"
        | "bio"
        | "contactEmail"
        | "phoneNumber"
        | "websiteUrl"
        | "linkedinUrl"
        | "githubUrl"
        | "instagramUrl"
        | "youtubeUrl"
        | "twitterUrl"
    >;
};

const initialState: ProfileFormState = { success: false };

// ─── Field components ─────────────────────────────────────────────────────────

function Field({
    label,
    name,
    defaultValue,
    errors,
    type = "text",
    placeholder,
    multiline,
}: {
    label: string;
    name: string;
    defaultValue?: string | null;
    errors?: string[];
    type?: string;
    placeholder?: string;
    multiline?: boolean;
}) {
    const base =
        "w-full rounded-2xl border bg-zinc-50/80 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-all focus:border-brand focus:bg-white focus:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-50 dark:focus:bg-zinc-900";
    const borderClass = errors?.length ? "border-red-400 dark:border-red-500" : "border-zinc-200 dark:border-zinc-800";

    return (
        <div>
            <label
                htmlFor={name}
                className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500"
            >
                {label}
            </label>
            {multiline ? (
                <textarea
                    id={name}
                    name={name}
                    defaultValue={defaultValue ?? ""}
                    placeholder={placeholder}
                    rows={3}
                    className={`${base} ${borderClass} resize-none`}
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    defaultValue={defaultValue ?? ""}
                    placeholder={placeholder}
                    className={`${base} ${borderClass}`}
                />
            )}
            {errors?.map((e) => (
                <p key={e} className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {e}
                </p>
            ))}
        </div>
    );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function SettingsForm({ user }: Props) {
    const [state, formAction, isPending] = useActionState(updateProfile, initialState);
    const successRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (state.success) successRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [state.success]);

    return (
        <form action={formAction} className="space-y-5">

            {/* Success / error banner */}
            {state.message && (
                <div
                    ref={state.success ? successRef : undefined}
                    className={`rounded-xl border px-4 py-3 text-sm ${state.success
                        ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400"
                        : "border-red-100 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                >
                    {state.success ? "✓ " : ""}{state.message}
                </div>
            )}

            {/* ── About you ── */}
            <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white/70 p-7 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/70">
                <div>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        About you
                    </h2>
                    <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                        This shows on your profile card in every group you join.
                    </p>
                </div>
                <Field
                    label="Display name"
                    name="name"
                    defaultValue={user.name}
                    errors={state.errors?.name}
                    placeholder="Your full name"
                />
                <Field
                    label="Bio"
                    name="bio"
                    defaultValue={user.bio}
                    errors={state.errors?.bio}
                    placeholder="A short description — what you do, your interests…"
                    multiline
                />
            </div>

            {/* ── Contact info ── */}
            <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white/70 p-7 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/70">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Contact info
                </h2>
                <Field
                    label="Email address"
                    name="contactEmail"
                    defaultValue={user.contactEmail}
                    errors={state.errors?.contactEmail}
                    type="email"
                    placeholder="hello@example.com"
                />
                <Field
                    label="Phone number"
                    name="phoneNumber"
                    defaultValue={user.phoneNumber}
                    errors={state.errors?.phoneNumber}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                />
                <Field
                    label="Website"
                    name="websiteUrl"
                    defaultValue={user.websiteUrl}
                    errors={state.errors?.websiteUrl}
                    type="url"
                    placeholder="https://yourwebsite.com"
                />
            </div>

            {/* ── Social links ── */}
            <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white/70 p-7 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/70">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Social links
                </h2>
                <Field
                    label="LinkedIn"
                    name="linkedinUrl"
                    defaultValue={user.linkedinUrl}
                    errors={state.errors?.linkedinUrl}
                    type="url"
                    placeholder="https://linkedin.com/in/yourname"
                />
                <Field
                    label="GitHub"
                    name="githubUrl"
                    defaultValue={user.githubUrl}
                    errors={state.errors?.githubUrl}
                    type="url"
                    placeholder="https://github.com/yourname"
                />
                <Field
                    label="Instagram"
                    name="instagramUrl"
                    defaultValue={user.instagramUrl}
                    errors={state.errors?.instagramUrl}
                    type="url"
                    placeholder="https://instagram.com/yourname"
                />
                <Field
                    label="YouTube"
                    name="youtubeUrl"
                    defaultValue={user.youtubeUrl}
                    errors={state.errors?.youtubeUrl}
                    type="url"
                    placeholder="https://youtube.com/@yourchannel"
                />
                <Field
                    label="X / Twitter"
                    name="twitterUrl"
                    defaultValue={user.twitterUrl}
                    errors={state.errors?.twitterUrl}
                    type="url"
                    placeholder="https://x.com/yourhandle"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="btn-gradient flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-brand/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
                {isPending ? "Saving…" : "Save changes"}
            </button>
        </form>
    );
}
