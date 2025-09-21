// src/cmps/TaskDescriptionPreview.tsx

import React, { ReactNode } from "react";

interface TaskDescriptionPreviewProps {
    readonly label: string;
    readonly value: ReactNode;
}

export function TaskDescriptionPreview({
    label,
    value,
}: TaskDescriptionPreviewProps) {
    return (
        <p>
            <strong>{label}:</strong> {value}
        </p>
    );
}
