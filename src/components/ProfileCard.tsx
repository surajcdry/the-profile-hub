import Image from "next/image";
import { Linkedin, Github, Instagram, Phone, Globe, Youtube, Twitter, Mail } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";

type ProfileUser = Prisma.UserGetPayload<{
    select: {
        name: true;
        image: true;
        bio: true;
        contactEmail: true;
        phoneNumber: true;
        websiteUrl: true;
        linkedinUrl: true;
        githubUrl: true;
        instagramUrl: true;
        youtubeUrl: true;
        twitterUrl: true;
    };
}>;

function getInitials(name: string | null) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type LinkItemProps = {
    href: string;
    label: string;
    children: React.ReactNode;
    hoverClass: string;
};

function LinkIcon({ href, label, children, hoverClass }: LinkItemProps) {
    return (
        <a
            href={href}
            target={href.startsWith("mailto:") || href.startsWith("tel:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className={`flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 transition-all hover:scale-110 dark:text-zinc-500 ${hoverClass}`}
            aria-label={label}
        >
            {children}
        </a>
    );
}

export default function ProfileCard({ user, role = "Member" }: { user: ProfileUser; role?: string }) {
    const firstName = user.name?.split(" ")[0] || "Someone";
    const initials = getInitials(user.name);
    const hasAnyLink =
        user.contactEmail ||
        user.phoneNumber ||
        user.websiteUrl ||
        user.linkedinUrl ||
        user.githubUrl ||
        user.instagramUrl ||
        user.youtubeUrl ||
        user.twitterUrl;

    return (
        <div className="group card-hover flex flex-col rounded-3xl border border-zinc-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
            {/* ── Header: Avatar + Name ────────────────────── */}
            <div className="flex items-center gap-3.5 border-b border-zinc-100/80 pb-4 dark:border-zinc-800/50">
                {user.image ? (
                    <Image
                        src={user.image}
                        alt={user.name ?? "Avatar"}
                        width={44}
                        height={44}
                        className="shrink-0 rounded-full ring-2 ring-white shadow-sm transition-transform group-hover:scale-105 dark:ring-zinc-800"
                    />
                ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent text-sm font-semibold text-white shadow-sm transition-transform group-hover:scale-105">
                        {initials}
                    </div>
                )}
                <div className="min-w-0">
                    <h3 className="truncate font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
                        {user.name || "Anonymous"}
                    </h3>
                    <p className={`mt-0.5 text-xs ${role === "Host" ? "font-medium text-brand dark:text-brand-light" : "text-zinc-400 dark:text-zinc-500"}`}>{role}</p>
                </div>
            </div>

            {/* ── Bio ────────────────────────────────────────── */}
            <div className="flex-1 py-4">
                {user.bio ? (
                    <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {user.bio}
                    </p>
                ) : (
                    <p className="text-sm italic text-zinc-400 dark:text-zinc-500">
                        {firstName} hasn't added a bio yet.
                    </p>
                )}
            </div>

            {/* ── Links footer ───────────────────── */}
            <div className="mt-auto flex flex-wrap items-center gap-1 border-t border-zinc-100/80 pt-4 dark:border-zinc-800/50">
                {user.contactEmail && (
                    <LinkIcon href={`mailto:${user.contactEmail}`} label="Email" hoverClass="hover:bg-brand-pale hover:text-brand">
                        <Mail className="h-4 w-4" />
                    </LinkIcon>
                )}
                {user.phoneNumber && (
                    <LinkIcon href={`tel:${user.phoneNumber}`} label={`Call ${firstName}`} hoverClass="hover:bg-green-50 hover:text-green-600">
                        <Phone className="h-4 w-4" />
                    </LinkIcon>
                )}
                {user.websiteUrl && (
                    <LinkIcon href={user.websiteUrl} label="Website" hoverClass="hover:bg-brand-pale hover:text-brand">
                        <Globe className="h-4 w-4" />
                    </LinkIcon>
                )}
                {user.linkedinUrl && (
                    <LinkIcon href={user.linkedinUrl} label="LinkedIn" hoverClass="hover:bg-blue-50 hover:text-[#0A66C2]">
                        <Linkedin className="h-4 w-4" />
                    </LinkIcon>
                )}
                {user.githubUrl && (
                    <LinkIcon href={user.githubUrl} label="GitHub" hoverClass="hover:bg-zinc-100 hover:text-zinc-800">
                        <Github className="h-4 w-4" />
                    </LinkIcon>
                )}
                {user.instagramUrl && (
                    <LinkIcon href={user.instagramUrl} label="Instagram" hoverClass="hover:bg-pink-50 hover:text-[#E4405F]">
                        <Instagram className="h-4 w-4" />
                    </LinkIcon>
                )}
                {user.youtubeUrl && (
                    <LinkIcon href={user.youtubeUrl} label="YouTube" hoverClass="hover:bg-red-50 hover:text-[#FF0000]">
                        <Youtube className="h-4 w-4" />
                    </LinkIcon>
                )}
                {user.twitterUrl && (
                    <LinkIcon href={user.twitterUrl} label="X / Twitter" hoverClass="hover:bg-zinc-100 hover:text-zinc-900">
                        <Twitter className="h-4 w-4" />
                    </LinkIcon>
                )}
                {!hasAnyLink && (
                    <span className="text-xs text-zinc-400">No links added yet</span>
                )}
            </div>
        </div>
    );
}
