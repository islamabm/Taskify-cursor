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
import { AddPriorityModalState } from "../../types/commonTypes/commonTypes";
import { priorityService } from "../../services/priority.service";
import { queryKeysService } from "../../services/queryKeys.service";


// Validation schema for task fields
const priorityLevelsSchema = z.object({
    priorityLevel: z.string().min(1, { message: "Priority Name is required" }),

});


export function AddPriorityLevelModal() {
    const [isAddingPriority, setIsAddingPriority] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<AddPriorityModalState>({
        priorityLevel: "",

    });




    const queryClient = useQueryClient();
    const addPriorityLevelMutation = useMutation({
        mutationFn: () => {
            const priorityLevelData = {
                "priorityLevel": formState.priorityLevel,


            };

            return priorityService.insertPriorityLevel(priorityLevelData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.PRIORITY_LEVELS] });
            toastService.showToast(setToastProps, 'Priority level added successfully!', "success");
            setFormState({
                priorityLevel: "",

            }); // Reset form after success
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error adding task. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsAddingPriority(false);
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
            priorityLevelsSchema.parse(formState); // Validate form data
            setIsAddingPriority(true);
            await addPriorityLevelMutation.mutate();

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
                    <Button onClick={() => setIsDialogOpen(true)}>Add new</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New priority</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priorityLevel" className="text-left required-input-style">
                                Priority lavel *
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
                        buttonText="Save"
                        buttonTextWhenLoading="Saving..."
                        isLoading={isAddingPriority}
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
