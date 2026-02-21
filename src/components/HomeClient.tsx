"use client";

import {
    useState,
    useRef,
    useEffect,
    useActionState,
    type FormEvent,
} from "react";
import {
    X,
    ArrowRight,
    LogIn,
    Users,
    QrCode,
    Link2,
    Zap,
    Menu,
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createList } from "@/app/actions/createList";
import ThemeToggle from "./ThemeToggle";
import { Logo } from "./Logo";

// ─── Modal ────────────────────────────────────────────────────────────────────

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
            onClick={(e) => e.target === overlayRef.current && onClose()}
        >
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-zinc-100 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-6 flex items-start justify-between">
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="ml-4 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
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
    const router = useRouter();
    const [name, setName] = useState("");
    const [passwordEnabled, setPasswordEnabled] = useState(true);
    const [password, setPassword] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [state, formAction, isPending] = useActionState(createList, {
        success: false,
    });
    const { status } = useSession();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setPasswordEnabled(true);
            setPassword("");
        }
        else setName("");
    }, [isOpen]);

    useEffect(() => {
        if (state.success && state.code) {
            router.push(`/list/${state.code}`);
            onClose();
        }
    }, [state, router, onClose]);

    const handleCreate = (formData: FormData) => {
        if (status !== "authenticated") {
            signIn(undefined, { callbackUrl: "/" });
            return;
        }
        formData.set("passwordEnabled", String(passwordEnabled));
        if (passwordEnabled) formData.set("password", password);
        formAction(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Start a group">
            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
                Give your group a name. You'll get a short invite code to share
                with everyone.
            </p>
            <form action={handleCreate} className="space-y-4">
                {state.message && !state.success && (
                    <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
                        {state.message}
                    </div>
                )}
                <div>
                    <label
                        htmlFor="name"
                        className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500"
                    >
                        Group name
                    </label>
                    <input
                        ref={inputRef}
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Design Meetup, Book Club, SF Team"
                        maxLength={60}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-brand focus:bg-white transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:bg-zinc-900"
                    />
                </div>

                <div className="rounded-xl border border-zinc-200 p-4 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                Require a password to join
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Give members a password along with the invite code
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setPasswordEnabled(!passwordEnabled)}
                            role="switch"
                            aria-checked={passwordEnabled}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${passwordEnabled ? "bg-brand" : "bg-zinc-200 dark:bg-zinc-700"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${passwordEnabled ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    {passwordEnabled && (
                        <div className="mt-4">
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-400"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="e.g. secret123"
                                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-brand transition-colors dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                                required={passwordEnabled}
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={!name.trim() || isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isPending
                        ? "Creating…"
                        : status === "authenticated"
                            ? "Create group"
                            : "Sign in to continue"}
                    {!isPending && <ArrowRight className="h-4 w-4" />}
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
    const router = useRouter();
    const [code, setCode] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
        else setCode("");
    }, [isOpen]);

    const handleInput = (val: string) => {
        setCode(
            val
                .replace(/[^a-zA-Z0-9]/g, "")
                .toUpperCase()
                .slice(0, CODE_LENGTH)
        );
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (code.length < CODE_LENGTH) return;
        router.push(`/list/${code}`);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Join a group">
            <p className="mb-6 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                Enter the invite code you received. It looks like{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                    ABC123
                </span>
                .
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="list-code"
                        className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500"
                    >
                        Invite code
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
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-center font-mono text-xl tracking-[0.4em] text-zinc-900 outline-none placeholder:tracking-normal placeholder:text-zinc-400 focus:border-brand focus:bg-white transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:bg-zinc-900"
                    />
                    <p className="mt-1.5 text-right text-xs text-zinc-400">
                        {code.length}/{CODE_LENGTH}
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={code.length < CODE_LENGTH}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Go to group <ArrowRight className="h-4 w-4" />
                </button>
            </form>
        </Modal>
    );
}

// ─── Auth Button ──────────────────────────────────────────────────────────────

function AuthButton() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        );
    }

    if (!session) {
        return (
            <button
                onClick={() => signIn()}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
            >
                <LogIn className="h-3.5 w-3.5" />
                Sign in
            </button>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
                Dashboard
            </Link>
            <Link
                href="/settings"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
                {session.user?.image ? (
                    <Image
                        src={session.user.image}
                        alt={session.user.name ?? "Avatar"}
                        width={26}
                        height={26}
                        className="rounded-full ring-2 ring-zinc-100 dark:ring-zinc-800"
                    />
                ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-light text-xs font-semibold text-brand">
                        {session.user?.name?.[0]?.toUpperCase() ?? "?"}
                    </span>
                )}
                <span className="hidden sm:block">
                    {session.user?.name?.split(" ")[0] ?? "Profile"}
                </span>
            </Link>
            <button
                onClick={() => signOut()}
                className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300"
            >
                Sign out
            </button>
        </div>
    );
}

// ─── Mock Profile Card ────────────────────────────────────────────────────────

