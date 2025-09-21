
import { SelectCmp } from "../helpers/SelectCmp";
import { SelectData } from "../../types/commonTypes/commonTypes";

interface SelectEmployeeTypeProps {
    readonly handleEmployeeTypeSelect: (value: string) => void;
    readonly selectedValue?: string
    readonly dataToRender: SelectData[]

}
function SelectEmployeeType({ handleEmployeeTypeSelect, selectedValue, dataToRender }: SelectEmployeeTypeProps) {



    const selectTriggerClassName = "W-10 "
    return (
        <div className="w-[250px]">
            <SelectCmp handleValueChanged={handleEmployeeTypeSelect}
                dataToRender={dataToRender}
                selectedValue={selectedValue}
                selectTriggerClassName={selectTriggerClassName}
                selectPlaceholder="Select employee type"
                selectLabelText="Select employee type"
                showSelectLabel={true} />

        </div>
    );
}

export default SelectEmployeeType;
