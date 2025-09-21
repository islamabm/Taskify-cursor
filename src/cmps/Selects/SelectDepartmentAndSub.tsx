
import { GroupedSelectData } from "../../types/commonTypes/commonTypes";
import { MultiSelectCmp } from "../helpers/MultiSelectCmp";

interface SelectDepartmentAndSubProps {
    readonly handleDepartmentChanged: (value: string) => void;
    readonly selectedValue?: string
    readonly dataToRender: GroupedSelectData[]

}
function SelectDepartmentAndSub({ handleDepartmentChanged, selectedValue, dataToRender }: SelectDepartmentAndSubProps) {

    const selectTriggerClassName = "W-10"

    return (
        <div className="w-[250px]">

            <MultiSelectCmp
                handleValueChanged={handleDepartmentChanged}
                selectedValue={selectedValue}
                dataToRender={dataToRender}
                selectTriggerClassName={selectTriggerClassName}
                selectPlaceholder="Select department "
            />
        </div>
    );
}

export default SelectDepartmentAndSub;
