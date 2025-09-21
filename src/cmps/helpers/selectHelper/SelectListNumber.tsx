import { SelectDataNumber } from '../../../types/commonTypes/commonTypes';
import React from 'react';
import { SelectPreviewNumber } from './SelectPreviewNumber';

interface SelectListNumberProps {
    readonly dataToRender: SelectDataNumber[];
}

export function SelectListNumber({ dataToRender }: SelectListNumberProps) {
    return (
        <>
            {dataToRender.map((item) => (
                <SelectPreviewNumber
                    key={item.itemText}
                    itemValue={item.itemValue}
                    itemText={item.itemText}
                />
            ))}
        </>
    );
}
