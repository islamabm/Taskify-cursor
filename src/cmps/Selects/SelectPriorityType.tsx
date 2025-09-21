
import { SelectCmp } from "../../cmps/helpers/SelectCmp";

import { SelectData } from "../../types/commonTypes/commonTypes";

interface SelectPriorityProps {
    readonly handlePriorityTypeSelect: (value: string) => void;
    readonly selectedValue?: string
    readonly dataToRender: SelectData[]

}
function SelectPriorityType({ handlePriorityTypeSelect, selectedValue, dataToRender }: SelectPriorityProps) {


    const selectTriggerClassName = "W-10 "
    return (
        <div className="w-[250px]">
            <SelectCmp handleValueChanged={handlePriorityTypeSelect}
                dataToRender={dataToRender}
                selectedValue={selectedValue}
                selectTriggerClassName={selectTriggerClassName}
                selectPlaceholder="Select priority"
                selectLabelText="Select priority"
                showSelectLabel={true} />

        </div>
    );
}

export default SelectPriorityType;
