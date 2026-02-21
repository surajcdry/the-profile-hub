import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            {/* ── Header ───────────────────────────────────── */}
            <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5">
                    <Link
                        href="/"
                        className="text-sm font-semibold tracking-tight text-zinc-900 hover:opacity-70 transition-opacity"
                    >
                        The Profile Hub
                    </Link>
                </div>
            </header>

            {/* ── Content ──────────────────────────────────── */}
            <main className="flex flex-1 flex-col items-center justify-center p-5 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
                    <SearchX className="h-8 w-8 text-zinc-400" />
                </div>
                <h1 className="mb-2 text-2xl font-semibold tracking-tight text-zinc-900">
                    List not found
                </h1>
                <p className="mb-8 max-w-sm text-sm leading-relaxed text-zinc-500">
                    We couldn't find a list with that code. It may have been deleted, or
                    the code might be incorrect.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-80"
                >
                    Back to home
                </Link>
            </main>
        </div>
    );
}
