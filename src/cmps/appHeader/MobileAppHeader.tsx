import { memo } from "react";
import { cn } from "../../lib/utils";
import { AppHeaderLogo } from "./AppHeaderLogo";
import MobileNavDrawer from "./MobileNavDrawer";

type MobileAppHeaderProps = {
    className?: string;
    "aria-label"?: string;
};

const MobileAppHeader = memo(function MobileAppHeader({
    className,
    "aria-label": ariaLabel = "Application header",
}: MobileAppHeaderProps) {
    return (
        <header
            role="banner"
            aria-label={ariaLabel}
            className={cn(
                "fixed top-0 inset-x-0 z-20",
                "flex items-center justify-between",
                "px-4 py-3 pt-[env(safe-area-inset-top)]",
                "bg-gradient-to-r from-[#ff5c5c] to-[#b91c1c] text-white shadow-lg",
                className
            )}
        >
            <AppHeaderLogo data-testid="app-header-logo" />
            <MobileNavDrawer /* ensure trigger has aria-label inside */ />
        </header>
    );
});

export default MobileAppHeader;
