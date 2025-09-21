import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
    X,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Download,
    Maximize2,
    Minimize2,
    Loader2
} from "lucide-react";

/**
 * Ultra-Modern Image Lightbox Modal
 * - Beautiful fade + scale animations via Framer Motion
 * - Fully responsive (mobile-first), supports any image size (object-contain)
 * - Toolbar: zoom in/out, fit/actual, rotate, download, close
 * - Drag to pan when zoomed in
 * - ESC to close, click backdrop to close
 * - Focus handling + body scroll lock while open
 *
 * Tailwind required. Works great with shadcn/ui design language but no dependency.
 */

interface ImageLightboxModalProps {
    imageUrl: string;
    alt?: string;
    caption?: string;
    onClose: () => void;
    allowDownload?: boolean;
}

export default function ImageLightboxModal({
    imageUrl,
    alt = "Preview image",
    caption,
    onClose,
    allowDownload = true,
}: ImageLightboxModalProps) {
    const [isClient, setIsClient] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);

    // Zoom & transform state
    const [zoom, setZoom] = useState(1); // 1 = fit/contain
    const [rotation, setRotation] = useState(0);
    const [fitToScreen, setFitToScreen] = useState(true);

    // Panning
    const containerRef = useRef<HTMLDivElement | null>(null);
    const imgWrapperRef = useRef<HTMLDivElement | null>(null);
    const isPanning = useRef(false);
    const lastPointer = useRef<{ x: number; y: number } | null>(null);

    // Motion values for smooth panning when zoomed
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Body scroll lock while modal open
    useEffect(() => {
        setIsClient(true);
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, []);

    // ESC to close
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "0") {
                e.preventDefault();
                resetView();
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "+") {
                e.preventDefault();
                zoomIn();
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === "-" || e.key === "_")) {
                e.preventDefault();
                zoomOut();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const resetView = () => {
        setZoom(1);
        setRotation(0);
        setFitToScreen(true);
        x.set(0);
        y.set(0);
    };

    const zoomIn = () => setZoom((z) => Math.min(5, (Math.round(z * 10) + 2) / 10)); // +0.2
    const zoomOut = () => setZoom((z) => Math.max(0.2, (Math.round(z * 10) - 2) / 10)); // -0.2

    const toggleFit = () => {
        if (fitToScreen) {
            setFitToScreen(false);
            setZoom(1.5);
        } else {
            setFitToScreen(true);
            setZoom(1);
            x.set(0);
            y.set(0);
        }
    };

    // Backdrop click to close (but ignore when clicking inside content)
    const onBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    // Wheel to zoom (desktop)
    const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
        if (!loaded) return;
        if (e.ctrlKey) return; // let browser-level zoom work
        if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // scrolling horizontally – ignore

        if (e.deltaY > 0) zoomOut();
        else zoomIn();
    };

    // Pointer-based panning when zoomed
    const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
        if (zoom <= 1) return;
        isPanning.current = true;
        lastPointer.current = { x: e.clientX, y: e.clientY };
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    };

    const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
        if (!isPanning.current || !lastPointer.current) return;
        const dx = e.clientX - lastPointer.current.x;
        const dy = e.clientY - lastPointer.current.y;
        x.set(x.get() + dx);
        y.set(y.get() + dy);
        lastPointer.current = { x: e.clientX, y: e.clientY };
    };

    const endPan: React.PointerEventHandler<HTMLDivElement> = (e) => {
        isPanning.current = false;
        lastPointer.current = null;
        try { (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId); } catch { }
    };

    const download = useCallback(() => {
        const a = document.createElement("a");
        a.href = imageUrl;
        a.download = imageUrl.split("/").pop() || "image";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }, [imageUrl]);

    const content = (
        <AnimatePresence>
            <motion.div
                key="backdrop"
                className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
                onClick={onBackdropClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-hidden
            />

            <motion.div
                key="dialog"
                role="dialog"
                aria-modal="true"
                aria-label={alt}
                className="fixed inset-0 z-[101] flex items-center justify-center p-2 sm:p-6"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
                <div
                    ref={containerRef}
                    className="relative w-full max-w-6xl h-[88vh] rounded-2xl bg-neutral-900/80 border border-white/10 shadow-2xl overflow-hidden"
                    onWheel={onWheel}
                >
                    {/* Toolbar */}
                    <div className="absolute left-0 right-0 top-0 z-[102] flex items-center justify-between gap-2 p-2 sm:p-3 bg-gradient-to-b from-black/60 to-transparent">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <IconButton label="Close" onClick={onClose}>
                                <X className="h-5 w-5" />
                            </IconButton>
                        </div>

                        {/* <div className="flex items-center gap-1 sm:gap-2 rounded-full bg-black/30 px-1 sm:px-2 py-1 border border-white/10">
                            <IconButton label="Zoom out (Ctrl/Cmd -)" onClick={zoomOut} disabled={zoom <= 0.21}>
                                <ZoomOut className="h-5 w-5" />
                            </IconButton>
                            <span className="mx-1 hidden text-xs font-medium text-white/80 sm:block w-12 text-center">
                                {Math.round(zoom * 100)}%
                            </span>
                            <IconButton label="Zoom in (Ctrl/Cmd +)" onClick={zoomIn} disabled={zoom >= 4.99}>
                                <ZoomIn className="h-5 w-5" />
                            </IconButton>
                            <div className="mx-1 h-5 w-px bg-white/20" />
                            <IconButton label={fitToScreen ? "Actual size" : "Fit to screen"} onClick={toggleFit}>
                                {fitToScreen ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
                            </IconButton>
                            <IconButton label="Reset view (Ctrl/Cmd 0)" onClick={resetView}>
                                <RotateCcw className="h-5 w-5" />
                            </IconButton>
                            {allowDownload && (
                                <IconButton label="Download" onClick={download}>
                                    <Download className="h-5 w-5" />
                                </IconButton>
                            )}
                        </div> */}
                    </div>

                    {/* Image stage */}
                    <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-6 select-none">
                        <motion.div
                            ref={imgWrapperRef}
                            className="relative max-w-full max-h-full w-full h-full flex items-center justify-center"
                            style={{
                                cursor: zoom > 1 ? "grab" : "default",
                            }}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={endPan}
                            onPointerCancel={endPan}
                            onDoubleClick={toggleFit}
                        >
                            <motion.img
                                key={imageUrl}
                                src={imageUrl}
                                alt={alt}
                                onLoad={() => setLoaded(true)}
                                onError={() => setErrored(true)}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.25 }}
                                className={[
                                    "block",
                                    "object-contain",
                                    "max-w-full",
                                    "max-h-full",
                                    "rounded-xl",
                                    loaded ? "shadow-2xl" : "",
                                ].join(" ")}
                                style={{
                                    transformOrigin: "center center",
                                    rotate: `${rotation}deg`,
                                    scale: fitToScreen ? 1 : zoom,
                                    // When zoomed, translate with framer-motion values
                                    x: fitToScreen ? 0 : (zoom > 1 ? (x as any) : 0),
                                    y: fitToScreen ? 0 : (zoom > 1 ? (y as any) : 0),
                                } as any}
                                draggable={false}
                            />

                            {/* Loading / Error states */}
                            {!loaded && !errored && (
                                <div className="absolute inset-0 grid place-items-center">
                                    <div className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-2 text-white">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm">Loading image…</span>
                                    </div>
                                </div>
                            )}
                            {errored && (
                                <div className="absolute inset-0 grid place-items-center">
                                    <div className="rounded-xl border border-white/10 bg-red-500/10 px-4 py-3 text-center text-white">
                                        <p className="font-medium">Couldn’t load this image.</p>
                                        <p className="text-xs text-white/80">Check the URL or try again.</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Caption */}
                    {(caption || errored) && (
                        <div className="absolute bottom-0 left-0 right-0 z-[102] px-3 sm:px-6 py-3 bg-gradient-to-t from-black/70 to-transparent">
                            {caption && (
                                <p className="text-sm text-white/90 line-clamp-2">{caption}</p>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );

    if (!isClient) return null; // prevent SSR hydration mismatch
    return createPortal(content, document.body);
}

function IconButton({
    children,
    onClick,
    label,
    disabled,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    label: string;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 active:scale-95 disabled:opacity-40 disabled:hover:bg-white/5 h-9 w-9 transition"
            title={label}
        >
            {children}
        </button>
    );
}
