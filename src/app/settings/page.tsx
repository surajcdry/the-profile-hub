import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import SettingsForm from "./SettingsForm";
import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Settings · The Profile Hub" };

export default async function SettingsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
            name: true,
            email: true,
            image: true,
            bio: true,
            linkedinUrl: true,
            githubUrl: true,
            instagramUrl: true,
            phoneNumber: true,
        },
    });

    if (!user) redirect("/api/auth/signin");

    return (
        <div className="min-h-screen bg-zinc-50">
            {/* ── Header ─────────────────────────────────────── */}
            <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
                    <Link
                        href="/"
                        className="text-sm font-semibold tracking-tight text-zinc-900 hover:opacity-70 transition-opacity"
                    >
                        The Profile Hub
                    </Link>
                    <div className="flex items-center gap-3">
                        {user.image && (
                            <Image
                                src={user.image}
                                alt={user.name ?? "Avatar"}
                                width={28}
                                height={28}
                                className="rounded-full"
                            />
                        )}
                        <span className="hidden text-sm text-zinc-500 sm:block">
                            {user.email}
                        </span>
                        <Link
                            href="/api/auth/signout"
                            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
                        >
                            Sign out
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Content ────────────────────────────────────── */}
            <main className="mx-auto max-w-2xl px-5 py-12">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                        Profile settings
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        This information will appear on your public profile card in any list
                        you join.
                    </p>
                </div>

                <SettingsForm user={user} />
            </main>
        </div>
    );
}
