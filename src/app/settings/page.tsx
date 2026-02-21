import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import SettingsForm from "./SettingsForm";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = { title: "Settings · Profile Hub" };

export default async function SettingsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/sign-in?callbackUrl=/settings");
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
            name: true,
            email: true,
            image: true,
            bio: true,
            contactEmail: true,
            phoneNumber: true,
            websiteUrl: true,
            linkedinUrl: true,
            githubUrl: true,
            instagramUrl: true,
            youtubeUrl: true,
            twitterUrl: true,
        },
    });

    if (!user) redirect("/sign-in?callbackUrl=/settings");

    return (
        <div className="flex min-h-screen flex-col bg-[var(--background)]">
            {/* ── Header ─────────────────────────────────────── */}
            <header className="sticky top-0 z-40 glass border-b border-zinc-200/50 dark:border-zinc-800/50">
                <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-6">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <div className="flex items-center gap-3">
                        {user.image && (
                            <Image
                                src={user.image}
                                alt={user.name ?? "Avatar"}
                                width={28}
                                height={28}
                                className="rounded-full ring-2 ring-zinc-100 dark:ring-zinc-800"
                            />
                        )}
                        <span className="hidden max-w-[160px] truncate text-sm text-zinc-500 sm:block dark:text-zinc-400">
                            {user.email}
                        </span>
                        <Link
                            href="/api/auth/signout"
                            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                        >
                            Sign out
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Content ────────────────────────────────────── */}
            <main className="mx-auto max-w-2xl px-6 py-12">
                <div className="mb-2">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to dashboard
                    </Link>
                </div>
                <div className="mb-10 mt-4">
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Profile settings
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        This information appears on your profile card in every
                        list you join.
                    </p>
                </div>

                <SettingsForm user={user} />
            </main>

            {/* ── Footer ─────────────────────────────────────── */}
            <footer className="mt-auto border-t border-zinc-200/50 bg-white/50 py-8 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-950/50">
                <div className="mx-auto flex max-w-2xl items-center justify-between px-6">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">© 2025 Profile Hub</p>
                    <ThemeToggle />
                </div>
            </footer>
        </div>
    );
}
