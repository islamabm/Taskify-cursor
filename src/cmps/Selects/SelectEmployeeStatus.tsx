
import { SelectCmp } from "../../cmps/helpers/SelectCmp";
import { SelectData } from "../../types/commonTypes/commonTypes";

interface SelectEmployeeStatusProps {
    readonly handleStatusSelect: (value: string) => void;
    readonly selectedValue?: string
    readonly dataToRender: SelectData[]

}
function SelectEmployeeStatus({ handleStatusSelect, selectedValue, dataToRender }: SelectEmployeeStatusProps) {



    const selectTriggerClassName = "W-10 "
    return (
        <div className="w-[250px]">
            <SelectCmp handleValueChanged={handleStatusSelect}
                dataToRender={dataToRender}
                selectedValue={selectedValue}
                selectTriggerClassName={selectTriggerClassName}
                selectPlaceholder="Select status"
                selectLabelText="Select status"
                showSelectLabel={true} />

        </div>
    );
}

export default SelectEmployeeStatus;
