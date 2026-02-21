import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ObfuscatedEmail } from "@/components/ObfuscatedEmail";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
    title: "Privacy Policy · Profile Hub",
    description: "How Profile Hub collects and uses your data.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
            <div className="space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{children}</div>
        </section>
    );
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* ── Nav ─────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 border-b border-zinc-100 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
                <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <nav className="flex items-center gap-5 text-sm text-zinc-500">
                        <Link
                            href="/about"
                            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
                        >
                            About
                        </Link>
                        <Link
                            href="/sign-in"
                            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
                        >
                            Get started
                        </Link>
                    </nav>
                </div>
            </header>

            {/* ── Content ─────────────────────────────────────── */}
            <main className="mx-auto max-w-2xl px-5 py-14">
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </Link>

                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Privacy Policy
                </h1>
                <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
                    Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>

                <div className="mt-10 space-y-8 rounded-2xl border border-zinc-100 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                    <Section title="The short version">
                        <p>
                            Profile Hub collects only what's needed to make the service
                            work. We don't sell your data, we don't run ads, and we don't
                            share your information with third parties except where strictly
                            necessary to operate the service.
                        </p>
                    </Section>

                    <Section title="What we collect">
                        <p>
                            <strong className="text-zinc-800 dark:text-zinc-50">Account information:</strong>{" "}
                            When you sign in with Google or GitHub, we receive your name,
                            email address, and profile photo from that provider. This is
                            used to identify you within the app.
                        </p>
                        <p>
                            <strong className="text-zinc-800 dark:text-zinc-50">Profile data you enter:</strong>{" "}
                            Any information you add to your profile — bio, contact email,
                            phone number, social links, etc. — is stored so it can be
                            displayed on your profile card in groups you join.
                        </p>
                        <p>
                            <strong className="text-zinc-800 dark:text-zinc-50">Groups you create or join:</strong>{" "}
                            We store the groups you create (name and invite code) and which
                            groups you're a member of.
                        </p>
                    </Section>

                    <Section title="What we don't collect">
                        <p>
                            We don't track your behaviour across other websites, run
                            advertising cookies, or build profiles for marketing purposes.
                            We also don't collect payment information — Profile Hub is
                            free.
                        </p>
                    </Section>

                    <Section title="How we use your data">
                        <p>Your data is used solely to provide the service:</p>
                        <ul className="ml-4 list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
                            <li>To show your profile card to other members of a group you've joined.</li>
                            <li>To let you manage and update your profile information.</li>
                            <li>To associate you with groups you create or join.</li>
                            <li>To keep you signed in via a secure session cookie.</li>
                        </ul>
                    </Section>

                    <Section title="Who can see your profile">
                        <p>
                            Your profile card (name, photo, bio, and any links you've
                            added) is visible to <strong className="text-zinc-800 dark:text-zinc-50">other
                                members of groups you join</strong>. It is not visible to the
                            public or to members of groups you haven't joined.
                        </p>
                        <p>
                            Think carefully before adding sensitive contact information —
                            only add details you're comfortable sharing with a group.
                        </p>
                    </Section>

                    <Section title="Data storage and security">
                        <p>
                            Your data is stored in a PostgreSQL database hosted on{" "}
                            <a
                                href="https://neon.tech"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand hover:underline"
                            >
                                Neon
                            </a>
                            . Connections are encrypted in transit (TLS). We take
                            reasonable precautions to protect your data, though no
                            internet service can guarantee absolute security.
                        </p>
                    </Section>

                    <Section title="Deleting your data">
                        <p>
                            You can update or clear your profile information at any time
                            from the Settings page. If you'd like your account and all
                            associated data permanently deleted, email us and we'll take
                            care of it within 7 days.
                        </p>
                    </Section>

                    <Section title="Third-party services">
                        <p>
                            Profile Hub uses the following third-party services, each with
                            their own privacy policies:
                        </p>
                        <ul className="ml-4 list-disc space-y-1 text-zinc-600 dark:text-zinc-400">
                            <li>
                                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Google</a>
                                {" "}— OAuth sign-in
                            </li>
                            <li>
                                <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">GitHub</a>
                                {" "}— OAuth sign-in
                            </li>
                            <li>
                                <a href="https://neon.tech/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Neon</a>
                                {" "}— Database hosting
                            </li>
                            <li>
                                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Vercel</a>
                                {" "}— App hosting and deployment
                            </li>
                        </ul>
                    </Section>

                    <Section title="Changes to this policy">
                        <p>
                            If we make meaningful changes, we'll update the date at the
                            top of this page. We won't do anything surprising with your
                            data.
                        </p>
                    </Section>

                    <Section title="Questions?">
                        <p>
                            Reach out at{" "}
                            <ObfuscatedEmail linkClassName="font-medium text-brand hover:underline" />.
                        </p>
                    </Section>
                </div>
            </main>

            {/* ── Footer ──────────────────────────────────────── */}
            <footer className="border-t border-zinc-100 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-5 text-center text-xs text-zinc-400 sm:flex-row sm:justify-between sm:text-left dark:text-zinc-500">
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
