
import { AreYouSureModal } from "../helpers/AreYouSureModal";

export function LogoutValidationModal() {
    return (

        <AreYouSureModal
            iconName="LogOut"
            tooltipTitle="Logout"
            alertDialogTitle="Are you sure?"
            alertDialogCancelText="Cancel"
            alertDialogActionText="Logout"
            usefulVariable={55}
            queryOptionalVariable="logout"
            whichCmp="logout"
        />
    )
}
