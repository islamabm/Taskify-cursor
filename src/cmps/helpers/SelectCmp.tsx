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
import { SelectData } from "../../types/commonTypes/commonTypes";

interface SelectCmpProps {
    readonly handleValueChanged: (value: string) => void;
    readonly selectedValue?: string | null,
    readonly dataToRender: SelectData[],
    readonly selectTriggerClassName: string,
    readonly selectPlaceholder: string,
    readonly showSelectLabel?: boolean,
    readonly selectLabelText?: string


}


export function SelectCmp({ handleValueChanged, selectedValue, dataToRender, selectTriggerClassName, selectPlaceholder, showSelectLabel, selectLabelText }: SelectCmpProps) {
    return (
        <Select
            value={selectedValue ?? undefined}
            onValueChange={(value) => {
                const adjustedValue = value;
                handleValueChanged(adjustedValue);
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
