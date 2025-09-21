import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { IconWithTooltip } from "../helpers/IconWithTooltip";
import { ButtonComponent } from "../helpers/ButtonComponent";
import { toastService } from "../../services/toast.service";
import ToastComponent from "../helpers/ToastComponent";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { EditWorkLogModalState } from "../../types/commonTypes/commonTypes";
import { z } from "zod";
import { departmentsService } from "../../services/departments.service";
import { queryKeysService } from "../../services/queryKeys.service";
import { useSearchParams } from "react-router-dom";
import { logsService } from "../../services/logs.service";

interface EditWorkLogModalProps {
    readonly workLogData: EditWorkLogModalState;
}

// Utility function to convert from "DD/MM/YYYY HH:MM" to "YYYY-MM-DDTHH:MM"
function convertToDateTimeLocalFormat(dateTime: string): string {
    if (!dateTime) return ""; // Handle undefined or empty input

    const [datePart, timePart] = dateTime.split(" ");
    if (!datePart || !timePart) return ""; // Handle invalid format

    const [day, month, year] = datePart.split("/");
    if (!day || !month || !year) return ""; // Handle invalid date

    const [hours, minutes] = timePart.split(":");
    if (!hours || !minutes) return ""; // Handle invalid time

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Utility function to convert from "YYYY-MM-DDTHH:MM" to "DD/MM/YYYY HH:MM"
function convertToDisplayFormat(dateTime: string): string {
    if (!dateTime) return ""; // Handle undefined or empty input
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return ""; // Handle invalid date

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}


function convertToAPIDateTimeFormat(dateTime: string): string {
    if (!dateTime) return ""; // Handle undefined or empty input

    const [datePart, timePart] = dateTime.split(" ");
    if (!datePart || !timePart) return ""; // Handle invalid format

    const [day, month, year] = datePart.split("/");
    if (!day || !month || !year) return ""; // Handle invalid date

    const [hours, minutes] = timePart.split(":");
    if (!hours || !minutes) return ""; // Handle invalid time

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
export function EditWorkLogModal({ workLogData }: EditWorkLogModalProps) {
    console.log("workLogData", workLogData);
    const [isUpdatingDepartment, setIsUpdatingDepartment] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<EditWorkLogModalState>({
        workLogID: workLogData.workLogID,
        startDateTime: convertToDateTimeLocalFormat(workLogData.startDateTime), // Convert to YYYY-MM-DDTHH:MM
        endDateTime: convertToDateTimeLocalFormat(workLogData.endDateTime), // Convert to YYYY-MM-DDTHH:MM
        ticketID: workLogData.ticket?.ticketID,
    });

    const [urlSearchParams] = useSearchParams();
    const selectedTicketID = urlSearchParams.get('ticketID') ?? '';

    const queryClient = useQueryClient();

    const updateWorkLogMutation = useMutation({
        mutationFn: () => {
            console.log("formState.endDateTime", formState.endDateTime)
            console.log("formState.startDateTime", formState.startDateTime)
            const workLogData = {
                "endDateTime": formState.endDateTime, // Convert back to DD/MM/YYYY HH:MM
                "startDateTime": formState.startDateTime, // Convert back to DD/MM/YYYY HH:MM
                "type": "update",
                "ticket": {
                    "ticketID": formState.ticketID,
                }
            };

            return logsService.editLog(workLogData, formState.workLogID);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, selectedTicketID] }); // Use the id here
            // queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, selectedTicketID + ""] }); // Use the id here
            queryClient.invalidateQueries({ queryKey: [queryKeysService.WORK_LOGS_BY_TICKET_ID, selectedTicketID] });
            toastService.showToast(setToastProps, 'Work log updated successfully!', "success");
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error updating Work log. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsUpdatingDepartment(false);
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Update form state when workLogData changes
        setFormState({
            workLogID: workLogData.workLogID,
            startDateTime: convertToDateTimeLocalFormat(workLogData.startDateTime), // Convert to YYYY-MM-DDTHH:MM
            endDateTime: convertToDateTimeLocalFormat(workLogData.endDateTime), // Convert to YYYY-MM-DDTHH:MM
            ticketID: workLogData.ticket?.ticketID,
        });
    }, [workLogData]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setFormState((prevState) => ({
            ...prevState,
            [name]: value, // Update state directly (value is already in YYYY-MM-DDTHH:MM format)
        }));
    }

    async function handleSubmit() {
        try {
            // Validate form data
            setIsUpdatingDepartment(true);
            updateWorkLogMutation.mutate();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => err.message).join(", ");
                toastService.showToast(setToastProps, errorMessages, "destructive");
            }
        }
    }

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <IconWithTooltip iconName="Pencil" tooltipTitle="Edit" onClick={() => setIsDialogOpen(true)} />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit work log</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startDateTime" className="text-right">
                                Start date
                            </Label>
                            <input
                                id="startDateTime"
                                name="startDateTime"
                                type="datetime-local"
                                value={formState.startDateTime} // Already in YYYY-MM-DDTHH:MM format
                                onChange={handleInputChange}
                                className="col-span-3 p-2 border rounded"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="endDateTime" className="text-right">
                                End date
                            </Label>
                            <input
                                id="endDateTime"
                                name="endDateTime"
                                type="datetime-local"
                                value={formState.endDateTime} // Already in YYYY-MM-DDTHH:MM format
                                onChange={handleInputChange}
                                className="col-span-3 p-2 border rounded"
                            />
                        </div>
                    </div>
                    <ButtonComponent
                        buttonText="Save changes"
                        buttonTextWhenLoading="Saving changes..."
                        isLoading={isUpdatingDepartment}
                        showButtonTextWhenLoading={true}
                        onClick={handleSubmit}
                    />
                </DialogContent>
            </Dialog>
            {toastProps && (
                <ToastComponent
                    key={toastProps.key}
                    variant={toastProps.variant}
                    title={toastProps.title}
                    description={toastProps.description}
                />
            )}
        </div>
    );
}