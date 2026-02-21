"use client";

import { useMemo } from "react";

/**
 * Pure-CSS animated sparkles, stars, and floating orbs.
 * Uses regular DOM elements (no canvas) — guaranteed visible.
 */

interface Sparkle {
    id: number;
    left: string;
    top: string;
    size: number;
    delay: string;
    duration: string;
    driftDuration: string;
    type: "dot" | "star" | "cross" | "ring";
    color: string;
}

const COLORS = [
    "rgba(37, 99, 235, 0.7)",   // brand blue
    "rgba(79, 70, 229, 0.65)",  // indigo
    "rgba(124, 58, 237, 0.6)",  // violet
    "rgba(99, 102, 241, 0.6)",  // soft indigo
    "rgba(59, 130, 246, 0.65)", // sky blue
    "rgba(139, 92, 246, 0.55)", // purple
];

function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export default function HeroParticles() {
    const sparkles = useMemo<Sparkle[]>(() => {
        const items: Sparkle[] = [];
        const types: Sparkle["type"][] = ["dot", "dot", "dot", "star", "star", "cross", "ring"];
        for (let i = 0; i < 60; i++) {
            const r = (s: number) => seededRandom(i * 7 + s);
            items.push({
                id: i,
                left: `${r(1) * 100}%`,
                top: `${r(2) * 100}%`,
                size: 3 + r(3) * 10,
                delay: `${r(4) * -20}s`,
                duration: `${3 + r(5) * 5}s`,
                driftDuration: `${8 + r(8) * 14}s`,
                type: types[Math.floor(r(6) * types.length)],
                color: COLORS[Math.floor(r(7) * COLORS.length)],
            });
        }
        return items;
    }, []);

    return (
        <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{ zIndex: 1 }}
            aria-hidden="true"
        >
            {sparkles.map(s => (
                <span
                    key={s.id}
                    className={`sparkle sparkle-${s.type}`}
                    style={{
                        position: "absolute",
                        left: s.left,
                        top: s.top,
                        "--sparkle-size": `${s.size}px`,
                        "--sparkle-color": s.color,
                        "--sparkle-delay": s.delay,
                        "--sparkle-duration": s.duration,
                        "--sparkle-drift": s.driftDuration,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
}
