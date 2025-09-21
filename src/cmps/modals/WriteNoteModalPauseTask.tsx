import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Pause, X, Loader2, Info, Sparkles } from "lucide-react";

// === External helpers/services from your app ===
import { toastService } from "../../services/toast.service";
import { logsService } from "../../services/logs.service";
import { queryKeysService } from "../../services/queryKeys.service";
import ToastComponent from "../helpers/ToastComponent";

// === Types ===
const formSchema = z.object({
    userNote: z.string().min(1, "Please write a note"),
    ticketID: z.number().nonnegative("Invalid Ticket ID."),
    userID: z.number().nonnegative("Invalid User ID."),
    workLogID: z.number().nonnegative("Invalid Work Log ID."),
});

interface PauseTaskModalProps {
    readonly ticketID: number;
    readonly userID: number;
    readonly workLogID: number;
    readonly endType?: string; // e.g., "pause" | "end"
}

// === Small UI atoms (no external UI kit) ===
const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    className = "",
    children,
    ...props
}) => (
    <button
        {...props}
        className={
            "inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-sm text-black shadow-sm backdrop-blur transition active:scale-[0.98] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 " +
            className
        }
    >
        {children}
    </button>
);

const PrimaryButton: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }
> = ({ className = "", children, loading, disabled, ...props }) => (
    <button
        {...props}
        disabled={disabled || loading}
        className={
            "group relative inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-tr from-sky-500 to-violet-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-sky-900/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-60 " +
            className
        }
    >
        <span className="absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.4),rgba(255,255,255,0))] opacity-0 transition group-hover:opacity-100" />
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {children}
    </button>
);

const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    className = "",
    children,
    ...props
}) => (
    <button
        {...props}
        className={
            "inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 shadow-sm backdrop-blur transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400 " +
            className
        }
    >
        {children}
    </button>
);

// Auto-resizing textarea (no dep)
const AutoGrowTextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className = "", onChange, ...props }, ref) => {
        const innerRef = useRef<HTMLTextAreaElement | null>(null);

        const setRefs = useCallback(
            (node: HTMLTextAreaElement) => {
                innerRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
            },
            [ref]
        );

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const el = innerRef.current;
            if (el) {
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
            }
            onChange?.(e);
        };

        useEffect(() => {
            const el = innerRef.current;
            if (!el) return;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
        }, []);

        return (
            <textarea
                {...props}
                ref={setRefs}
                onChange={handleChange}
                className={
                    "min-h-[96px] w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 placeholder:text-white/50 shadow-inner outline-none backdrop-blur focus-visible:ring-2 focus-visible:ring-sky-400 " +
                    className
                }
            />
        );
    }
);
AutoGrowTextArea.displayName = "AutoGrowTextArea";

