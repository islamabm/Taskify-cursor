"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../../components/ui/navigation-menu"
import { routeService } from "../../services/route.service"
import { useNavigate } from "react-router-dom"

// Define arrays for each user type condition
const fullComponents = [
    {
        title: "Priority Levels",
        href: routeService.TASKPRIORITYLEVELS
    },
    {
        title: "Task types",
        href: routeService.TASKTYPE
    },
    {
        title: "Departments",
        href: routeService.DEPARTMENTS
    },
    {
        title: "Task statuses",
        href: routeService.STATUSESTASK
    },
    {
        title: "User statuses",
        href: routeService.STATUSESEMPLOYEE
    },
    {
        title: "Users",
        href: routeService.EMPLOYEES
    },
    {
        title: "User types",
        href: routeService.EMPLOYEESTYPES
    },
    {
        title: "Businesses",
        href: routeService.BUSINESSES
    },
]



export function ManageTaskTypeAndPriority() {
    const navigate = useNavigate()

    // Retrieve userID as in your AppHeaderLinks component
    const userTypeID = localStorage.getItem('USERTYPEID_TASKIFY')?.replace(/^"|"$/g, '') || '';

    let componentsToRender: { title: string; href: string }[] = [];

    if (userTypeID === "3") {
        // Show all the links
        componentsToRender = fullComponents;
    }
    // else if (userTypeID === "" || userTypeID === "5") {
    //     // Show only the limited array (Task statuses)
    //     componentsToRender = limitedComponents;
    // }
    else {
        // Show nothing - componentsToRender remains empty
    }

    // If there's nothing to show, you can also choose to return null or a fallback
    if (componentsToRender.length === 0) {
        return null;
    }

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Management</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] ">
                            {componentsToRender.map((component) => (
                                <ListItem
                                    onClick={() => navigate(component.href)}
                                    key={component.title}
                                    title={component.title}
                                >
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
