// src/cmps/tasks/TasksBoard.tsx
import React from "react";
import { motion } from "framer-motion";
import TasksRow from "./TasksRow";

import { Clock3, PlayCircle, PauseCircle, CheckCircle2, XCircle } from "lucide-react";
import { Task } from "../types/commonTypes/commonTypes";
import { TasksCardList } from "./TasksCards/TasksCardList";
import TasksDataGrid from "./tables/TasksDataGrid";
// import TasksTable from "./tables/TasksTable";


export type StatusMeta = {
    label: string;
    color: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const TASK_STATUS_META: Record<number, StatusMeta> = {
    8: { label: "Not started", color: "bg-gray-500", Icon: Clock3 },
    9: { label: "In progress", color: "bg-blue-600", Icon: PlayCircle },
    11: { label: "Paused", color: "bg-yellow-500", Icon: PauseCircle },
    10: { label: "Completed", color: "bg-green-600", Icon: CheckCircle2 },
    12: { label: "Cancelled", color: "bg-red-600", Icon: XCircle },
};

const STATUS_ORDER = [9, 11, 8, 10, 12] as const;

export type Row = {
    id: number;
    label: string;
    items: Task[];
    meta: StatusMeta;
};

interface TasksBoardProps {
    readonly tasks: Task[];
    readonly rows: Row[];
    readonly viewMode: "status" | "cards" | "table";
    readonly onStart: (taskId: number, userId: number) => void;
}

export default function TasksBoard({ tasks, rows, viewMode, onStart }: TasksBoardProps) {
    if (viewMode === "status") {
        return (
            <motion.div initial="hidden" animate="visible" className="space-y-10">
                {rows.map((r) => (
                    <div key={r.id}>
                        {/* Proxy onStart into each card by wrapping card component */}
                        <TasksRow
                            title={r.label}
                            tasks={r.items.map(t => ({ ...t, __onStart__: onStart } as any))}
                            meta={r.meta}
                        />
                    </div>
                ))}
            </motion.div>
        );
    }

    if (viewMode === "cards") {
        // Keep your current grid experience
        return <TasksCardList tasks={tasks as any[]} onStart={onStart} />;
    }

    // Table view
    return (
        // <TasksTable tasks={tasks} />
        <TasksDataGrid tasks={tasks} />
    );
}

// Helper to compute rows from a plain list of tasks
export function buildTaskRows(tasks: Task[]): Row[] {
    const byStatus = new Map<number, Task[]>();

    for (const t of tasks) {
        const id = t.customStatus?.customStatusID;
        if (!id) continue;
        if (!byStatus.has(id)) byStatus.set(id, []);
        byStatus.get(id)!.push(t);
    }

    return STATUS_ORDER
        .map((id) => {
            const items = byStatus.get(id) ?? [];
            if (!items.length) return null;
            const meta = TASK_STATUS_META[id];
            const label = meta?.label ?? `Status ${id}`;
            return { id, label, items, meta };
        })
        .filter(Boolean) as Row[];
}
