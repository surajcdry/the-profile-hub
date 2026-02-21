"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateProfile, type ProfileFormState } from "@/app/actions/updateProfile";
import type { User } from "@/generated/prisma/client";

type Props = {
    user: Pick<
        User,
        "name" | "bio" | "linkedinUrl" | "githubUrl" | "instagramUrl" | "phoneNumber"
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
        "w-full rounded-xl border bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-colors focus:border-zinc-400 focus:bg-white";
    const borderClass = errors?.length ? "border-red-400" : "border-zinc-200";

    return (
        <div>
            <label
                htmlFor={name}
                className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-400"
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
                <p key={e} className="mt-1 text-xs text-red-500">
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
                    className={`rounded-xl px-4 py-3 text-sm ${state.success
                            ? "bg-zinc-100 text-zinc-700"
                            : "bg-red-50 text-red-600"
                        }`}
                >
                    {state.message}
                </div>
            )}

            {/* ── Identity ── */}
            <div className="space-y-4 rounded-2xl border border-zinc-100 bg-white p-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    Identity
                </h2>
                <Field
                    label="Name"
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
                    placeholder="A short description about yourself"
                    multiline
                />
                <Field
                    label="Phone"
                    name="phoneNumber"
                    defaultValue={user.phoneNumber}
                    errors={state.errors?.phoneNumber}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                />
            </div>

            {/* ── Social links ── */}
            <div className="space-y-4 rounded-2xl border border-zinc-100 bg-white p-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
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
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
                {isPending ? "Saving…" : "Save changes"}
            </button>
        </form>
    );
}
