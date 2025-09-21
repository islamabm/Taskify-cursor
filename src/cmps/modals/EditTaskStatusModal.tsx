import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import BasicInput from "../helpers/BasicInput";
import { IconWithTooltip } from "../helpers/IconWithTooltip";
import { ButtonComponent } from "../helpers/ButtonComponent";
import { toastService } from "../../services/toast.service";
import ToastComponent from "../helpers/ToastComponent";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { EditTaskStatusEditModalState } from "../../types/commonTypes/commonTypes";
import { z } from "zod";
import { taskStatusesService } from "../../services/taskStatuses.service";
import SelectStatusType from "../Selects/SelectStatusType";
import { queryKeysService } from "../../services/queryKeys.service";

// Define validation schema with Zod
const departmentSchema = z.object({
    customStatus: z.string().min(1, { message: "Name is required" }),

});

interface EditTaskStatusModalProps {
    readonly taskStatusData: EditTaskStatusEditModalState;
}

export function EditTaskStatusModal({ taskStatusData }: EditTaskStatusModalProps) {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<EditTaskStatusEditModalState>({
        customStatusID: taskStatusData.customStatusID,
        customStatus: taskStatusData.customStatus,
        orderOfDisplay: taskStatusData.orderOfDisplay,
        type: taskStatusData.type,

    });

    const queryClient = useQueryClient();



    const updateEmployeeMutation = useMutation({
        mutationFn: () => {
            const taskTypeData = {
                "customStatus": formState.customStatus,
                "orderOfDisplay": formState.orderOfDisplay,
                "type": formState.type,
            };

            return taskStatusesService.editTaskStatus(taskTypeData, +formState.customStatusID);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TASK_STATUSES] });
            toastService.showToast(setToastProps, 'Task status updated successfully!', "success");
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error updating status. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsUpdatingStatus(false);
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Update form state when employeeData changes
        setFormState({
            customStatusID: taskStatusData.customStatusID,
            customStatus: taskStatusData.customStatus,
            orderOfDisplay: taskStatusData.orderOfDisplay,
            type: taskStatusData.type,



        });
    }, [taskStatusData]);


    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }



    async function handleSubmit() {
        try {
            // Validate form data
            departmentSchema.parse(formState);
            setIsUpdatingStatus(true);
            updateEmployeeMutation.mutate();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => err.message).join(", ");
                toastService.showToast(setToastProps, errorMessages, "destructive");
            }
        }
    }


    const taskTypesToRender = [{ itemValue: "ticket", itemText: "ticket" }, { itemValue: "product", itemText: "product" }]

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <IconWithTooltip iconName="Pencil" tooltipTitle="Edit" onClick={() => setIsDialogOpen(true)} />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit status</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="customStatus" className="text-left">
                                Status title
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Status title"
                                inputValue={formState.customStatus}
                                inputType="text"
                                name="customStatus"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="orderOfDisplay" className="text-left">
                                order of display
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Status order of display"
                                inputValue={formState.orderOfDisplay}
                                inputType="text"
                                name="orderOfDisplay"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-left">
                                Type
                            </Label>
                            <SelectStatusType
                                dataToRender={taskTypesToRender}
                                handleStatusTypeChanged={(taskStatusType: string) =>
                                    setFormState((prevState) => ({
                                        ...prevState,
                                        type: taskStatusType,
                                    }))
                                }
                                selectedValue={formState.type}
                            />
                        </div>


                    </div>
                    <ButtonComponent
                        buttonText="Save changes"
                        buttonTextWhenLoading="Saving changes..."
                        isLoading={isUpdatingStatus}
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
