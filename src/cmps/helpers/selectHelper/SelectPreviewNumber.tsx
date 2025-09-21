import {
    SelectItem,
} from "../../../components/ui/select"
import React from 'react'

interface SelectPreviewNumberProps {
    readonly itemValue: number;
    readonly itemText: string;
}

export function SelectPreviewNumber({ itemValue, itemText }: SelectPreviewNumberProps) {
    return (
        <SelectItem value={itemValue.toString()}>

            {itemText}
        </SelectItem>
    );
}
