"use client";

import { useState } from "react";
import { useActionState } from "react";
import { unlockList, type UnlockListState } from "@/app/actions/unlockList";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function UnlockListForm({ code }: { code: string }) {
    const [state, formAction, isPending] = useActionState<UnlockListState, FormData>(unlockList, {
        success: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="mx-auto mt-12 max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Lock className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Protected Group</h2>
            <p className="mt-2 mb-6 text-sm text-zinc-500 dark:text-zinc-400">
                Enter the group password to view its members.
            </p>

            <form action={formAction} className="flex flex-col gap-3 text-left">
                <input type="hidden" name="code" value={code} />

                <div className="relative">
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Group password"
                        required
                        autoComplete="off"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-4 pr-10 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-colors focus:border-brand focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:bg-zinc-800"
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

                <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isPending ? "Unlocking…" : "Unlock"}
                    {!isPending && <ArrowRight className="h-4 w-4" />}
                </button>
            </form>

            {!state.success && state.message && (
                <p className="mt-4 text-sm text-red-500">{state.message}</p>
            )}
        </div>
    );
}
