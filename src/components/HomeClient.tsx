"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { X, ArrowRight } from "lucide-react";

// ─── Modal ────────────────────────────────────────────────────────────────────

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
            onClick={(e) => e.target === overlayRef.current && onClose()}
        >
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-start justify-between">
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="ml-4 rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

// ─── Create List Modal ────────────────────────────────────────────────────────

function CreateListModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [name, setName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
        else setName("");
    }, [isOpen]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        // TODO: wire to server action / API
        alert(`List "${name.trim()}" will be created!`);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create a list">
            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
                Give your list a name. You'll get a short 6-character code to share with
                your team.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="list-name"
                        className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-400"
                    >
                        List name
                    </label>
                    <input
                        ref={inputRef}
                        id="list-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Design Team SF"
                        maxLength={60}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white transition-colors"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!name.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
                >
                    Create list
                    <ArrowRight className="h-4 w-4" />
                </button>
            </form>
        </Modal>
    );
}

// ─── Join List Modal ──────────────────────────────────────────────────────────

const CODE_LENGTH = 6;

function JoinListModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [code, setCode] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
        else setCode("");
    }, [isOpen]);

    const handleInput = (val: string) => {
        // Strip non-alphanumeric, uppercase, cap at 6 chars
        setCode(val.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, CODE_LENGTH));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (code.length < CODE_LENGTH) return;
        // TODO: wire to server action / API
        alert(`Joining list with code "${code}"!`);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Join a list">
            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
                Enter the 6-character code shared by the list creator to join their
                list.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="list-code"
                        className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-400"
                    >
                        List code
                    </label>
                    <input
                        ref={inputRef}
                        id="list-code"
                        type="text"
                        value={code}
                        onChange={(e) => handleInput(e.target.value)}
                        placeholder="ABC123"
                        autoCapitalize="characters"
                        autoCorrect="off"
                        spellCheck={false}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-center font-mono text-lg tracking-[0.35em] text-zinc-900 outline-none placeholder:tracking-normal placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white transition-colors"
                    />
                    <p className="mt-1.5 text-right text-xs text-zinc-400">
                        {code.length}/{CODE_LENGTH}
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={code.length < CODE_LENGTH}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
                >
                    Join list
                    <ArrowRight className="h-4 w-4" />
                </button>
            </form>
        </Modal>
    );
}

// ─── Home Client ─────────────────────────────────────────────────────────────

export default function HomeClient() {
    const [createOpen, setCreateOpen] = useState(false);
    const [joinOpen, setJoinOpen] = useState(false);

    return (
        <>
            {/* ── Header ────────────────────────────────────── */}
            <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
                    <span className="text-sm font-semibold tracking-tight text-zinc-900">
                        The Profile Hub
                    </span>
                    <nav className="flex items-center gap-4">
                        <button
                            onClick={() => setJoinOpen(true)}
                            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
                        >
                            Join a list
                        </button>
                        <button
                            onClick={() => setCreateOpen(true)}
                            className="rounded-lg bg-zinc-900 px-3.5 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
                        >
                            Create a list
                        </button>
                    </nav>
                </div>
            </header>

            {/* ── Hero ──────────────────────────────────────── */}
            <main className="mx-auto flex min-h-[calc(100svh-56px)] max-w-3xl flex-col items-start justify-center px-5 py-24">
                {/* Badge */}
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                    <span className="text-xs font-medium text-zinc-500 tracking-wide">
                        Profiles · Lists · Teams
                    </span>
                </div>

                {/* Headline */}
                <h1 className="mb-5 text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.1] tracking-tight text-zinc-900">
                    Share profiles
                    <br />
                    <span className="text-zinc-400">without the noise.</span>
                </h1>

                {/* Sub-copy */}
                <p className="mb-12 max-w-md text-base leading-relaxed text-zinc-500">
                    Create a shared list, get a short code, and let your team add their
                    own profiles — in seconds, no account required.
                </p>

                {/* CTAs */}
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    <button
                        id="create-list-btn"
                        onClick={() => setCreateOpen(true)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-80"
                    >
                        Create a list
                        <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                        id="join-list-btn"
                        onClick={() => setJoinOpen(true)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                    >
                        Join with a code
                    </button>
                </div>

                {/* Social proof hint */}
                <p className="mt-10 text-xs text-zinc-400">
                    No sign up · No email required · Works on all devices
                </p>
            </main>

            {/* ── Modals ────────────────────────────────────── */}
            <CreateListModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
            <JoinListModal isOpen={joinOpen} onClose={() => setJoinOpen(false)} />
        </>
    );
}
