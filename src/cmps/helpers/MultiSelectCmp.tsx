import {
    Select,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { SelectList } from "./selectHelper/SelectList";
import { GroupedSelectData } from "../../types/commonTypes/commonTypes";
import React, { useState, useEffect } from "react";

interface MultiSelectCmpProps {
    readonly handleValueChanged: (value: string) => void;
    readonly selectedValue?: string | null;
    readonly dataToRender: GroupedSelectData[];
    readonly selectTriggerClassName: string;
    readonly selectPlaceholder: string;
}

export function MultiSelectCmp({
    handleValueChanged,
    selectedValue: initialSelectedValue,
    dataToRender,
    selectTriggerClassName,
    selectPlaceholder,
}: MultiSelectCmpProps) {
    const [selectedValue, setSelectedValue] = useState<string | null>(initialSelectedValue ?? null);

    useEffect(() => {
        setSelectedValue(initialSelectedValue ?? null);
    }, [initialSelectedValue]);

    const handleSelectChange = (value: string) => {

        setSelectedValue(value);
        handleValueChanged(value);
    };

    return (
        <Select
            value={selectedValue ?? undefined}
            onValueChange={handleSelectChange}
        >
            <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder={selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
                {dataToRender.map((group) => (
                    <SelectGroup key={group.selectValue}>
                        {/* Add onClick handler for SelectLabel */}
                        <SelectLabel
                            // onClick={() => handleSelectChange(group.departmentID)}
                            className="cursor-pointer"
                        >
                            {group.selectValue}
                        </SelectLabel>
                        <SelectList dataToRender={group.items} />
                    </SelectGroup>
                ))}
            </SelectContent>
        </Select>
    );
}
