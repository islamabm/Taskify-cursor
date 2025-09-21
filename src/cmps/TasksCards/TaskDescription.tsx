import React from "react";
import { utilService } from "../../services/util.service";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../components/ui/sheet";
import { IconWithTooltip } from "../helpers/IconWithTooltip";

// Import our new components
import { TaskDescriptionList } from "./TaskDescriptionList";
import { TaskDescriptionItem } from "../../types/commonTypes/commonTypes";

interface TaskDescriptionProps {
    readonly task: any; // Replace 'any' with your actual Task type, if available
}

export function TaskDescription({ task }: TaskDescriptionProps) {
    const items: TaskDescriptionItem[] = [
        {
            label: "Business Name",
            value: task.marketName || "N/A",
        },
        {
            label: "Ticket ID",
            value: task.ticketID || "N/A",
        },
        {
            label: "Market ID",
            value: task.market?.HaatBussID || "N/A",
        },
        {
            label: "Employee Name",
            value: task.user?.fullName || "N/A",
        },
        {
            label: "Products no",
            value: task.products?.length || 0,
        },
        {
            label: "Stuck Products no",
            value: task.problemsProducts?.length || 0,
        },
        {
            label: "Duration",
            value: utilService.formatDuration(task.duration) || 0,
        },
        {
            label: "Task Type",
            value: task.ticketType?.ticketType || "N/A",
        },
        {
            label: "Task Status",
            value: task.customStatus?.customStatus || "N/A",
        },
        {
            label: "Department",
            value: task.department?.departmentName || "N/A",
        },
        {
            label: "Priority Level",
            value: task.priorityLevel?.priorityLevel || "N/A",
        },
        {
            label: "Quantity",
            value: task.quantity || "N/A",
        },
        {
            label: "Deadline",
            value: utilService.formatDuration(task.deadline) || 0,
        },
        {
            label: "Created Date",
            value: task.createdDateTime || "N/A",
        },
        {
            label: "Start Date",
            value: task.startDateDisplay || "N/A",
        },
        {
            label: "Finish Date",
            value: task.finishDateDisplay || "N/A",
        },
        {
            label: "DM notes",
            value: task.content || "N/A",
        },
        {
            label: "Employee notes",
            value: task.employeeNotes || "N/A",
        },
        {
            label: "Total task duration",
            value: utilService.formatDuration(task.totalDuration) || 0,
        },
        {
            label: "Is app check",
            value: task.isAppCheck ? (
                <IconWithTooltip iconName="Check" tooltipTitle="Task  app check" />
            ) : (
                <IconWithTooltip iconName="X" tooltipTitle=" Task  not app check" />
            ),
        },
    ];

    // Conditionally add items based on departmentID
    if (task.department?.departmentID === 6) {
        items.push({
            label: "Is tagged",
            value: task.isTagged ? (
                <IconWithTooltip iconName="Check" tooltipTitle="Task is tagged" />
            ) : (
                <IconWithTooltip iconName="X" tooltipTitle="Task is not tagged" />
            ),
        },
            {
                label: "Is categorized",
                value: task.isCategorized ? (
                    <IconWithTooltip iconName="Check" tooltipTitle="Task is categorized" />
                ) : (
                    <IconWithTooltip iconName="X" tooltipTitle="Task is not categorized" />
                ),
            });
    }

    if (task.department?.departmentID === 7) {
        items.push({
            label: "Is message",
            value: task.isMessage ? (
                <IconWithTooltip iconName="Check" tooltipTitle="Task is published" />
            ) : (
                <IconWithTooltip iconName="X" tooltipTitle="Task is not published" />
            ),
        },
            {
                label: "Is published",
                value: task.isPublished ? (
                    <IconWithTooltip iconName="Check" tooltipTitle="Task is published" />
                ) : (
                    <IconWithTooltip iconName="X" tooltipTitle="Task is not published" />
                ),
            });
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <IconWithTooltip iconName="Book" tooltipTitle="Details" />
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Task Details</SheetTitle>
                </SheetHeader>

                <TaskDescriptionList items={items} />
            </SheetContent>
        </Sheet>
    );
}
