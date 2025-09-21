
import { SelectData } from "../../types/commonTypes/commonTypes";
import { SelectCmp } from "../helpers/SelectCmp";

interface SelectStatusTypeProps {
    readonly handleStatusTypeChanged: (value: string) => void;
    readonly selectedValue?: string
    readonly dataToRender: SelectData[]

}
function SelectStatusType({ handleStatusTypeChanged, selectedValue, dataToRender }: SelectStatusTypeProps) {

    const selectTriggerClassName = "W-10 "

    return (
        <div className="w-[250px]">
            <SelectCmp handleValueChanged={handleStatusTypeChanged}
                dataToRender={dataToRender}
                selectedValue={selectedValue}
                selectTriggerClassName={selectTriggerClassName}
                selectPlaceholder="Select type"
                selectLabelText="Select type"
                showSelectLabel={true} />

        </div>
    );
}

export default SelectStatusType;
