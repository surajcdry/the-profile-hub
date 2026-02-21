"use client";

import { useState } from "react";
import { useActionState } from "react";
import { joinList, type JoinListState } from "@/app/actions/joinList";
import { Plus, Eye, EyeOff } from "lucide-react";

export default function JoinListButton({
    code,
    passwordEnabled,
}: {
    code: string;
    passwordEnabled: boolean;
}) {
    const [state, formAction, isPending] = useActionState<JoinListState, FormData>(joinList, {
        success: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col items-start gap-2">
            <form action={formAction} className="flex flex-col gap-2">
                <input type="hidden" name="code" value={code} />

                {passwordEnabled && (
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Group password"
                            required
                            autoComplete="off"
                            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-4 pr-10 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-colors focus:border-brand dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus className="h-4 w-4" />
                    {isPending ? "Joining…" : "Join this group"}
                </button>
            </form>

            {!state.success && state.message && (
                <p className="text-sm text-red-500">{state.message}</p>
            )}
        </div>
    );
}
