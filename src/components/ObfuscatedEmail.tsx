"use client";

import { useEffect, useState } from "react";

/**
 * Renders an email address that is assembled client-side from parts,
 * so it never appears in server-rendered HTML or static source code.
 */
export function ObfuscatedEmail({
    className = "",
    linkClassName = "",
    showAsLink = true,
}: {
    className?: string;
    linkClassName?: string;
    showAsLink?: boolean;
}) {
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        // Parts are joined at runtime — never present as a complete string in source
        const p = ["suraj", "\x40", "surajc", "\x2e", "com"];
        setEmail(p.join(""));
    }, []);

    if (!email) return null;

    if (showAsLink) {
        return (
            <a
                href={`mailto:${email}`}
                className={linkClassName || "text-brand hover:underline"}
            >
                {email}
            </a>
        );
    }

    return <span className={className}>{email}</span>;
}
