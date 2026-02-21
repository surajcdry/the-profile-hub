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
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
            {/* ── Header ─────────────────────────────────────── */}
            <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
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
                        <span className="rounded-lg bg-zinc-100 px-2.5 py-1 font-mono text-xs font-semibold tracking-widest text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                            {list.code}
                        </span>
                    </div>
                </div>
            </header>

            {/* ── Content ──────────────────────────────────── */}
            <main className="mx-auto max-w-5xl px-5 py-10">
                {/* List Header Info */}
                <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
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
                            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400">
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
                        <div className="shrink-0 rounded-xl border border-brand-border bg-brand-pale px-4 py-2 text-sm font-medium text-brand dark:border-brand-dark/30 dark:bg-brand-dark/10 dark:text-brand-light">
                            ★ You're the host
                        </div>
                    )}
                </div>

                {/* Member Grid */}
                {needsUnlock ? (
                    <UnlockListForm code={list.code} />
                ) : list.members.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-24 text-center dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <Users className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                        </div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            It's quiet here
                        </p>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            No one has joined this list yet. Be the first!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {list.members.map((member) => (
                            <ProfileCard key={member.id} user={member.user} />
                        ))}
                    </div>
                )}
            </main>

            {/* ── Footer ─────────────────────────────────────── */}
            <footer className="mt-auto border-t border-zinc-100 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-5">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">© 2025 Profile Hub</p>
                    <ThemeToggle />
                </div>
            </footer>
        </div>
    );
}
