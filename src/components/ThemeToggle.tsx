"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

type Theme = "system" | "light" | "dark";

function applyTheme(theme: Theme) {
    const isDark =
        theme === "dark" ||
        (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
    const [theme, setTheme] = useState<Theme>("system");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = (localStorage.getItem("theme") as Theme) || "system";
        setTheme(stored);

        // Keep in sync with OS preference changes when on "system" mode
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => {
            if ((localStorage.getItem("theme") || "system") === "system") {
                applyTheme("system");
            }
        };
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    const cycle = () => {
        const order: Theme[] = ["system", "light", "dark"];
        const next = order[(order.indexOf(theme) + 1) % order.length];
        setTheme(next);
        localStorage.setItem("theme", next);
        applyTheme(next);
    };

    if (!mounted) return <div className="h-8 w-8" />;

    const icons: Record<Theme, React.ReactNode> = {
        system: <Monitor className="h-4 w-4" />,
        light: <Sun className="h-4 w-4" />,
        dark: <Moon className="h-4 w-4" />,
    };
    const labels: Record<Theme, string> = {
        system: "System theme",
        light: "Light mode",
        dark: "Dark mode",
    };

    return (
        <button
            onClick={cycle}
            title={labels[theme]}
            aria-label={`Theme: ${labels[theme]}. Click to cycle.`}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 ${className}`}
        >
            {icons[theme]}
        </button>
    );
}
