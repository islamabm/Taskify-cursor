
import { SelectCmp } from "../../cmps/helpers/SelectCmp";
import { SelectData } from "../../types/commonTypes/commonTypes";

interface SelectEmployeeDepartmentProps {
    readonly handleDepartmentTypeSelect: (value: string) => void;
    readonly selectedValue?: string
    readonly dataToRender: SelectData[]

}
function SelectEmployeeDepartment({ handleDepartmentTypeSelect, selectedValue, dataToRender }: SelectEmployeeDepartmentProps) {

    const selectTriggerClassName = "W-10 "
    return (
        <div className="w-[250px]">
            <SelectCmp handleValueChanged={handleDepartmentTypeSelect}
                dataToRender={dataToRender}
                selectedValue={selectedValue}
                selectTriggerClassName={selectTriggerClassName}
                selectPlaceholder="Select department"
                selectLabelText="Select department"
                showSelectLabel={true} />

        </div>
    );
}

export default SelectEmployeeDepartment;
