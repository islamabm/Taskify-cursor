import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// ---- External services from your app ----
import { toastService } from "../../services/toast.service";
import ToastComponent from "../helpers/ToastComponent";
import { productsService } from "../../services/products.service";
import { queryKeysService } from "../../services/queryKeys.service";
import { IconWithTooltip } from "../helpers/IconWithTooltip";
// ⚠️ Headless UI removed — this modal is dependency‑light (Tailwind + Framer Motion only)
// -------------------------------------------------------------------------------
// Icons (lucide-react style). Swap with real lucide-react if you prefer.
const Icon = ({ name, className }: { name: string; className?: string }) => {
    const paths: Record<string, JSX.Element> = {
        Note: (
            <path d="M9 9h6m-6 4h6M4 7a3 3 0 013-3h6.586a2 2 0 011.414.586l2.414 2.414A2 2 0 0118 8.414V19a3 3 0 01-3 3H7a3 3 0 01-3-3V7z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ),
        X: (
            <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ),
        Sparkles: (
            <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3zm7 9l1 2.5 2.5 1-2.5 1L19 19l-1-2.5-2.5-1 2.5-1L19 12zm-14 0l1 2.5 2.5 1-2.5 1L5 19l-1-2.5-2.5-1 2.5-1L5 12z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ),
        Check: (
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ),
    };
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
            {paths[name]}
        </svg>
    );
};



// ---------- Validation schema ----------
const formSchema = z.object({
    userNote: z.string().trim().min(1, "Please write a note"),
    productID: z.number().min(1, "Invalid productID"),
    ticketID: z.coerce.number().min(1, "Invalid ticketID"),
});

// ---------- Props ----------
interface WriteNoteToProductProps {
    readonly productID: number;
    readonly ticketID: number;
    readonly trigger?: React.ReactNode; // Custom trigger (button/icon). If omitted, a default FAB is shown.
    readonly maxChars?: number; // Character cap for the note (UI-only)
    readonly defaultOpen?: boolean;
    readonly onSuccess?: () => void; // Optional callback after success
}

// ---------- Helper: autosize textarea ----------
function useAutosizeTextArea(textAreaRef: HTMLTextAreaElement | null, value: string) {
    useEffect(() => {
        if (!textAreaRef) return;
        textAreaRef.style.height = "0px";
        const scrollHeight = textAreaRef.scrollHeight;
        textAreaRef.style.height = scrollHeight + "px";
    }, [textAreaRef, value]);
}

// ---------- Helper: focus trap ----------
function useFocusTrap(enabled: boolean, containerRef: React.RefObject<HTMLElement>) {
    useEffect(() => {
        if (!enabled) return;
        const container = containerRef.current;
        if (!container) return;

        const getFocusable = () =>
            Array.from(container.querySelectorAll<HTMLElement>(
                'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
            )).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));

        const focusables = getFocusable();
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        const previouslyFocused = document.activeElement as HTMLElement | null;
        first?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                (container as any)._onRequestClose?.();
            }
            if (e.key !== "Tab") return;
            if (focusables.length === 0) return;
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first?.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            previouslyFocused?.focus();
        };
    }, [enabled, containerRef]);
}

