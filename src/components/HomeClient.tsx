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
import HeroParticles from "./HeroParticles";

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-md"
            onClick={(e) => e.target === overlayRef.current && onClose()}
        >
            <div className="animate-scale-in w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-100/5">
                <div className="mb-6 flex items-start justify-between">
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="ml-4 rounded-xl p-2 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-600 hover:rotate-90 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
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
                    className="btn-gradient flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
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
                    className="btn-gradient flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                    <span>Go to group</span> <ArrowRight className="h-4 w-4" />
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
                className="card-hover flex items-center gap-1.5 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-all hover:border-brand/30 hover:text-brand dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-brand/40 dark:hover:text-brand"
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
        </div>
    );
}

// ─── Mock Profile Card ────────────────────────────────────────────────────────

function MockCard({
    initials,
    name,
    role,
    color,
    delay,
}: {
    initials: string;
    name: string;
    role: string;
    color: string;
    delay?: string;
}) {
    return (
        <div className={`card-hover rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-zinc-700/50 dark:bg-zinc-800/50 animate-fade-in ${delay || ""}`}>
            <div className="flex items-center gap-3 border-b border-zinc-100/80 pb-3 dark:border-zinc-700/50">
                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm ${color}`}
                >
                    {initials}
                </div>
                <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{role}</p>
                </div>
            </div>
            <div className="pt-3 space-y-1.5">
                <div className="h-2 w-3/4 rounded-full bg-zinc-100 dark:bg-zinc-700/50" />
                <div className="h-2 w-1/2 rounded-full bg-zinc-100 dark:bg-zinc-700/50" />
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
        <div className="min-h-screen bg-[var(--background)]">
            {/* ── Header ─────────────────────────────────────── */}
            <header className="sticky top-0 z-40 glass border-b border-zinc-200/50 dark:border-zinc-800/50">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <Logo />

                    {/* Desktop & Mobile nav */}
                    <nav className="flex items-center gap-4">
                        <AuthButton />
                    </nav>
                </div>
            </header>

            {/* ── Hero ───────────────────────────────────────── */}
            <section className="relative overflow-hidden">
                {/* Aurora gradient background */}
                <div className="aurora" aria-hidden><span aria-hidden /></div>
                {/* Dot grid pattern overlay */}
                <div className="pointer-events-none absolute inset-0 -z-[5] dot-grid opacity-40" aria-hidden />
                {/* Animated particles */}
                <HeroParticles />

                <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
                    {/* Text */}
                    <div className="animate-fade-in">
                        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-brand-border/50 bg-white/60 px-4 py-1.5 shadow-sm backdrop-blur-sm dark:border-brand-border/20 dark:bg-zinc-900/60">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                            </span>
                            <span className="text-xs font-medium text-brand tracking-wide">
                                Free &middot; No app needed &middot; Works everywhere
                            </span>
                        </div>

                        <h1 className="mb-6 text-[clamp(2.5rem,5.5vw,4rem)] leading-[1.05] tracking-tight text-zinc-900 dark:text-zinc-50">
                            <span className="font-semibold">Everyone's info,</span>
                            <br />
                            <span className="font-display gradient-text">one place.</span>
                        </h1>

                        <p className="mb-10 max-w-lg text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
                            Perfect for events, meetups, and teams. Start a group,
                            share one link or QR code, and let everyone add their
                            own contact details — no app download needed.
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <button
                                onClick={() => setCreateOpen(true)}
                                className="btn-gradient flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30 transition-shadow"
                            >
                                <span>Start a group</span> <ArrowRight className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setJoinOpen(true)}
                                className="card-hover flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-8 py-4 text-sm font-medium text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                            >
                                Join with an invite code
                            </button>
                        </div>

                        <p className="mt-10 flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                            <span className="flex items-center gap-1.5">
                                <span className="h-1 w-1 rounded-full bg-green-400" />
                                Completely free
                            </span>
                            <span className="text-zinc-300 dark:text-zinc-700">&middot;</span>
                            <span>No credit card</span>
                            <span className="text-zinc-300 dark:text-zinc-700">&middot;</span>
                            <span>Open source</span>
                        </p>
                    </div>

                    {/* Visual preview */}
                    <div className="relative hidden lg:block animate-fade-in delay-300">
                        {/* Decorative glow behind the card */}
                        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand/10 via-transparent to-accent/10 blur-2xl dark:from-brand/5 dark:to-accent/5" aria-hidden />

                        <div className="glass-card relative rounded-3xl p-5 shadow-2xl shadow-zinc-900/5 dark:shadow-zinc-900/30">
                            <div className="mb-5 flex items-center justify-between border-b border-zinc-100/80 pb-4 dark:border-zinc-700/50">
                                <div>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                        Product Design Meetup
                                    </p>
                                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                        3 people &bull; San Francisco
                                    </p>
                                </div>
                                <span className="rounded-lg bg-zinc-100/80 px-2.5 py-1 font-mono text-xs font-semibold tracking-widest text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400">
                                    DSN24K
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <MockCard
                                    initials="AC"
                                    name="Alice Chen"
                                    role="Product Designer"
                                    color="bg-brand"
                                    delay="delay-400"
                                />
                                <MockCard
                                    initials="BS"
                                    name="Bob Smith"
                                    role="Event Organizer"
                                    color="bg-sky-500"
                                    delay="delay-500"
                                />
                            </div>
                            <div className="mt-3">
                                <MockCard
                                    initials="CD"
                                    name="Carol Davis"
                                    role="UX Researcher"
                                    color="bg-teal-500"
                                    delay="delay-600"
                                />
                            </div>
                        </div>

                        {/* Floating notification */}
                        <div className="absolute -right-3 -top-3 animate-float rounded-2xl border border-brand-border/50 bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-sm dark:border-brand-border/20 dark:bg-zinc-900/90">
                            <p className="text-xs font-medium text-brand flex items-center gap-1.5">
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand/10">
                                    <span className="text-[10px]">✓</span>
                                </span>
                                Carol just joined
                            </p>
                        </div>

                        {/* Decorative floating orb */}
                        <div className="absolute -left-8 bottom-12 h-16 w-16 animate-float-delayed rounded-full bg-gradient-to-br from-brand/20 to-accent/20 blur-xl dark:from-brand/10 dark:to-accent/10" aria-hidden />
                    </div>
                </div>
            </section>

            {/* ── How it works ───────────────────────────────── */}
            <section className="relative border-t border-zinc-200/50 px-6 py-24 dark:border-zinc-800/50">
                {/* Subtle gradient background */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900/30 dark:to-zinc-950" aria-hidden />

                <div className="relative mx-auto max-w-6xl">
                    <div className="mb-16 text-center animate-fade-in">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                            How it works
                        </p>
                        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                            Set up in under a <span className="font-display gradient-text">minute</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-md text-base text-zinc-500 dark:text-zinc-400">
                            No complicated setup, no spam, no clutter.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        {[
                            {
                                icon: <Zap className="h-5 w-5" />,
                                step: "01",
                                title: "Start a group",
                                desc: "Sign in and create a group with a name. You'll get a unique invite code right away.",
                                delayClass: "delay-100",
                            },
                            {
                                icon: <QrCode className="h-5 w-5" />,
                                step: "02",
                                title: "Share the invite",
                                desc: "Share a link, the invite code, or scan the QR code. Works on any device, no login to view.",
                                delayClass: "delay-300",
                            },
                            {
                                icon: <Users className="h-5 w-5" />,
                                step: "03",
                                title: "Everyone joins",
                                desc: "Each person adds their own contact info — links, social handles, whatever they'd like to share.",
                                delayClass: "delay-500",
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className={`group card-hover rounded-3xl border border-zinc-200/80 bg-white/70 p-7 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/50 animate-fade-in-up ${item.delayClass}`}
                            >
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-pale to-accent-pale text-brand transition-transform group-hover:scale-110 dark:from-brand/10 dark:to-accent/10">
                                        {item.icon}
                                    </div>
                                    <span className="font-mono text-xs font-bold tracking-widest text-zinc-300 dark:text-zinc-600">
                                        {item.step}
                                    </span>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</h3>
                                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Social proof / Trust bar ────────────────────── */}
            <section className="border-t border-zinc-200/50 px-6 py-16 dark:border-zinc-800/50">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
                    <div className="flex -space-x-2">
                        {["bg-brand", "bg-sky-500", "bg-teal-500", "bg-rose-500", "bg-amber-500"].map((c, i) => (
                            <div key={i} className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-white dark:ring-zinc-950 ${c}`}>
                                {["S", "M", "K", "R", "A"][i]}
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Trusted by event organizers, meetup hosts, and teams everywhere.
                    </p>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────── */}
            <footer className="border-t border-zinc-200/50 bg-white/50 px-6 py-10 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-950/50">
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
                    <Logo />
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        © {new Date().getFullYear()} Profile Hub &middot; Free & Open Source
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/about" className="link-underline text-xs text-zinc-400 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300 hover:text-zinc-700">
                            About
                        </Link>
                        <Link href="/privacy" className="link-underline text-xs text-zinc-400 transition-colors dark:text-zinc-500 dark:hover:text-zinc-300 hover:text-zinc-700">
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
