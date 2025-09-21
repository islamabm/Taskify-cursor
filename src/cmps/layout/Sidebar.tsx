// src/cmps/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import {
    List,
    Tag,
    CheckSquare,
    User,
    Users,
    UserCheck,
    Flag,
    Building2,
    LayoutDashboard,
    FileBarChart,
    Megaphone,
    PlusSquare,

} from "lucide-react";
import { useMemo } from "react";
import { useSidebar } from "../../contexts/SidebarContext";
import { utilService } from "../../services/util.service";
import { routeService } from "../../services/route.service";
import type { LucideProps } from "lucide-react";
import { LuIdCard } from "react-icons/lu";

type SidebarNavItem = {
    to: string;
    label: string;
    icon: React.ComponentType<LucideProps>;
};

const superAdminNavItems: SidebarNavItem[] = [
    { to: routeService.CREATE, label: "New task", icon: PlusSquare },
    { to: routeService.TASKS, label: "Tasks", icon: List },
    { to: routeService.CAMPAIGNS, label: "Campaigns", icon: Megaphone },
    { to: routeService.TASK_TYPES, label: "Task Types", icon: Tag },
    { to: routeService.TASK_STATUSES, label: "Task Statuses", icon: CheckSquare },
    { to: routeService.TASK_PRIORITY_LEVELS, label: "Task Priority Levels", icon: Flag },
    { to: routeService.USERS, label: "Users", icon: User },
    { to: routeService.USER_TYPES, label: "User Types", icon: Users },
    { to: routeService.USER_STATUSES, label: "User Statuses", icon: UserCheck },
    { to: routeService.DEPARTMENTS, label: "Departments", icon: Building2 },
    { to: routeService.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
    { to: routeService.REPORTS, label: "Reports", icon: FileBarChart },
    // { to: routeService.PROFILE, label: "Profile", icon: LuIdCard },
];


const adminNavItems: SidebarNavItem[] = [
    { to: routeService.CREATE, label: "New task", icon: PlusSquare },
    { to: routeService.TASKS, label: "Tasks", icon: List },
    { to: routeService.CAMPAIGNS, label: "Campaigns", icon: Megaphone },
    // { to: routeService.TASK_TYPES, label: "Task Types", icon: Tag },
    // { to: routeService.TASK_STATUSES, label: "Task Statuses", icon: CheckSquare },
    // { to: routeService.TASK_PRIORITY_LEVELS, label: "Task Priority Levels", icon: Flag },
    // { to: routeService.USERS, label: "Users", icon: User },
    // { to: routeService.USER_TYPES, label: "User Types", icon: Users },
    // { to: routeService.USER_STATUSES, label: "User Statuses", icon: UserCheck },
    // { to: routeService.DEPARTMENTS, label: "Departments", icon: Building2 },
    { to: routeService.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
    { to: routeService.REPORTS, label: "Reports", icon: FileBarChart },
    // { to: routeService.PROFILE, label: "Profile", icon: LuIdCard },
];

const shiftManagerNavItems: SidebarNavItem[] = [
    { to: routeService.CREATE, label: "New task", icon: PlusSquare },

    { to: routeService.TASKS, label: "Tasks", icon: List },
    { to: routeService.CAMPAIGNS, label: "Campaigns", icon: Megaphone },
    { to: routeService.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
    { to: routeService.REPORTS, label: "Reports", icon: FileBarChart },
    // { to: routeService.PROFILE, label: "Profile", icon: LuIdCard },
];

const basicNavItems: SidebarNavItem[] = [
    { to: routeService.TASKS, label: "Tasks", icon: List },
    // { to: routeService.CAMPAIGNS, label: "Campaigns", icon: Megaphone },
    // { to: routeService.PROFILE, label: "Profile", icon: LuIdCard },
];

/** Single, typed, reusable link item */
function SidebarLink({
    to,
    label,
    icon: Icon,
    isCollapsed,
}: SidebarNavItem & { isCollapsed: boolean }) {
    return (
        <NavLink
            to={to}
            className={({
                isActive,
            }: {
                isActive: boolean;
                isPending: boolean;
            }) =>
                [
                    "group relative flex items-center gap-3 rounded-md px-4 py-2 text-sm",
                    isActive
                        ? "bg-white text-[#bf0035] font-semibold"
                        : "text-white hover:bg-[#c7254e] hover:text-[#F7D600]",
                ].join(" ")
            }
            // No need for aria-current: NavLink adds it when active
            end={false}
        >
            <Icon size={20} aria-hidden="true" />
            {!isCollapsed && <span>{label}</span>}

            {isCollapsed && (
                <span
                    role="tooltip"
                    className="
            absolute left-full ml-3 whitespace-nowrap rounded
            bg-black/80 px-2 py-1 text-xs opacity-0
            transition-opacity duration-200
            group-hover:opacity-100
          "
                >
                    {label}
                </span>
            )}
        </NavLink>
    );
}

export default function Sidebar() {
    const { isOpen, isCollapsed, close } = useSidebar();

    // Defensive read (normalize to string code we expect: "1" | "2" | default)
    const rawUserType = utilService.getUserTypeID();
    const userType = typeof rawUserType === "string" ? rawUserType : "";

    const navLinks = useMemo<SidebarNavItem[]>(() => {
        switch (userType) {
            case "3":
                return superAdminNavItems;
            case "4":
                return adminNavItems;
            case "5":
                return shiftManagerNavItems;
            default:
                return basicNavItems;
        }
    }, [userType]);

    return (
        <aside
            className={[
                "fixed inset-y-0 left-0 z-30",
                isCollapsed ? "w-20" : "w-64",
                "bg-[#bf0035] text-white",
                "transition-all duration-300",
                isOpen ? "translate-x-0" : "-translate-x-full",
                "lg:translate-x-0",
            ].join(" ")}
            onClick={close}
        >
            <div className="flex h-full flex-col">
                {/* Header */}
                <header className="flex items-center justify-between px-4 py-4 border-b border-white/20">
                    <NavLink to={routeService.TASKS} className="flex items-center gap-2">
                        <h1
                            className={[
                                "text-xl font-extrabold tracking-wider text-[#F7D600] drop-shadow-md",
                                isCollapsed ? "hidden lg:block" : "",
                            ].join(" ")}
                        >
                            {isCollapsed ? "HT" : "HAAT Taskify"}
                        </h1>
                    </NavLink>
                    {/* (Optional) Add a collapse toggle button here if your SidebarContext exposes it */}
                </header>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-2 mt-2" aria-label="Main Navigation">
                    {navLinks.map(({ to, label, icon }) => (
                        <SidebarLink
                            key={to}
                            to={to}
                            label={label}
                            icon={icon}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </nav>

                {/* Footer */}
                <footer
                    className={[
                        "px-6 pb-6 text-xs text-[#F7D600]/80",
                        isCollapsed ? "text-center px-0" : "",
                    ].join(" ")}
                >
                    © Haat Delivery&nbsp;2025
                </footer>
            </div>
        </aside>
    );
}
