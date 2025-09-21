// src/cmps/tasks/TasksRow.tsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Task } from "../types/commonTypes/commonTypes";
import { TasksCardPreview } from "./TasksCards/TasksCardPreview";
import { useHorizontalCarousel } from "./CustomHooks/useHorizontalCarousel";

type Meta = { Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; color: string; };
type Props = { title: string; tasks: Task[]; meta: Meta; };

export default function TasksRow({ title, tasks, meta }: Props) {
    const {
        containerRef,
        state,
        scrollLeft,
        scrollRight,
        handlePointerDown,
        handlePointerUp,
    } = useHorizontalCarousel(tasks.length, { gap: 16, smoothBehavior: true });

    const { Icon, color } = meta;

    return (
        <section className="relative">
            {/* Header */}
            <div className="mb-3 flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="scroll left"
                    type="button"
                    onClick={scrollLeft}
                    disabled={!state.canScrollLeft}
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <span className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-sm font-medium ${color}`}>
                    <Icon className="h-4 w-4" />
                    <span className="mr-1">{title}</span>
                    <span
                        aria-label={`${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`}
                        className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold leading-none"
                    >
                        {tasks.length}
                    </span>
                </span>


                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="scroll right"
                    type="button"
                    onClick={scrollRight}
                    disabled={!state.canScrollRight}
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            <motion.div
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                className="relative flex overflow-x-auto overflow-y-hidden pb-2 pointer-events-auto scrollbar-none snap-x snap-mandatory gap-4" // ⬅️ add gap here
                style={{ WebkitOverflowScrolling: "touch" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
            >

                {tasks.map((t, i) => (
                    <motion.div
                        key={t.ticketID}
                        data-card
                        className="snap-start shrink-0 w-[60vw] sm:w-[220px]"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ delay: i * 0.02 }}
                    >
                        <TasksCardPreview task={t as any} onStart={() => { }} />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
