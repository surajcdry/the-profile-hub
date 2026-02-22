import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import SettingsForm from "./SettingsForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import UserAvatar from "@/components/UserAvatar";

export const metadata = { title: "Settings · Profile Hub" };

type Props = {
    searchParams: Promise<{ callbackUrl?: string; autoJoin?: string }>;
};

export default async function SettingsPage({ searchParams }: Props) {
    const { callbackUrl } = await searchParams;
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
        <div className="flex min-h-screen flex-col overflow-x-hidden bg-[var(--background)]">
            {/* ── Header ─────────────────────────────────────── */}
            <header className="sticky top-0 z-40 glass border-b border-zinc-200/50 dark:border-zinc-800/50">
                <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-6">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                        >
                            Dashboard
                        </Link>
                        <UserAvatar />
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

                <SettingsForm user={user} callbackUrl={callbackUrl} />

                {/* Sign out */}
                <div className="mt-8 flex justify-center">
                    <Link
                        href="/api/auth/signout"
                        className="text-sm font-medium text-red-500 transition-colors hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                        Sign out
                    </Link>
                </div>
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
