import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
    CheckCircle2,
    XCircle,
    Loader2,
    CircleDot,
    ShieldCheck,
    Tag,
    Hash,
    MessageSquare,
    CheckCheck,
    LayoutPanelTop,
    Send,
    X,
} from "lucide-react";
import { toastService } from "../../services/toast.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logsService } from "../../services/logs.service";
import { queryKeysService } from "../../services/queryKeys.service";
import ToastComponent from "../helpers/ToastComponent";

export type Product = {
    customStatus?: { customStatusID: number } | null;
};

interface WriteNoteModalEndTaskProps {
    readonly ticketID: number;
    readonly userID: number;
    readonly workLogID: number;
    readonly ticketTypeID: number;
    readonly departmentID: number;
    readonly endType: string;
    readonly isPublished: boolean;
    readonly isMessage: boolean;
    readonly isTagged: boolean;
    readonly isCategorized: boolean;
    readonly isAppCheck: boolean;
    readonly products: Product[];
    onSubmit?: (payload: { notes: string }) => Promise<void> | void;
    onOpenChange?: (open: boolean) => void;
}

const formSchema = z.object({
    userNote: z
        .string()
        .trim()
        .min(1, "Please write a note")
        .max(2000, "Note too long (max 2000 chars)")
});

function classNames(...cls: Array<string | false | null | undefined>) {
    return cls.filter(Boolean).join(" ");
}

function evaluateEligibility(params: {
    departmentID: number;
    isPublished: boolean;
    isMessage: boolean;
    isTagged: boolean;
    isCategorized: boolean;
    isAppCheck: boolean;
    ticketTypeID: number;
    products: Product[];
}) {
    const {
        departmentID,
        isPublished,
        isMessage,
        isTagged,
        isCategorized,
        isAppCheck,
        ticketTypeID,
        products,
    } = params;

    // const hasPendingProducts = products.some(
    //     (p) => p.customStatus?.customStatusID === 20
    // );

    const rules = [
        {
            key: "dep7_pub_msg_app",
            ok: departmentID !== 7 || (isPublished && isMessage && isAppCheck),
            label: departmentID === 7
                ? "Dept 7: Published, Messaged, App Checked & No Pending Products"
                : "Dept 7-specific checks not required",
            icon: <LayoutPanelTop className="h-4 w-4" />,
        },
        {
            key: "dep6_app",
            ok: departmentID !== 6 || isAppCheck,
            label: departmentID === 6
                ? "Dept 6: App Check is true"
                : "Dept 6-specific check not required",
            icon: <ShieldCheck className="h-4 w-4" />,
        },
        {
            key: "ticket_tag_cat",
            ok: !(ticketTypeID === 5 || ticketTypeID === 38) || (isTagged && isCategorized),
            label: (ticketTypeID === 5 || ticketTypeID === 38)
                ? "Ticket type requires Tagged & Categorized"
                : "Tag/Categorize requirement not applicable",
            icon: <Tag className="h-4 w-4" />,
        },
    ];

    const allOk = rules.every((r) => r.ok);
    return { allOk, rules } as const;
}

