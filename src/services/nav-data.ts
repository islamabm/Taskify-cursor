// src/services/nav-config.ts
import {
    PlusSquare,
    List,
    Tag,
    DollarSign,
    CheckSquare,
    UserCheck,
    Users as UsersIcon,
    User,
    Calendar,
} from "lucide-react";
import type { LucideIcon, LucideProps } from "lucide-react";

export type NavItem = {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon | React.ComponentType<LucideProps>;
    section?: string;
};

export type UserType = "3" | "4" | "5" | "6" | "basic";

const ALL_LINKS: readonly NavItem[] = [
    { id: "create", label: "New Task", href: "/create", icon: PlusSquare, section: "Main" },
    { id: "tasks", label: "Tasks", href: "/tasks", icon: List, section: "Main" },
    { id: "task/types", label: "Task Types", href: "/task/types", icon: Tag, section: "Task Config" },
    { id: "task/priority-levels", label: "Task Prices", href: "/task/prices", icon: DollarSign, section: "Task Config" },
    { id: "task/statuses", label: "Task Statuses", href: "/task/statuses", icon: CheckSquare, section: "Task Config" },

    { id: "campaigns", label: "Campaigns", href: "/campaigns", icon: List, section: "Campaigns" },


    { id: "users", label: "Users", href: "/users", icon: User, section: "User Config" },
    { id: "user/types", label: "User Types", href: "/user/types", icon: UsersIcon, section: "User Config" },
    { id: "user/statuses", label: "User Statuses", href: "/user/statuses", icon: UserCheck, section: "User Config" },


    { id: "reports", label: "Reports", href: "/reports", icon: List, section: "Others" },
    { id: "real-time-work", label: "Dashboard", href: "/real-time-work", icon: List, section: "Others" },
    { id: "departments", label: "Departments", href: "/departments", icon: List, section: "Others" },


] as const;

const ROLE_ALLOWLIST: Record<UserType, ReadonlySet<NavItem["id"]>> = {
    "3": new Set(ALL_LINKS.map(l => l.id)),
    "4": new Set(["create", "tasks", "campaigns", "reports", "real-time-work"]),
    "5": new Set(["create", "tasks", "campaigns", "reports", "real-time-work"]),
    "6": new Set(["tasks", "campaigns"]),
    basic: new Set(["create", "campaigns"]),
};

/** Accepts raw string, coerces to known UserType union */
export function navItemsFor(userType: string): NavItem[] {
    const normalized: UserType =
        userType === "3" || userType === "4" || userType === "5" || userType === "6" ? (userType as UserType) : "basic";

    const allowed = ROLE_ALLOWLIST[normalized];
    return ALL_LINKS.filter(item => allowed.has(item.id));
}
