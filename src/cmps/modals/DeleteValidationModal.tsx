
import { AreYouSureModal } from "../helpers/AreYouSureModal";

interface DeleteValidationModalProps {
    readonly tooltipTitle: string
    readonly alertDialogTitle: string
    readonly whichCmp: string
    readonly usefulVariable: number
    readonly usefulVariable2?: number
    readonly queryOptionalVariable: string
}


export function DeleteValidationModal({ usefulVariable, usefulVariable2, queryOptionalVariable, tooltipTitle, alertDialogTitle, whichCmp }: DeleteValidationModalProps) {
    return (
        <AreYouSureModal
            iconName="Trash"
            tooltipTitle="Delete"
            alertDialogTitle="Are you sure?"
            alertDialogCancelText="Cancel"
            alertDialogActionText="Delete"
            whichCmp={whichCmp}
            usefulVariable={usefulVariable}
            usefulVariable2={usefulVariable2}
            queryOptionalVariable={queryOptionalVariable}
        />
    )
}
