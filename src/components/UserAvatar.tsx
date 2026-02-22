import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

/**
 * A small avatar that links to /settings.
 * Renders the user's profile photo (or initials) in the top-right header.
 * Returns null if the user isn't signed in.
 */
export default async function UserAvatar() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, image: true },
    });

    if (!user) return null;

    return (
        <Link
            href="/settings"
            className="shrink-0 rounded-full transition-transform hover:scale-105"
            aria-label="Edit profile"
        >
            {user.image ? (
                <Image
                    src={user.image}
                    alt={user.name ?? "Avatar"}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-white shadow-sm dark:ring-zinc-800"
                />
            ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent text-xs font-semibold text-white shadow-sm">
                    {user.name?.[0]?.toUpperCase() ?? "?"}
                </span>
            )}
        </Link>
    );
}