// === Main Component ===
export const WriteNoteModalPauseTask: React.FC<PauseTaskModalProps> = ({
    ticketID,
    userID,
    workLogID,
    endType = "pause",
}) => {
    const [open, setOpen] = useState(false);
    const [userNote, setUserNote] = useState("");
    const [isUpdatingTask, setIsUpdatingTask] = useState(false);
    const [toastProps, setToastProps] = useState<
        | {
            key: number;
            variant: "success" | "destructive";
            title: string;
            description: string;
        }
        | null
    >(null);

    const queryClient = useQueryClient();

    const pauseTaskMutation = useMutation({
        mutationFn: () => {
            const logData = {
                ticket: { ticketID },
                user: { userID },
                type: endType === "pause" ? "pause" : "update",
                notes: userNote,
            } as const;
            return logsService.editLog(logData as any, workLogID);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TASKS] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, String(ticketID)] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, ticketID] });

            queryClient.invalidateQueries({ queryKey: [queryKeysService.WORK_LOGS_BY_TICKET_ID, String(ticketID)] });

            toastService.showToast(
                setToastProps,
                "Task paused successfully!",
                "success"
            );
        },
        onError: (error: any) => {
            console.error("Error pausing task:", error);
            const message = error?.message || "An unexpected error occurred. Please try again.";
            toastService.showToast(setToastProps, `Error: ${message}`, "destructive");
        },
        onSettled: () => {
            setIsUpdatingTask(false);
            setOpen(false);
        },
    });

    // Derived state for UX
    const charCount = userNote.length;
    const isNoteTooLong = charCount > 1000;
    const canSubmit = charCount > 0 && !isNoteTooLong && !isUpdatingTask;

    // Keyboard shortcuts
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
                e.preventDefault();
                if (canSubmit) handleSubmit();
            }
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, canSubmit]);

    // Submit logic with validation
    const handleSubmit = useCallback(async () => {
        try {
            formSchema.parse({ userNote, workLogID, userID, ticketID });
            setIsUpdatingTask(true);
            pauseTaskMutation.mutate();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map((err) => err.message).join(", ");
                toastService.showToast(setToastProps, errorMessages, "destructive");
            }
        }
    }, [userNote, workLogID, userID, ticketID]);

    // Portal root (falls back to body)
    const portalRoot = useMemo(() => document.getElementById("modal-root") ?? document.body, []);

    return (
        <>
            {/* Trigger */}
            <IconButton onClick={() => setOpen(true)} aria-label="Pause task">
                <Pause className="h-5 w-5 " />
            </IconButton>

            {/* Toasts */}
            {toastProps && (
                <ToastComponent
                    key={toastProps.key}
                    variant={toastProps.variant}
                    title={toastProps.title}
                    description={toastProps.description}
                />
            )}

            {createPortal(
                <AnimatePresence>
                    {open && (
                        <>
                            {/* Dim / blur overlay */}
                            <motion.div
                                key="overlay"
                                className="fixed inset-0 z-[60] bg-[rgba(8,10,16,0.6)] backdrop-blur-md"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                onClick={() => setOpen(false)}
                                aria-hidden
                            />

                            {/* Modal card */}
                            <motion.div
                                key="modal"
                                role="dialog"
                                aria-modal="true"
                                aria-label="Add note to pause task"
                                className="fixed inset-0 z-[70] grid place-items-center p-4 sm:p-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 p-0 shadow-2xl shadow-black/50 ring-1 ring-white/10"
                                    initial={{ y: 24, scale: 0.96 }}
                                    animate={{ y: 0, scale: 1 }}
                                    exit={{ y: 12, scale: 0.98, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                                >
                                    {/* Decorative top glow */}
                                    <div className="pointer-events-none absolute -inset-x-20 -top-20 h-40 bg-[radial-gradient(80%_60%_at_50%_-20%,rgba(56,189,248,0.35),rgba(139,92,246,0.2),transparent)]" />

                                    {/* Header */}
                                    <div className="relative flex items-center justify-between px-6 pb-3 pt-5 sm:px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white">
                                                <Pause className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-white">
                                                    {endType === "pause" ? "Pause Task" : "Update Work Log"}
                                                </h2>
                                                <p className="text-xs text-white/60">Ticket #{ticketID} • User {userID}</p>
                                            </div>
                                        </div>

                                        <IconButton aria-label="Close" onClick={() => setOpen(false)}>
                                            <X className="h-5 w-5" />
                                        </IconButton>
                                    </div>

                                    {/* Content */}
                                    <div className="relative px-6 pb-2 sm:px-8">
                                        {/* Tip banner */}
                                        <div className="mb-3 flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white/80">
                                            <Info className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
                                            <p>
                                                Keep it clear: explain why you’re pausing and what’s needed to resume. <span className="opacity-70">Tip: Press</span> <kbd className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px]">Cmd</kbd> + <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">Enter</kbd> to submit.
                                            </p>
                                        </div>

                                        <label htmlFor="pause-note" className="mb-2 block text-sm font-medium text-white">
                                            Note <span className="text-pink-300">*</span>
                                        </label>

                                        <AutoGrowTextArea
                                            id="pause-note"
                                            placeholder="Enter a concise note…"
                                            value={userNote}
                                            onChange={(e) => setUserNote(e.target.value)}
                                            maxLength={1200}
                                        />

                                        {/* Char counter */}
                                        <div className="mt-1.5 flex items-center justify-between text-[11px] text-white/60">
                                            <div className="inline-flex items-center gap-1">
                                                <Sparkles className="h-3.5 w-3.5" />
                                                <span>Write what blocked you and next steps.</span>
                                            </div>
                                            <span className={isNoteTooLong ? "text-rose-300" : ""}>
                                                {charCount}/1000
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="relative mt-4 flex flex-col gap-2 px-6 pb-6 sm:flex-row sm:justify-end sm:gap-3 sm:px-8">
                                        <SecondaryButton onClick={() => setOpen(false)}>Cancel</SecondaryButton>
                                        <PrimaryButton onClick={handleSubmit} loading={isUpdatingTask} disabled={!canSubmit}>
                                            {endType === "pause" ? "Pause task" : "Save note"}
                                        </PrimaryButton>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                portalRoot
            )}
        </>
    );
};

// === Example usage ===
// <UltraModernPauseTaskModal ticketID={123} userID={45} workLogID={678} endType="pause" />

export default WriteNoteModalPauseTask;