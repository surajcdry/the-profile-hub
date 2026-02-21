import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import CopyLinkButton from "@/components/CopyLinkButton";
import QRCodeButton from "@/components/QRCodeButton";
import { ArrowRight, List as ListIcon, Plus, Settings, User } from "lucide-react";
import { headers } from "next/headers";
import { Logo } from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
    title: "Dashboard · Profile Hub",
};

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/sign-in?callbackUrl=/dashboard");
    }

    const userId = session.user.id;

    // Fetch lists created by the user
    const createdLists = await db.list.findMany({
        where: { creatorId: userId },
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { members: true } },
        },
    });

    // Fetch lists joined by the user
    const memberships = await db.listMember.findMany({
        where: { userId: userId },
        include: {
            list: {
                include: {
                    _count: { select: { members: true } },
                },
            },
        },
        orderBy: { joinedAt: "desc" },
    });

    const allJoinedLists = memberships.map((m) => m.list);

    // Filter out lists the user created from the joined lists array
    const createdListIds = new Set(createdLists.map((l) => l.id));
    const joinedOnlyLists = allJoinedLists.filter(
        (list) => !createdListIds.has(list.id)
    );

    // Helper to build absolute URLs for the copy button
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const user = await db.user.findUnique({
        where: { id: userId },
        select: { name: true, image: true },
    });

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
                            href="/settings"
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                        >
                            <Settings className="h-3.5 w-3.5" />
                            <span className="hidden sm:block">Settings</span>
                        </Link>
                        {user?.image ? (
                            <Image
                                src={user.image}
                                alt={user.name ?? "Avatar"}
                                width={28}
                                height={28}
                                className="rounded-full ring-2 ring-zinc-100 dark:ring-zinc-800"
                            />
                        ) : (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-light text-xs font-semibold text-brand-dark">
                                {user?.name?.[0]?.toUpperCase() ?? <User className="h-3.5 w-3.5" />}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Content ──────────────────────────────────── */}
            <main className="mx-auto max-w-5xl px-5 py-10">
                {/* Page title + stats */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            Welcome back
                            {user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
                        </p>
                    </div>
                    {/* Stats pills */}
                    <div className="flex items-center gap-2">
                        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                                {createdLists.length}
                            </p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">Created</p>
                        </div>
                        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                                {joinedOnlyLists.length}
                            </p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500">Joined</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Created Lists Section */}
                    <section>
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                                Lists I Created
                                <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                    {createdLists.length}
                                </span>
                            </h2>
                        </div>

                        {createdLists.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <Plus className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                                </div>
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">No lists yet</p>
                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                    Create your first list to get started.
                                </p>
                                <Link
                                    href="/"
                                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create a list
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {createdLists.map((list) => (
                                    <div
                                        key={list.id}
                                        className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                                    >
                                        <div className="mb-4 flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
                                                    {list.name}
                                                </h3>
                                                <p className="mt-0.5 text-sm text-zinc-400 dark:text-zinc-500">
                                                    {list._count.members}{" "}
                                                    {list._count.members === 1 ? "member" : "members"}
                                                </p>
                                            </div>
                                            <span className="shrink-0 rounded-lg bg-zinc-100 px-2 py-1 font-mono text-xs font-semibold tracking-widest text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                {list.code}
                                            </span>
                                        </div>

                                        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                                            <CopyLinkButton url={`${baseUrl}/list/${list.code}`} />
                                            <QRCodeButton
                                                url={`${baseUrl}/list/${list.code}`}
                                                name={list.name}
                                                size="sm"
                                            />
                                            <Link
                                                href={`/list/${list.code}`}
                                                className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                                            >
                                                View <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Joined Lists Section */}
                    <section>
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                                Lists I Joined
                                <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                    {joinedOnlyLists.length}
                                </span>
                            </h2>
                        </div>

                        {joinedOnlyLists.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <ListIcon className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                                </div>
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">No joined lists</p>
                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                    Lists you join with a code will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {joinedOnlyLists.map((list) => (
                                    <div
                                        key={list.id}
                                        className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                                    >
                                        <div className="mb-4 flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
                                                    {list.name}
                                                </h3>
                                                <p className="mt-0.5 text-sm text-zinc-400 dark:text-zinc-500">
                                                    {list._count.members}{" "}
                                                    {list._count.members === 1 ? "member" : "members"}
                                                </p>
                                            </div>
                                            <span className="shrink-0 rounded-lg bg-zinc-100 px-2 py-1 font-mono text-xs font-semibold tracking-widest text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                {list.code}
                                            </span>
                                        </div>

                                        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                                            <CopyLinkButton url={`${baseUrl}/list/${list.code}`} />
                                            <QRCodeButton
                                                url={`${baseUrl}/list/${list.code}`}
                                                name={list.name}
                                                size="sm"
                                            />
                                            <Link
                                                href={`/list/${list.code}`}
                                                className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                                            >
                                                View <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
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
