
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "../components/ui/sheet"
import { useState } from "react"
import { routeService } from "../services/route.service";
import { ModeToggle } from "./helpers/ModeToggle";
import BtnsList from "./helpers/btns/BtnsList";
import { IconWithTooltip } from "./helpers/IconWithTooltip";
import { LogoutValidationModal } from "./modals/LogoutValidationModal";
export function MobileNavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const userTypeID = localStorage.getItem('USERTYPEID_TASKIFY')?.replace(/^"|"$/g, '');

    function closeMobileNavBar() {
        setIsOpen(false);
    }


    let linksArr
    if (userTypeID === "7") {
        linksArr = [{ domName: "Dashboard", routeName: routeService.DASHBOARD }];
    } else if (userTypeID === "6") {
        linksArr = [{ domName: "Tasks", routeName: routeService.TASKS }];
    } else if (userTypeID === "3") {
        linksArr = [
            { domName: "Tasks", routeName: routeService.TASKS },
            { domName: "Dashboard", routeName: routeService.DASHBOARD },
            { domName: "Reports", routeName: routeService.LOGS },
            { domName: "Statistics", routeName: routeService.STATISTICS },
        ];
    }
    else if (userTypeID === "5" || userTypeID === "4") {
        linksArr = [
            { domName: "Tasks", routeName: routeService.TASKS },
            { domName: "Dashboard", routeName: routeService.DASHBOARD },
            { domName: "Reports", routeName: routeService.LOGS }
        ];
    } // if none of the specific conditions match, it will default to showing all

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <IconWithTooltip iconName="Menu" tooltipTitle="Menu" />
            </SheetTrigger>
            <SheetContent>
                <div className="flex flex-col items-start gap-4">
                    <BtnsList btnsArr={linksArr || []} divClassName="flex flex-col items-start gap-4" closeNavBar={closeMobileNavBar} />
                    <ModeToggle />
                    <LogoutValidationModal />
                </div>
            </SheetContent>
        </Sheet>
    )
}