export function WriteNoteToProduct({
    productID,
    ticketID,
    trigger,
    maxChars = 600,
    defaultOpen = false,
    onSuccess,
}: WriteNoteToProductProps) {
    const [open, setOpen] = useState(defaultOpen);
    const [userNote, setUserNote] = useState("");
    const [errorText, setErrorText] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: "success" | "destructive";
        title: string;
        description: string;
    } | null>(null);

    const dialogRef = useRef<HTMLDivElement | null>(null);
    useFocusTrap(open, dialogRef);

    const textRef = useRef<HTMLTextAreaElement | null>(null);
    useAutosizeTextArea(textRef.current, userNote);

    const remaining = useMemo(() => maxChars - userNote.length, [maxChars, userNote.length]);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const productData = {
                customStatus: { customStatusID: 19 },
                employeeNotes: userNote.trim(),
            } as const;
            return productsService.updateProduct(productID, productData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.MARKET_PRODUCTS, ticketID.toString()] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, ticketID.toString()] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.MARKET_PRODUCTS, queryKeysService.PROBLEM_PRODUCTS, ticketID.toString()] });
            toastService.showToast(setToastProps, "Product updated successfully!", "success");
            onSuccess?.();
        },
        onError: () => {
            toastService.showToast(
                setToastProps,
                "Error occurred while saving the note. Please try again.",
                "destructive"
            );
        },
        onSettled: () => {
            setIsSaving(false);
            setOpen(false);
        },
    });

    const validate = () => {
        try {
            formSchema.parse({ userNote, productID, ticketID });
            setErrorText(null);
            return true;
        } catch (err) {
            if (err instanceof z.ZodError) {
                const msg = err.errors.map((e) => e.message).join(", ");
                setErrorText(msg);
            }
            return false;
        }
    };

    const handleSubmit = () => {
        if (!validate()) return;
        setIsSaving(true);
        mutation.mutate();
    };

    // Keyboard shortcut: ⌘/Ctrl + Enter to Save
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            const isMetaEnter = (e.metaKey || e.ctrlKey) && e.key === "Enter";
            if (isMetaEnter) {
                e.preventDefault();
                handleSubmit();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, userNote]);

    // Close handler for focus trap
    useEffect(() => {
        if (!dialogRef.current) return;
        (dialogRef.current as any)._onRequestClose = () => setOpen(false);
    }, [dialogRef, setOpen]);

    const DefaultTrigger = (
        <button
            type="button"
            onClick={() => setOpen(true)}
            // className="group fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-600 p-[2px] shadow-2xl transition-all hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-300/40"
            aria-label="Add note"
        >
            <span
            // className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-3 text-sm font-medium text-slate-900 backdrop-blur-md transition-all group-hover:bg-white"
            >
                <Icon name="Note" className="h-7 w-7" />

            </span>
        </button>
    );

    return (
        <>
            {trigger ? <span onClick={() => setOpen(true)}>{trigger}</span> : DefaultTrigger}

            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="note-modal-title">
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />

                        {/* Panel */}
                        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6 md:p-8">
                            <div className="flex min-h-full items-center justify-center">
                                <motion.div
                                    ref={dialogRef}
                                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 24, scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                                    className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-white/70 p-0 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl dark:bg-slate-900/70"
                                >
                                    {/* Gradient top bar */}
                                    {/* <div className="relative overflow-hidden rounded-t-3xl">
                                        <div className="h-2 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500" />
                                        <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-fuchsia-400/20 blur-2xl" />
                                        <div className="absolute -left-12 -bottom-12 h-28 w-28 rounded-full bg-indigo-400/20 blur-2xl" />
                                    </div> */}

                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4 p-6">
                                        <div className="flex items-center gap-3">
                                            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white shadow-lg">
                                                <Icon name="Sparkles" className="h-5 w-5" />
                                            </span>
                                            <div>
                                                <h2 id="note-modal-title" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                                                    Add internal note
                                                </h2>
                                                <p className="mt-0.5 text-xs text-slate-600/80 dark:text-slate-300/80">
                                                    Product ID: <span className="font-medium">{productID}</span> • Ticket: <span className="font-medium">{ticketID}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setOpen(false)}
                                            className="group rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-200/60 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/40 dark:hover:bg-white/10 dark:text-slate-300"
                                            aria-label="Close"
                                        >
                                            <Icon name="X" className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Body */}
                                    <div className="px-6 pb-6">
                                        {/* Textarea with floating label */}
                                        <div className="relative">
                                            <textarea
                                                ref={textRef}
                                                rows={4}
                                                value={userNote}
                                                onChange={(e) => {
                                                    const next = e.target.value;
                                                    if (next.length <= maxChars) setUserNote(next);
                                                }}
                                                id="note"
                                                placeholder=" "
                                                className="peer block w-full resize-none rounded-2xl border border-slate-300/60 bg-white/70 px-4 pb-10 pt-6 text-sm text-slate-900 shadow-inner outline-none ring-0 transition focus:border-violet-400 focus:bg-white focus:shadow-lg dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-violet-400"
                                                autoFocus
                                            />
                                            <label
                                                htmlFor="note"
                                                className="pointer-events-none absolute left-3.5 top-3 z-10 origin-left -translate-y-1.5 scale-90 bg-white/80 px-2 text-[11px] font-medium text-slate-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:bg-transparent peer-focus:top-3 peer-focus:-translate-y-1.5 peer-focus:scale-90 peer-focus:bg-white/80 dark:text-slate-300"
                                            >
                                                Note (internal)
                                            </label>

                                            {/* Footer inside textarea box */}
                                            <div className="pointer-events-none absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-500">
                                                <span className={"inline-flex items-center gap-1 " + (errorText ? "text-rose-600" : "text-slate-500")}>{errorText ?? "Press ⌘/Ctrl + Enter to save"}</span>
                                                <span className={"font-medium " + (remaining < 0 ? "text-rose-600" : remaining <= 50 ? "text-amber-600" : "text-slate-500")}>{remaining}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setOpen(false)}
                                                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300/70 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300/50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={isSaving || userNote.trim().length === 0}
                                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-600 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition enabled:hover:translate-y-[-1px] enabled:hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-300/40 disabled:opacity-60"
                                            >
                                                {isSaving ? (
                                                    <motion.span
                                                        className="inline-block h-4 w-4 rounded-full border-2 border-white/60 border-t-transparent"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
                                                        aria-hidden
                                                    />
                                                ) : (
                                                    <Icon name="Check" className="h-4 w-4" />
                                                )}
                                                {isSaving ? "Saving..." : "Save note"}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {toastProps && (
                <ToastComponent
                    key={toastProps.key}
                    variant={toastProps.variant}
                    title={toastProps.title}
                    description={toastProps.description}
                />
            )}
        </>
    );
}

// ------------------ Usage Example ------------------
// <WriteNoteToProductModern productID={productID} ticketID={ticketID} />
// Or provide a custom trigger:
// <WriteNoteToProduct