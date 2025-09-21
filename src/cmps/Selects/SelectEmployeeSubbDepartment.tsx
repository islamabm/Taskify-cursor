
import { SelectCmp } from "../helpers/SelectCmp";
import { SelectData } from "../../types/commonTypes/commonTypes";

interface SelectEmployeeSubDepartmentProps {
    readonly handleSubDepartmentTypeSelect: (value: string) => void;
    readonly selectedValue?: string
    readonly dataToRender: SelectData[]

}
function SelectEmployeeSubbDepartment({ handleSubDepartmentTypeSelect, selectedValue, dataToRender }: SelectEmployeeSubDepartmentProps) {



    const selectTriggerClassName = "W-10 "
    return (
        <div className="w-[250px]">
            <SelectCmp handleValueChanged={handleSubDepartmentTypeSelect}
                dataToRender={dataToRender}
                selectedValue={selectedValue}
                selectTriggerClassName={selectTriggerClassName}
                selectPlaceholder="Select sub-department"
                selectLabelText="Select sub-department"
                showSelectLabel={true} />

        </div>
    );
}

export default SelectEmployeeSubbDepartment;
