import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ObfuscatedEmail } from "@/components/ObfuscatedEmail";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
    title: "About · Profile Hub",
    description:
        "The story behind Profile Hub — why it was built and who made it.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* ── Nav ───────────────────────────────────────── */}
            <header className="sticky top-0 z-40 glass border-b border-zinc-200/50 dark:border-zinc-800/50">
                <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <nav className="flex items-center gap-5 text-sm text-zinc-500">
                        <Link
                            href="/privacy"
                            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/sign-in"
                            className="btn-gradient rounded-xl px-5 py-2 text-sm font-medium text-white shadow-sm"
                        >
                            <span>Get started</span>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* ── Content ─────────────────────────────────────── */}
            <main className="mx-auto max-w-2xl px-6 py-16">
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </Link>

                {/* Hero */}
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
                    About <span className="gradient-text">Profile Hub</span>
                </h1>
                <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
                    A tiny tool born out of one too many awkward event moments.
                </p>

                {/* Story */}
                <section className="mt-10 space-y-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                    <p>
                        I kept running into the same problem at meetups, workshops, and
                        networking events: someone asks{" "}
                        <em>"how do I reach you?"</em>
                    </p>
                    <p>
                        Suddenly five different
                        people are trying to send five different links — LinkedIn,
                        Instagram, a website, a GitHub, a phone number — all tangled up
                        in group chats and emails that nobody actually reads.
                    </p>
                    <p>
                        I'd seen event hosts paste a wall of links into a chat box and
                        watch attendees completely ignore it. I'd seen people type their
                        email into Slack only to have it autocorrect into nonsense. I'd
                        even seen someone pull out a stack of business cards in 2024.
                    </p>
                    <p>
                        So I built <strong className="text-zinc-900 dark:text-zinc-50">Profile Hub</strong>.
                    </p>
                    <p>
                        The idea is simple: the host creates a group in seconds, shares one
                        link or QR code, and every attendee can add their own contact info
                        in under a minute — no sign-up forms, no app to download, no
                        friction.
                    </p>
                    <p>
                        Everyone ends up in one tidy list that the whole group
                        can see.
                    </p>
                    <p>
                        That's it. No ads, no premium tier, no ulterior motive. Just a
                        small free tool that solves a small annoying problem.
                    </p>
                </section>

                {/* Divider */}
                <hr className="my-10 border-zinc-100 dark:border-zinc-800" />

                {/* Open source callout */}
                <section className="glass-card rounded-3xl p-7 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        Free &amp; open source
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        Profile Hub is completely free to use and the source code is
                        publicly available on GitHub. You're welcome to inspect it, fork
                        it, or self-host it. No hidden costs, ever. 
                    </p>
                    <a
                        href="https://github.com/surajcdry/the-profile-hub"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-50"
                    >
                        <Github className="h-4 w-4" />
                        View on GitHub
                    </a>
                </section>

                {/* Contact */}
                <section className="mt-8">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        Say hello
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        Have a question, a suggestion, or just want to say hi? Reach out
                        at{" "}
                        <ObfuscatedEmail linkClassName="font-medium text-brand hover:underline" />.
                    </p>
                </section>
            </main>

            {/* ── Footer ──────────────────────────────────────── */}
            <footer className="border-t border-zinc-200/50 bg-white/50 py-10 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-950/50">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 text-center text-xs text-zinc-400 sm:flex-row sm:justify-between sm:text-left dark:text-zinc-500">
                    <span>© {new Date().getFullYear()} Profile Hub. Free &amp; open source.</span>
                    <div className="flex items-center gap-4">
                        <Link href="/about" className="hover:text-zinc-700 dark:hover:text-zinc-300">
                            About
                        </Link>
                        <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300">
                            Privacy
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </footer>
        </div>
    );
}
