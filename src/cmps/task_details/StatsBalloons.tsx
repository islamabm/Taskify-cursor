import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

/**
 * StatsBalloons
 * Beautiful, modern, horizontally centered stat "balloons" with a gentle bloom.
 * - Uses Tailwind for styling
 * - Framer Motion for playful, buoyant animations
 * - Accessible and responsive
 *
 * Usage:
 * <StatsBalloons
 *   items={[
 *     { title: "Work duration", number: "03:41:26", color: "#e06666" },
 *     { title: "User",          number: "Jane Doe",  color: "#9fc5e8" },
 *     { title: "Total logs",    number: 12,          color: "#ffe599" },
 *   ]}
 * />
 */

export type StatBubbleItem = {
    title: string;
    number: string | number;
    /** Base color for the balloon's glow/badge */
    color?: string;
};

type Props = {
    items: StatBubbleItem[];
    /** Optional flag to animate numbers from 0 on mount (only for numeric values) */
    countUp?: boolean;
};

const spring = {
    type: "spring",
    stiffness: 140,
    damping: 12,
};

const pulseKeyframes = {
    scale: [1, 1.04, 1],
    filter: ["brightness(1) saturate(1)", "brightness(1.1) saturate(1.2)", "brightness(1) saturate(1)"],
};

/**
 * Small internal helper that animates a number up from 0 using framer-motion.
 */
function AnimatedNumber({ value }: { value: number }) {
    const mv = useMotionValue(0);
    const rounded = useTransform(mv, latest => Math.round(latest));

    React.useEffect(() => {
        const controls = animate(mv, value, { duration: 1.0, ease: "easeOut" });
        return controls.stop;
    }, [value]);

    return (
        <motion.span aria-live="polite">
            {rounded}
        </motion.span>
    );
}

function Balloon({ item, index, countUp }: { item: StatBubbleItem; index: number; countUp?: boolean }) {
    const { title, number, color = "#8b5cf6" } = item; // default violet

    // Derived glow color
    const glow = `0 0 60px ${color}55, 0 0 24px ${color}88`;
    const ring = color;

    const isNumeric = typeof number === "number";

    return (
        <motion.div
            role="group"
            aria-label={`${title}: ${number}`}
            initial={{ y: 24, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ ...spring, delay: index * 0.08 }}
            className="relative flex items-center justify-center"
        >
            {/* Soft background halo */}
            <div
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full blur-2xl opacity-70"
                style={{ boxShadow: glow }}
            />

            {/* Balloon */}
            <motion.div
                className="relative h-44 w-44 sm:h-48 sm:w-48 md:h-56 md:w-56 rounded-full select-none
                   bg-gradient-to-br from-white/90 to-white/70 dark:from-zinc-900/80 dark:to-zinc-800/60
                   shadow-xl ring-2 backdrop-blur-md"
                style={{ ringColor: ring as any }}
                animate={pulseKeyframes}
                transition={{ repeat: Infinity, repeatDelay: 2.2, duration: 2.2, ease: "easeInOut", delay: index * 0.25 }}
            >
                {/* Inner content */}
                <div className="absolute inset-0 grid place-items-center text-center">
                    <div className="flex flex-col items-center gap-2 px-4">
                        {/* Title badge */}
                        <span
                            className="text-[11px] sm:text-xs uppercase tracking-wide font-medium px-3 py-1 rounded-full
                         bg-white/70 dark:bg-zinc-900/70 shadow ring-1 ring-black/5"
                            style={{ backgroundColor: `${color}22` }}
                        >
                            {title}
                        </span>

                        {/* Number */}
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums">
                            {isNumeric && countUp ? <AnimatedNumber value={number as number} /> : <span>{number}</span>}
                        </div>
                    </div>
                </div>

                {/* Subtle glossy highlight */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-2 left-6 h-20 w-20 rounded-full opacity-60"
                    style={{
                        background: "radial-gradient(closest-side, rgba(255,255,255,0.9), rgba(255,255,255,0))",
                        filter: "blur(6px)",
                    }}
                />
            </motion.div>
        </motion.div>
    );
}

export default function StatsBalloons({ items, countUp = true }: Props) {
    // Ensure we always render exactly three spots (fill with empties if needed)
    const visible = items.slice(0, 3);
    while (visible.length < 3) visible.push({ title: "—", number: "—" });

    return (
        // <section
        //     aria-label="Key statistics"
        //     className="w-full py-8 sm:py-10 md:py-12"
        // >
        //     <div className="mx-auto max-w-6xl px-3 sm:px-6">
        //         {/* Decorative background */}
        //         <div className="relative isolate overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10
        //                 bg-gradient-to-br from-violet-100/60 via-white/60 to-sky-100/60
        //                 dark:from-violet-950/30 dark:via-zinc-900/20 dark:to-sky-950/30 ring-1 ring-black/5">
        //             <div
        //                 aria-hidden
        //                 className="pointer-events-none absolute inset-0 -z-10"
        //                 style={{
        //                     background: "radial-gradient(1000px 400px at 50% -40%, rgba(139,92,246,0.25), transparent), radial-gradient(800px 320px at 50% 140%, rgba(56,189,248,0.20), transparent)",
        //                 }}
        //             />

        //             {/* Row of balloons */}
        //             <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-12">
        //                 {visible.map((item, i) => (
        //                     <Balloon key={i} item={{ ...item, color: item.color }} index={i} countUp={countUp} />
        //                 ))}
        //             </div>


        //         </div>
        //     </div>
        // </section>
        <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-12">
            {visible.map((item, i) => (
                <Balloon key={i} item={{ ...item, color: item.color }} index={i} countUp={countUp} />
            ))}
        </div>
    );
}
