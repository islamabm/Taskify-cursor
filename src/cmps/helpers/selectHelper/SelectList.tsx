import { SelectData } from '../../../types/commonTypes/commonTypes';
import React from 'react';
import { SelectPreview } from './SelectPreview';

interface SelectListProps {
    readonly dataToRender: SelectData[];
}

export function SelectList({ dataToRender }: SelectListProps) {
    return (
        <>
            {dataToRender.map((item) => (
                <SelectPreview
                    key={item.itemText}
                    itemValue={item.itemValue}
                    itemText={item.itemText}
                    helpVariable={item.helpVariable}
                />
            ))}
        </>
    );
}
