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

import { Priority } from "../../types/commonTypes/commonTypes";
import { z } from "zod";
import { priorityService } from "../../services/priority.service";
import { queryKeysService } from "../../services/queryKeys.service";

// Define validation schema with Zod
const prioritySchema = z.object({
    priorityLevel: z.string().min(1, { message: "Priority level is required" }),

});

interface EditPriorityModalProps {
    readonly priorityData: Priority;
}

export function EditPriorityModal({ priorityData }: EditPriorityModalProps) {
    const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<Priority>({
        priorityLevelID: priorityData.priorityLevelID,
        priorityLevel: priorityData.priorityLevel,

    });

    const queryClient = useQueryClient();



    const updatePriorityLevelMutation = useMutation({
        mutationFn: () => {
            const priorityLevelData = {
                "priorityLevel": formState.priorityLevel,


            };

            return priorityService.editPriorityLevel(priorityLevelData, formState.priorityLevelID)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.PRIORITY_LEVELS] });
            toastService.showToast(setToastProps, 'Priority level updated successfully!', "success");
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error updating priority level. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsUpdatingPriority(false);
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Update form state when employeeData changes
        setFormState({
            priorityLevelID: priorityData.priorityLevelID,
            priorityLevel: priorityData.priorityLevel,

        });
    }, [priorityData]);


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
            prioritySchema.parse(formState);
            setIsUpdatingPriority(true);
            updatePriorityLevelMutation.mutate();
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
                        <DialogTitle>Edit priority</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priorityLevel" className="text-left required-input-style">
                                Priority level *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Priority name"
                                inputValue={formState.priorityLevel}
                                inputType="text"
                                name="priorityLevel"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>


                    </div>
                    <ButtonComponent
                        buttonText="Save changes"
                        buttonTextWhenLoading="Saving changes..."
                        isLoading={isUpdatingPriority}
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
