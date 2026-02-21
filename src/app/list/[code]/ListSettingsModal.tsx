"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { Settings, X, Trash2, UserCheck, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { updateList, type UpdateListState } from "@/app/actions/updateList";
import { deleteList } from "@/app/actions/deleteList";
import { transferOwnership, type TransferOwnershipState } from "@/app/actions/transferOwnership";

type Member = {
    id: string;
    userId: string;
    user: { name: string | null; image: string | null };
};

type ListData = {
    id: string;
    name: string;
    description: string | null;
    code: string;
    passwordEnabled: boolean;
    password: string | null;
};

export default function ListSettingsModal({
    list,
    members,
}: {
    list: ListData;
    members: Member[]; // members excluding current user (the creator)
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [tab, setTab] = useState<"settings" | "danger">("settings");
    const [passwordEnabled, setPasswordEnabled] = useState(list.passwordEnabled);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedNewOwner, setSelectedNewOwner] = useState("");

    const [updateState, updateAction, isUpdating] = useActionState<UpdateListState, FormData>(
        updateList,
        { success: false }
    );
    const [transferState, transferAction, isTransferring] = useActionState<TransferOwnershipState, FormData>(
        transferOwnership,
        { success: false }
    );

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    // Reset state when opening
    const openModal = () => {
        setTab("settings");
        setConfirmDelete(false);
        setPasswordEnabled(list.passwordEnabled);
        setIsOpen(true);
    };

    return (
        <>
            <button
                onClick={openModal}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
                <Settings className="h-3.5 w-3.5" />
                Settings
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
                    onClick={(e) => {
                        if ((e.target as HTMLElement).classList.contains("modal-backdrop")) setIsOpen(false);
                    }}
                >
                    <div
                        className="modal-backdrop absolute inset-0"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-100 p-5 dark:border-zinc-800">
                            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Group Settings</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-zinc-100 dark:border-zinc-800">
                            <button
                                onClick={() => setTab("settings")}
                                className={`px-5 py-3 text-sm font-medium transition-colors ${tab === "settings"
                                        ? "border-b-2 border-brand text-brand"
                                        : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                                    }`}
                            >
                                General
                            </button>
                            <button
                                onClick={() => setTab("danger")}
                                className={`px-5 py-3 text-sm font-medium transition-colors ${tab === "danger"
                                        ? "border-b-2 border-red-500 text-red-600"
                                        : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                                    }`}
                            >
                                Danger Zone
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto p-5">
                            {tab === "settings" ? (
                                <form action={updateAction} className="space-y-4">
                                    <input type="hidden" name="listId" value={list.id} />

                                    {updateState.message && (
                                        <div
                                            className={`rounded-xl border p-3 text-sm ${updateState.success
                                                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400"
                                                    : "border-red-100 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
                                                }`}
                                        >
                                            {updateState.success ? "✓ " : ""}{updateState.message}
                                        </div>
                                    )}

                                    {/* Name */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-400">
                                            Group Name
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            defaultValue={list.name}
                                            required
                                            maxLength={100}
                                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-colors focus:border-brand focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:bg-zinc-800"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-400">
                                            Description{" "}
                                            <span className="normal-case text-zinc-300 dark:text-zinc-600">
                                                (optional)
                                            </span>
                                        </label>
                                        <textarea
                                            name="description"
                                            defaultValue={list.description ?? ""}
                                            placeholder="What is this group for?"
                                            maxLength={500}
                                            rows={2}
                                            className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-colors focus:border-brand focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="h-4 w-4 text-zinc-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                                        Password protection
                                                    </p>
                                                    <p className="text-xs text-zinc-400">
                                                        Require a password to join
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setPasswordEnabled(!passwordEnabled)}
                                                role="switch"
                                                aria-checked={passwordEnabled}
                                                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${passwordEnabled ? "bg-brand" : "bg-zinc-200 dark:bg-zinc-700"
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${passwordEnabled ? "translate-x-6" : "translate-x-1"
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                        <input
                                            type="hidden"
                                            name="passwordEnabled"
                                            value={String(passwordEnabled)}
                                        />
                                        {passwordEnabled && (
                                            <div className="relative">
                                                <input
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    defaultValue={list.password ?? ""}
                                                    placeholder="Enter a password for this group"
                                                    maxLength={100}
                                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 pr-10 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 transition-colors focus:border-brand focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                        {updateState.errors?.password && (
                                            <p className="text-xs text-red-500">
                                                {updateState.errors.password[0]}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isUpdating ? "Saving…" : "Save changes"}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-5">
                                    {/* Transfer Ownership */}
                                    <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/50 dark:bg-amber-950/20">
                                        <div className="flex items-center gap-2">
                                            <UserCheck className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                                            <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                                                Transfer ownership
                                            </p>
                                        </div>
                                        <p className="text-xs text-amber-700 dark:text-amber-500">
                                            Make another member the owner. You'll stay as a regular member.
                                        </p>
                                        {members.length === 0 ? (
                                            <p className="text-xs text-amber-600 dark:text-amber-500">
                                                No other members to transfer to yet.
                                            </p>
                                        ) : (
                                            <form action={transferAction} className="space-y-2">
                                                <input type="hidden" name="listId" value={list.id} />
                                                {transferState.message && (
                                                    <p
                                                        className={`text-xs ${transferState.success
                                                                ? "text-green-700 dark:text-green-400"
                                                                : "text-red-600 dark:text-red-400"
                                                            }`}
                                                    >
                                                        {transferState.success ? "✓ " : ""}
                                                        {transferState.message}
                                                    </p>
                                                )}
                                                <select
                                                    name="newOwnerId"
                                                    required
                                                    value={selectedNewOwner}
                                                    onChange={(e) => setSelectedNewOwner(e.target.value)}
                                                    className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-amber-400 dark:border-amber-800/50 dark:bg-zinc-800 dark:text-zinc-50"
                                                >
                                                    <option value="">Select new owner…</option>
                                                    {members.map((m) => (
                                                        <option key={m.userId} value={m.userId}>
                                                            {m.user.name || "Anonymous"}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="submit"
                                                    disabled={!selectedNewOwner || isTransferring}
                                                    className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-amber-800/50 dark:bg-transparent dark:text-amber-400 dark:hover:bg-amber-950/30"
                                                >
                                                    {isTransferring ? "Transferring…" : "Transfer ownership"}
                                                </button>
                                            </form>
                                        )}
                                    </div>

                                    {/* Delete Group */}
                                    <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
                                        <div className="flex items-center gap-2">
                                            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-500" />
                                            <p className="text-sm font-medium text-red-800 dark:text-red-400">
                                                Delete group
                                            </p>
                                        </div>
                                        <p className="text-xs text-red-700 dark:text-red-500">
                                            Permanently deletes this group and removes all members. This cannot be undone.
                                        </p>
                                        {!confirmDelete ? (
                                            <button
                                                onClick={() => setConfirmDelete(true)}
                                                className="w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/30"
                                            >
                                                Delete this group
                                            </button>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-xs font-medium text-red-700 dark:text-red-400">
                                                    Are you sure? This is permanent.
                                                </p>
                                                <div className="flex gap-2">
                                                    <form action={deleteList} className="flex-1">
                                                        <input type="hidden" name="listId" value={list.id} />
                                                        <button
                                                            type="submit"
                                                            className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                                                        >
                                                            Yes, delete forever
                                                        </button>
                                                    </form>
                                                    <button
                                                        onClick={() => setConfirmDelete(false)}
                                                        className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
