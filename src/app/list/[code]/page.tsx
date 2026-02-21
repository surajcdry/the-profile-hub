import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import JoinListButton from "./JoinListButton";
import CopyLinkButton from "@/components/CopyLinkButton";
import QRCodeButton from "@/components/QRCodeButton";
import { ArrowLeft, Users } from "lucide-react";
import { headers } from "next/headers";
import { Logo } from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import ListSettingsModal from "./ListSettingsModal";
import LeaveListButton from "./LeaveListButton";
import { cookies } from "next/headers";
import UnlockListForm from "./UnlockListForm";

type Props = {
    params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { code } = await params;
    const list = await db.list.findUnique({
        where: { code: code.toUpperCase() },
        select: { name: true },
    });

    return { title: list ? `${list.name} · The Profile Hub` : "List Not Found" };
}

export default async function ListPage({ params }: Props) {
    const { code } = await params;
    const uppercaseCode = code.toUpperCase();

    const [session, headersList, cookieStore] = await Promise.all([auth(), headers(), cookies()]);

    const list = await db.list.findUnique({
        where: { code: uppercaseCode },
        include: {
            members: {
                include: { user: true },
                orderBy: { joinedAt: "asc" },
            },
            creator: {
                select: { name: true },
            },
        },
    });

    if (!list) return notFound();

    const isMember = session?.user?.id
        ? list.members.some((m) => m.userId === session?.user?.id)
        : false;

    const isCreator = session?.user?.id === list.creatorId;
    const otherMembers = list.members.filter(m => m.userId !== session?.user?.id);

    const isUnlocked = cookieStore.get(`unlocked_list_${uppercaseCode}`)?.value === "true";
    const needsUnlock = !isMember && !isCreator && list.passwordEnabled && !isUnlocked;

    const host = headersList.get("host") || "localhost:3000";
    const protocol = headersList.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "development" ? "http" : "https");
    const listUrl = `${protocol}://${host}/list/${list.code}`;

    return (
        <div className="flex min-h-screen flex-col bg-[var(--background)]">
            {/* ── Header ─────────────────────────────────────── */}
            <header className="sticky top-0 z-40 glass border-b border-zinc-200/50 dark:border-zinc-800/50">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="hidden items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 sm:flex dark:text-zinc-400 dark:hover:text-zinc-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <span className="rounded-xl bg-zinc-100/80 px-3 py-1.5 font-mono text-xs font-semibold tracking-widest text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400">
                            {list.code}
                        </span>
                    </div>
                </div>
            </header>

            {/* ── Content ──────────────────────────────────── */}
            <main className="mx-auto max-w-6xl px-6 py-12">
                {/* List Header Info */}
                <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                            {list.name}
                        </h1>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                            <span>Created by {list.creator.name || "Anonymous"}</span>
                            <span className="text-zinc-300 dark:text-zinc-600">·</span>
                            <span className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {list.members.length}{" "}
                                {list.members.length === 1 ? "member" : "members"}
                            </span>
                        </div>

                        {list.description && (
                            <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                {list.description}
                            </p>
                        )}

                        {/* Share buttons */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <CopyLinkButton url={listUrl} />
                            <QRCodeButton
                                url={listUrl}
                                name={list.name}
                                password={isCreator ? list.password : null}
                            />
                            {isCreator && (
                                <ListSettingsModal
                                    list={list}
                                    members={otherMembers}
                                />
                            )}
                        </div>
                    </div>

                    {/* Join CTA */}
                    {!isMember && (
                        <div className="shrink-0">
                            {session?.user?.id ? (
                                <JoinListButton
                                    code={list.code}
                                    passwordEnabled={list.passwordEnabled}
                                />
                            ) : (
                                <Link
                                    href={`/sign-in?callbackUrl=/list/${list.code}`}
                                    className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark"
                                >
                                    Sign in to join
                                </Link>
                            )}
                        </div>
                    )}

                    {isMember && !isCreator && (
                        <div className="flex shrink-0 items-center gap-3">
                            <div className="rounded-xl border border-green-200/80 bg-green-50/80 px-4 py-2 text-sm font-medium text-green-700 backdrop-blur-sm dark:border-green-900/30 dark:bg-green-900/15 dark:text-green-400">
                                ✓ You're a member
                            </div>
                            <LeaveListButton
                                listId={list.id}
                                code={list.code}
                                isCreator={isCreator}
                                memberCount={list.members.length}
                            />
                        </div>
                    )}
                    {isCreator && (
                        <div className="shrink-0 rounded-2xl border border-brand-border/50 bg-brand-pale/80 px-5 py-2.5 text-sm font-medium text-brand backdrop-blur-sm dark:border-brand-dark/30 dark:bg-brand-dark/10 dark:text-brand-light">
                            ★ You're the host
                        </div>
                    )}
                </div>

                {/* Member Grid */}
                {needsUnlock ? (
                    <UnlockListForm code={list.code} />
                ) : list.members.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300/80 bg-white/50 py-28 text-center backdrop-blur-sm dark:border-zinc-700/50 dark:bg-zinc-900/30">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-pale to-accent-pale dark:from-brand/10 dark:to-accent/10">
                            <Users className="h-6 w-6 text-brand" />
                        </div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            It's quiet here
                        </p>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            No one has joined this list yet. Be the first!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {list.members.map((member) => (
                            <ProfileCard key={member.id} user={member.user} />
                        ))}
                    </div>
                )}
            </main>

            {/* ── Footer ─────────────────────────────────────── */}
            <footer className="mt-auto border-t border-zinc-200/50 bg-white/50 py-8 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-950/50">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">© 2025 Profile Hub</p>
                    <ThemeToggle />
                </div>
            </footer>
        </div>
    );
}