export function WriteNoteModalEndTask(props: WriteNoteModalEndTaskProps) {
    const {
        ticketID,
        userID,
        workLogID,
        ticketTypeID,
        departmentID,
        endType,
        isPublished,
        isMessage,
        isTagged,
        isCategorized,
        isAppCheck,
        products,
        onSubmit,
        onOpenChange,
    } = props;

    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [userNote, setUserNote] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [toastProps, setToastProps] = useState<
        | {
            key: number;
            variant: "success" | "destructive";
            title: string;
            description: string;
        }
        | null
    >(null);
    const { rules, allOk } = useMemo(
        () => evaluateEligibility({
            departmentID,
            isPublished,
            isMessage,
            isTagged,
            isCategorized,
            isAppCheck,
            ticketTypeID,
            products,
        }),
        [departmentID, isPublished, isMessage, isTagged, isCategorized, isAppCheck, ticketTypeID, products]
    );

    const handleOpen = () => {
        setOpen(true);
        onOpenChange?.(true);
    };
    const handleClose = () => {
        setOpen(false);
        onOpenChange?.(false);
    };
    const queryClient = useQueryClient();

    const endTaskMutation = useMutation({
        mutationFn: () => {
            const logData = {
                ticket: { ticketID },
                user: { userID },
                type: "end",
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
                "Task ended successfully!",
                "success"
            );
        },
        onError: (error: any) => {
            console.error("Error ending task:", error);
            const message = error?.message || "An unexpected error occurred. Please try again.";
            toastService.showToast(setToastProps, `Error: ${message}`, "destructive");
        },
        onSettled: () => {
            setSubmitting(false);
            setOpen(false);
        },
    });


    const handleSubmit = useCallback(async () => {
        try {
            if ((departmentID === 7) && (!isPublished || !isMessage || !isAppCheck)) {
                toastService.showToast(setToastProps, 'Task cannot be ended. Both "isPublished" , "isMessage" and "isAppCheck" must be true. Make sure to check both boxes before ending the task by clicking the edit icon.', 'destructive');
                return;
            }
            if (products.some(product => product.customStatus?.customStatusID === 20) && departmentID === 7) {
                toastService.showToast(setToastProps, 'Task cannot be ended. There are products with "Pending" status. Make sure to change the status of the products before ending the task', 'destructive');
                return;

            } if ((departmentID === 6) && (!isAppCheck)) {
                toastService.showToast(setToastProps, 'Task cannot be ended. "isAppCheck" must be true. Make sure to check both boxes before ending the task by clicking the edit icon.', 'destructive');
                return;

            } if ((ticketTypeID === 5 || ticketTypeID === 38) && (!isCategorized || !isTagged)) {
                toastService.showToast(setToastProps, 'Task cannot be ended. Both "isCategorized" , "isTagged" must be true. Make sure to check both boxes before ending the task by clicking the edit icon.', 'destructive');
                return;

            }
            formSchema.parse({ userNote });
            setSubmitting(true);
            endTaskMutation.mutate();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map((err) => err.message).join(", ");
                toastService.showToast(setToastProps, errorMessages, "destructive");
            }
        }
    }, [userNote, workLogID, userID, ticketID]);



    // const handleSubmit = async () => {
    //     try {
    //         setError(null);
    //         formSchema.parse({ userNote });
    //         if (!allOk) {
    //             setError("Task cannot be ended until all the required checks are satisfied.");
    //             return;
    //         }
    //         setSubmitting(true);
    //         await onSubmit?.({ notes: userNote });
    //         setSubmitting(false);
    //         setUserNote("");
    //         handleClose();
    //     } catch (err: any) {
    //         setSubmitting(false);
    //         if (err instanceof z.ZodError) {
    //             setError(err.errors.map(e => e.message).join("\n"));
    //             return;
    //         }
    //         setError("Something went wrong. Please try again.");
    //     }
    // };

    return (
        <div className="relative">
            <button
                onClick={handleOpen}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
            >
                <CircleDot className="h-4 w-4" />

            </button>
            {toastProps && (
                <ToastComponent
                    key={toastProps.key}
                    variant={toastProps.variant}
                    title={toastProps.title}
                    description={toastProps.description}
                />
            )}

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-neutral-950/40 backdrop-blur-md"
                            onClick={handleClose}
                        />

                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="end-task-title"
                            className="relative z-10 max-h-[90vh] w-[min(100%,_880px)] overflow-hidden rounded-3xl border border-white/10 bg-white/90 shadow-2xl backdrop-blur-xl md:grid md:grid-cols-[340px_1fr]"
                            initial={{ y: 30, scale: 0.96, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: 20, scale: 0.98, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 24 }}
                        >
                            <div className="hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 p-6 text-white md:flex md:flex-col">
                                <h2 id="end-task-title" className="text-xl font-semibold">End Task</h2>
                                <div className="mt-6 space-y-3">
                                    {rules.map((r) => (
                                        <div
                                            key={r.key}
                                            className={classNames(
                                                "flex items-start gap-3 rounded-2xl border p-3",
                                                r.ok ? "border-white/10 bg-white/5" : "border-rose-400/30 bg-rose-400/10"
                                            )}
                                        >
                                            {r.ok ? (
                                                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-rose-300" />
                                            )}
                                            <span>{r.label}</span>
                                        </div>
                                    ))}

                                    {/* {hasPendingProducts && (
                                        <div className="mt-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-amber-100">
                                            There are products with Pending status.
                                        </div>
                                    )} */}
                                </div>
                            </div>

                            <div className="relative flex flex-col p-6 md:p-8">
                                <button
                                    onClick={handleClose}
                                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200/80 bg-white/70 text-neutral-700 shadow-sm backdrop-blur"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <label htmlFor="note" className="mb-1 block text-sm font-medium text-neutral-700">
                                    Note <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    id="note"
                                    value={userNote}
                                    onChange={(e) => setUserNote(e.target.value)}
                                    placeholder="Write a clear, concise closing note…"
                                    className="h-36 w-full resize-none rounded-2xl border border-neutral-200 px-4 py-3 text-[15px] text-neutral-800 outline-none placeholder:text-neutral-400 md:h-48"
                                />
                                {error && (
                                    <div className="mt-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                                        {error}
                                    </div>
                                )}

                                <div className="mt-6 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="h-11 rounded-2xl border border-neutral-200 bg-white/80 px-4 text-sm font-medium text-neutral-800 shadow-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className={classNames(
                                            "h-11 rounded-2xl px-4 text-sm font-semibold text-white",
                                            submitting
                                                ? "bg-neutral-900/70"
                                                : allOk
                                                    ? "bg-neutral-900"
                                                    : "bg-neutral-400 cursor-not-allowed"
                                        )}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" /> Updating…
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" /> End Task
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
