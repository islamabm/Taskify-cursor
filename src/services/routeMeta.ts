// routeMeta.ts
import { Plus, Download } from "lucide-react";
import type { ReactNode } from "react";

export type RouteAction = {
    id: string;
    label: string;
    icon?: React.ComponentType<{ size?: number }>;
    onClick?: () => void;
    to?: string;
    variant?: "primary" | "ghost";
    hotkey?: string;
};

export type RouteMeta = {
    path: string;
    title: string;
    crumb?: string;              // default breadcrumb label
    dynamicCrumb?: (params: Record<string, string>) => Promise<string> | string;
    description?: string;
    actions?: (params: Record<string, string>) => RouteAction[];
    hideBreadcrumb?: boolean;
};

export const routeMeta: RouteMeta[] = [
    {
        path: "/campaigns", title: "Campaigns", crumb: "Campaigns",
        description: "Browse and manage all campaigns",

    },
    {
        path: "/tasks", title: "Tasks", crumb: "Tasks",
        description: "Browse and manage all Tasks",

    },
    { path: "/task/types", title: "Task Types", crumb: "Types" },
    { path: "/task/statuses", title: "Task Statuses", crumb: "Statuses" },
    { path: "/user/statuses", title: "User Statuses", crumb: "Statuses" },
    { path: "/user/types", title: "User Types", crumb: "User Types" },
    { path: "/users", title: "Users", crumb: "Users" },

    {
        path: "/campaign-details/:id",
        title: "Campaign Detail",
        crumb: "Campaign",
        // Example dynamic crumb (fetch name by id)

    },
    { path: "/profile", title: "Profile", crumb: "Profile" },
];
