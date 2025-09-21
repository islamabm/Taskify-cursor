
import { SelectDataNumber } from "../../types/commonTypes/commonTypes";
import { SelectCmpNumber } from "../helpers/SelectCmpNumber";

interface SelectEmployeeNumberProps {
    readonly handleEmployeeSelect: (value: number) => void;
    readonly selectedValue?: number
    readonly dataToRender: SelectDataNumber[]

}
function SelectEmployeeNumber({ handleEmployeeSelect, selectedValue, dataToRender }: SelectEmployeeNumberProps) {


    const selectTriggerClassName = "W-10 "
    return (
        <div className="w-[250px]">
            <SelectCmpNumber handleValueChanged={handleEmployeeSelect}
                dataToRender={dataToRender}
                selectedValue={selectedValue}
                selectTriggerClassName={selectTriggerClassName}
                selectPlaceholder="Select employee"
                selectLabelText="Select employee"
                showSelectLabel={true} />

        </div>
    );
}

export default SelectEmployeeNumber;
