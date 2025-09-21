import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import { Menu } from "lucide-react"
import { utilService } from "../../services/util.service"
import { navItemsFor } from "../../services/nav-data"

export default function MobileNavDrawer() {
    const userType = utilService.getUserTypeID()
    const navItems = navItemsFor(userType)

    return (
        <Sheet>
            {/* trigger = hamburger icon */}
            <SheetTrigger asChild>
                <button
                    aria-label="Open navigation"
                    className="p-2 rounded-lg hover:bg-white/10 active:bg-white/20
                     focus:outline-none focus:ring-2 focus:ring-offset-2
                     focus:ring-white lg:hidden">
                    <Menu size={24} />
                </button>
            </SheetTrigger>

            {/* drawer itself */}
            <SheetContent
                side="left"
                className="w-72 p-0 border-0
                   bg-gradient-to-b from-[#ff5c5c] to-[#b91c1c]
                   text-white overflow-y-auto">
                <nav aria-label="Primary" className="pt-10 pb-24 mt-[50px]">
                    {navItems.length === 0 ? (
                        <p className="px-6 py-3 opacity-80">No navigation available.</p>
                    ) : navItems.map(({ label, icon: Icon, href, section }, idx) => {
                        const showHeader = idx === 0 || navItems[idx - 1]?.section !== section;
                        return (
                            <div key={href}>
                                {showHeader && section && (
                                    <p className="px-6 mt-6 mb-2 text-xs font-semibold tracking-widest uppercase opacity-70">{section}</p>
                                )}
                                <SheetClose asChild>
                                    <a href={href} className="flex items-center gap-3 px-6 py-3 hover:bg-white/10 active:bg-white/15 ">
                                        <Icon size={18} />
                                        <span className="text-base">{label}</span>
                                    </a>
                                </SheetClose>
                            </div>
                        );
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    )
}
