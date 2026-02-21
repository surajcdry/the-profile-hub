"use client";

import { useState } from "react";
import { useActionState } from "react";
import { LogOut } from "lucide-react";
import { leaveList, type LeaveListState } from "@/app/actions/leaveList";

export default function LeaveListButton({
    listId,
    code,
    isCreator,
    memberCount,
}: {
    listId: string;
    code: string;
    isCreator: boolean;
    memberCount: number;
}) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [state, formAction, isPending] = useActionState<LeaveListState, FormData>(leaveList, {
        success: false,
    });

    // Creator with other members must use settings to transfer first
    if (isCreator && memberCount > 1) {
        return (
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Use group settings to transfer ownership before leaving.
            </p>
        );
    }

    if (!confirmOpen) {
        return (
            <button
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
                <LogOut className="h-3.5 w-3.5" />
                {isCreator ? "Delete group" : "Leave group"}
            </button>
        );
    }

    return (
        <form action={formAction} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="listId" value={listId} />
            <input type="hidden" name="code" value={code} />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {isCreator ? "Delete this group?" : "Leave this group?"}
            </span>
            <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
                {isPending ? "…" : "Yes, confirm"}
            </button>
            <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
                Cancel
            </button>
            {state.message && !state.success && (
                <p className="w-full text-xs text-red-500">{state.message}</p>
            )}
        </form>
    );
}
