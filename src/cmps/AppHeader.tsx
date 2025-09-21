import MobileAppHeader from "./appHeader/MobileAppHeader";
import useResponsiveLayout from "./CustomHooks/useResponsiveLayout";



export function AppHeader() {

    const isMobile = useResponsiveLayout()
    return (
        <>
            {isMobile &&

                <MobileAppHeader />
            }

        </>
    )
}
