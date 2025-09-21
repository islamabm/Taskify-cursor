
import { SelectCmp } from "../../cmps/helpers/SelectCmp";
import { SelectData } from "../../types/commonTypes/commonTypes";

interface SelectEmployeeNameProps {
    readonly handleEmployeeSelect: (value: string) => void;
    readonly selectedValue?: string
    readonly dataToRender: SelectData[]

}
function SelectEmployeeName({ handleEmployeeSelect, selectedValue, dataToRender }: SelectEmployeeNameProps) {


    const selectTriggerClassName = "W-10 "
    return (
        <div className="w-[250px]">
            <SelectCmp handleValueChanged={handleEmployeeSelect}
                dataToRender={dataToRender}
                selectedValue={selectedValue}
                selectTriggerClassName={selectTriggerClassName}
                selectPlaceholder="Select employee"
                selectLabelText="Select employee"
                showSelectLabel={true} />

        </div>
    );
}

export default SelectEmployeeName;
