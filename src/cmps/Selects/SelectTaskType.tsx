
import { SelectCmp } from "../../cmps/helpers/SelectCmp";
import { SelectData } from "../../types/commonTypes/commonTypes";

interface SelectTaskTypeProps {
    readonly handleTaskTypeSelect: (value: string) => void;
    readonly selectedValue?: string | number
    readonly dataToRender: SelectData[]

}
function SelectTaskType({ handleTaskTypeSelect, selectedValue, dataToRender }: SelectTaskTypeProps) {


    const selectTriggerClassName = "W-10"
    return (
        <div className="w-[250px]">
            <SelectCmp handleValueChanged={handleTaskTypeSelect}
                dataToRender={dataToRender}
                selectedValue={selectedValue}
                selectTriggerClassName={selectTriggerClassName}
                selectPlaceholder="Select type"
                selectLabelText="Select type"
                showSelectLabel={true} />

        </div>
    );
}

export default SelectTaskType;
