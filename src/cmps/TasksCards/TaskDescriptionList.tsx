// src/cmps/TaskDescriptionList.tsx

import React from "react";
import { TaskDescriptionPreview } from "./TaskDescriptionPreview";
import { TaskDescriptionItem } from "../../types/commonTypes/commonTypes";

interface TaskDescriptionListProps {
    readonly items: TaskDescriptionItem[];
}

export function TaskDescriptionList({ items }: TaskDescriptionListProps) {
    return (
        <div className="flex flex-col gap-2">
            {items.map((item) => (
                <TaskDescriptionPreview
                    key={item.label}
                    label={item.label}
                    value={item.value}
                />
            ))}
        </div>
    );
}




