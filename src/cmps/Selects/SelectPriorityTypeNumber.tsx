
import { SelectCmpNumber } from "../../cmps/helpers/SelectCmpNumber";

import { SelectDataNumber } from "../../types/commonTypes/commonTypes";

interface SelectPriorityTypeNumberProps {
    readonly handlePriorityTypeSelect: (value: number) => void;
    readonly selectedValue?: number
    readonly dataToRender: SelectDataNumber[]

}
function SelectPriorityTypeNumber({ handlePriorityTypeSelect, selectedValue, dataToRender }: SelectPriorityTypeNumberProps) {


    const selectTriggerClassName = "W-10 "
    return (
        <div className="w-[250px]">
            <SelectCmpNumber handleValueChanged={handlePriorityTypeSelect}
                dataToRender={dataToRender}
                selectedValue={selectedValue}
                selectTriggerClassName={selectTriggerClassName}
                selectPlaceholder="Select priority"
                selectLabelText="Select priority"
                showSelectLabel={true} />

        </div>
    );
}

export default SelectPriorityTypeNumber;
