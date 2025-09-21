import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select"
import { SelectList } from "./selectHelper/SelectList";
import { SelectDataNumber } from "../../types/commonTypes/commonTypes";

interface SelectCmpNumberProps {
    readonly handleValueChanged: (value: number) => void;
    readonly selectedValue?: number | null,
    readonly dataToRender: SelectDataNumber[],
    readonly selectTriggerClassName: string,
    readonly selectPlaceholder: string,
    readonly showSelectLabel?: boolean,
    readonly selectLabelText?: string


}


export function SelectCmpNumber({ handleValueChanged, selectedValue, dataToRender, selectTriggerClassName, selectPlaceholder, showSelectLabel, selectLabelText }: SelectCmpNumberProps) {
    return (
        <Select
            value={selectedValue ?? undefined}
            onValueChange={(value) => {
                const adjustedValue = value;
                handleValueChanged(+adjustedValue);
            }}>
            <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder={selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {showSelectLabel && <SelectLabel>{selectLabelText}</SelectLabel>}
                    <SelectList dataToRender={dataToRender} />
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
