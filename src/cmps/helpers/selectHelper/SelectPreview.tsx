import {
    SelectItem,
} from "../../../components/ui/select"
import React from 'react'

interface SelectPreviewProps {
    readonly itemValue: string;
    readonly itemText: string;
    readonly helpVariable?: number;
}

export function SelectPreview({ itemValue, itemText, helpVariable }: SelectPreviewProps) {
    return (
        <SelectItem
            value={itemValue}
            className={helpVariable === 0 ? "text-red-500 p-0 font-bold" : ""}
        >
            {itemText}
        </SelectItem>
    );
}
