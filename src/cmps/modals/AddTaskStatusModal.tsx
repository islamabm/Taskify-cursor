import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import BasicInput from "../helpers/BasicInput";
import { ButtonComponent } from "../helpers/ButtonComponent";
import { toastService } from "../../services/toast.service";
import ToastComponent from "../helpers/ToastComponent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { AddTaskStatusModalState } from "../../types/commonTypes/commonTypes";
import { taskStatusesService } from "../../services/taskStatuses.service";
import SelectStatusType from "../Selects/SelectStatusType";
import { queryKeysService } from "../../services/queryKeys.service";


// Validation schema for task fields
const taskStatusSchema = z.object({
    taskStatus: z.string().min(1, { message: "Task status is required" }),
    type: z.string().min(1, { message: "Type is required" }),

});


export function AddTaskStatusModal() {
    const [isAddingTaskStatus, setIsAddingTaskStatus] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<AddTaskStatusModalState>({
        taskStatus: "",
        orderOfDisplay: 0,
        type: "",

    });




    const queryClient = useQueryClient();
    const addTaskStatusMutation = useMutation({
        mutationFn: () => {
            const taskStatusData = {
                "customStatus": formState.taskStatus,
                "orderOfDisplay": +formState.orderOfDisplay,
                "type": formState.type,
            };

            return taskStatusesService.insertTaskStatus(taskStatusData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TASK_STATUSES] });
            toastService.showToast(setToastProps, 'Task status added successfully!', "success");
            setFormState({
                taskStatus: "",
                orderOfDisplay: 0,
                type: "",

            }); // R
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error adding task status. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsAddingTaskStatus(false);
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    async function handleSubmit() {
        try {
            taskStatusSchema.parse(formState); // Validate form data
            setIsAddingTaskStatus(true);
            await addTaskStatusMutation.mutate();



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
                    <Button onClick={() => setIsDialogOpen(true)}>Add new</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New status</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="taskStatus" className="text-left required-input-style">
                                Status *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Task status"
                                inputValue={formState.taskStatus}
                                inputType="text"
                                name="taskStatus"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="orderOfDisplay" className="text-left">
                                Order of display
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Order of display"
                                inputValue={formState.orderOfDisplay}
                                inputType="text"
                                name="orderOfDisplay"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-left required-input-style">
                                Type *
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
                        buttonText="Save"
                        buttonTextWhenLoading="Saving..."
                        isLoading={isAddingTaskStatus}
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
