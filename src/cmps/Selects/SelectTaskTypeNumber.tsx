
import { SelectCmpNumber } from "../../cmps/helpers/SelectCmpNumber";
import { SelectDataNumber } from "../../types/commonTypes/commonTypes";

interface SelectTaskTypeNumberProps {
    readonly handleTaskTypeSelect: (value: number) => void;
    readonly selectedValue?: number
    readonly dataToRender: SelectDataNumber[]

}
function SelectTaskTypeNumber({ handleTaskTypeSelect, selectedValue, dataToRender }: SelectTaskTypeNumberProps) {


    const selectTriggerClassName = "W-10"
    return (
        <div className="w-[250px]">
            <SelectCmpNumber handleValueChanged={handleTaskTypeSelect}
                dataToRender={dataToRender}
                selectedValue={selectedValue}
                selectTriggerClassName={selectTriggerClassName}
                selectPlaceholder="Select type"
                selectLabelText="Select type"
                showSelectLabel={true} />

        </div>
    );
}

export default SelectTaskTypeNumber;
