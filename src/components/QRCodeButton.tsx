"use client";

import { useState, useEffect, useRef } from "react";
import { QrCode, X, Download, Check } from "lucide-react";
import QRCodeLib from "qrcode";

interface QRCodeButtonProps {
    url: string;
    name: string;
    size?: "sm" | "md";
    /** Plaintext event password — only pass for the group creator */
    password?: string | null;
}

export default function QRCodeButton({ url, name, size = "md", password }: QRCodeButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dataUrl, setDataUrl] = useState<string>("");
    const [downloaded, setDownloaded] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && url) {
            QRCodeLib.toDataURL(url, {
                width: 280,
                margin: 2,
                color: { dark: "#18181B", light: "#FFFFFF" },
                errorCorrectionLevel: "M",
            })
                .then(setDataUrl)
                .catch(console.error);
        }
    }, [isOpen, url]);

    const handleDownload = () => {
        if (!dataUrl) return;
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${name.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
        link.click();
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 2000);
    };

    const buttonClass =
        size === "sm"
            ? "inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            : "inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800";

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={buttonClass}
                aria-label="Show QR code"
            >
                <QrCode className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
                QR Code
            </button>

            {isOpen && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
                    onClick={(e) => e.target === overlayRef.current && setIsOpen(false)}
                >
                    <div className="w-full max-w-xs rounded-3xl border border-zinc-100 bg-white p-8 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
                        {/* Header */}
                        <div className="mb-5 flex items-start justify-between">
                            <div>
                                <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">{name}</h2>
                                <p className="text-sm text-zinc-400 dark:text-zinc-500">Scan to open this group</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* QR Code */}
                        <div className="mb-3 flex justify-center rounded-2xl border border-zinc-100 bg-white p-3 dark:border-zinc-700">
                            {dataUrl ? (
                                <img
                                    src={dataUrl}
                                    alt={`QR code for ${name}`}
                                    className="rounded-xl"
                                    width={220}
                                    height={220}
                                />
                            ) : (
                                <div className="h-[220px] w-[220px] animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                            )}
                        </div>

                        {/* URL */}
                        <p className="mb-3 break-all text-center font-mono text-xs text-zinc-400">
                            {url}
                        </p>

                        {/* Password (only shown to creator) */}
                        {password && (
                            <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-brand-pale px-4 py-2.5 dark:border-brand-dark dark:bg-brand-dark/20 text-brand dark:text-brand-light">
                                <span className="text-xs font-medium">Password:</span>
                                <span className="font-mono text-sm font-bold tracking-wide">
                                    {password}
                                </span>
                            </div>
                        )}

                        {/* Download */}
                        <button
                            onClick={handleDownload}
                            disabled={!dataUrl}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-medium text-white transition-all hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {downloaded ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                            {downloaded ? "Downloaded!" : "Download PNG"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
