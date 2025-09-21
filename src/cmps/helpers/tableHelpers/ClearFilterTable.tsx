import React from 'react'
import { IconWithTooltip } from '../IconWithTooltip';

interface ClearFilterTableProps {
    readonly onClick: () => void;
}
export function ClearFilterTable({ onClick }: ClearFilterTableProps) {
    return (
        <IconWithTooltip iconName="Eraser" tooltipTitle='Clear Filter' onClick={onClick} />
    )
}