function MockCard({
    initials,
    name,
    role,
    color,
}: {
    initials: string;
    name: string;
    role: string;
    color: string;
}) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${color}`}
                >
                    {initials}
                </div>
                <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{role}</p>
                </div>
            </div>
            <div className="pt-3 space-y-1.5">
                <div className="h-2 w-3/4 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                <div className="h-2 w-1/2 rounded-full bg-zinc-100 dark:bg-zinc-800" />
            </div>
        </div>
    );
}

// ─── Home Client ─────────────────────────────────────────────────────────────

export default function HomeClient() {
    const [createOpen, setCreateOpen] = useState(false);
    const [joinOpen, setJoinOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            {/* ── Header ─────────────────────────────────────── */}
            <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
                    <Logo />

                    {/* Desktop & Mobile nav */}
                    <nav className="flex items-center gap-3">
                        <AuthButton />
                    </nav>
                </div>
            </header>

            {/* ── Hero ───────────────────────────────────────── */}
            <section className="relative overflow-hidden">
                {/* Soft gradient background */}
                <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
                    <div className="absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand-pale opacity-70 blur-3xl" />
                </div>

                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-16 px-5 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
                    {/* Text */}
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-pale px-3 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                            <span className="text-xs font-medium text-brand tracking-wide">
                                Free · No app needed · Works everywhere
                            </span>
                        </div>

                        <h1 className="mb-5 text-[clamp(2.2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-50">
                            Everyone's info,
                            <br />
                            <span className="text-brand">one place.</span>
                        </h1>

                        <p className="mb-10 max-w-md text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
                            Perfect for events, meetups, and teams. Start a group,
                            share one link or QR code, and let everyone add their
                            own contact details — no app download needed.
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <button
                                onClick={() => setCreateOpen(true)}
                                className="flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
                            >
                                Start a group <ArrowRight className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setJoinOpen(true)}
                                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                Join with an invite code
                            </button>
                        </div>

                        <p className="mt-8 text-xs text-zinc-400 dark:text-zinc-500">
                            Completely free · No credit card · Open source
                        </p>
                    </div>

                    {/* Visual preview */}
                    <div className="relative hidden lg:block">
                        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
                                <div>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                        Product Design Meetup
                                    </p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                        3 people • San Francisco
                                    </p>
                                </div>
                                <span className="rounded-lg bg-zinc-100 px-2.5 py-1 font-mono text-xs font-semibold tracking-widest text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                    DSN24K
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <MockCard
                                    initials="AC"
                                    name="Alice Chen"
                                    role="Product Designer"
                                    color="bg-brand"
                                />
                                <MockCard
                                    initials="BS"
                                    name="Bob Smith"
                                    role="Event Organizer"
                                    color="bg-sky-500"
                                />
                            </div>
                            <div className="mt-3">
                                <MockCard
                                    initials="CD"
                                    name="Carol Davis"
                                    role="UX Researcher"
                                    color="bg-teal-500"
                                />
                            </div>
                        </div>
                        {/* Floating notification */}
                        <div className="absolute -right-4 -top-4 rounded-xl border border-brand-border bg-brand-pale px-3 py-2 shadow-sm">
                            <p className="text-xs font-medium text-brand">
                                ✓ Carol just joined
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── How it works ───────────────────────────────── */}
            <section className="border-t border-zinc-100 bg-zinc-50 px-5 py-20 dark:border-zinc-800 dark:bg-zinc-900/20">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-12 text-center">
                        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Set up in under a minute
                        </h2>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            No complicated setup, no spam, no clutter.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-pale dark:bg-brand-dark/20">
                                <Zap className="h-5 w-5 text-brand dark:text-brand-light" />
                            </div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Step 1</p>
                            <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">Start a group</h3>
                            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                Sign in and create a group with a name. You'll
                                get a unique invite code right away.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-pale dark:bg-brand-dark/20">
                                <QrCode className="h-5 w-5 text-brand dark:text-brand-light" />
                            </div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Step 2</p>
                            <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">Share the invite</h3>
                            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                Share a link, the invite code, or scan the QR
                                code. Works on any device, no login to view.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-pale dark:bg-brand-dark/20">
                                <Users className="h-5 w-5 text-brand dark:text-brand-light" />
                            </div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Step 3</p>
                            <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">Everyone joins</h3>
                            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                Each person adds their own contact info —
                                links, social handles, whatever they'd like to
                                share.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────── */}
            <footer className="border-t border-zinc-100 bg-white px-5 py-8 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <Logo />
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        © 2025 Profile Hub · Free & Open Source
                    </p>
                    <div className="flex items-center gap-5">
                        <Link href="/about" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300">
                            About
                        </Link>
                        <Link href="/privacy" className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300">
                            Privacy
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </footer>

            {/* ── Modals ─────────────────────────────────────── */}
            <CreateListModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
            <JoinListModal isOpen={joinOpen} onClose={() => setJoinOpen(false)} />
        </div>
    );
}
