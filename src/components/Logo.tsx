export function LogoIcon({
    size = 32,
    className = "",
}: {
    size?: number;
    className?: string;
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Profile Hub logo"
        >
            <rect width="36" height="36" rx="9" fill="#238df3" />
            {/* Connection lines */}
            <line x1="18" y1="18" x2="10" y2="11" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" strokeLinecap="round" />
            <line x1="18" y1="18" x2="26" y2="11" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" strokeLinecap="round" />
            <line x1="18" y1="18" x2="10" y2="25" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" strokeLinecap="round" />
            <line x1="18" y1="18" x2="26" y2="25" stroke="white" strokeWidth="1.5" strokeOpacity="0.45" strokeLinecap="round" />
            {/* Central hub node */}
            <circle cx="18" cy="18" r="3.5" fill="white" />
            {/* Profile nodes */}
            <circle cx="10" cy="11" r="2.5" fill="white" fillOpacity="0.8" />
            <circle cx="26" cy="11" r="2.5" fill="white" fillOpacity="0.8" />
            <circle cx="10" cy="25" r="2.5" fill="white" fillOpacity="0.8" />
            <circle cx="26" cy="25" r="2.5" fill="white" fillOpacity="0.8" />
        </svg>
    );
}

export function Logo({
    className = "",
    showText = true,
}: {
    className?: string;
    showText?: boolean;
}) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <LogoIcon size={28} />
            {showText && (
                <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Profile Hub
                </span>
            )}
        </div>
    );
}
