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
import { AddDepartmentModalState } from "../../types/commonTypes/commonTypes";
import { departmentsService } from "../../services/departments.service";
import { queryKeysService } from "../../services/queryKeys.service";


// Validation schema for task fields
const departmentSchema = z.object({
    departmentName: z.string().min(1, { message: "Department name is required" }),

});


export function AddDepartmentModal() {
    const [isAddingDepartment, setIsAddingDepartment] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<AddDepartmentModalState>({
        departmentName: "",

    });




    const queryClient = useQueryClient();
    const addDepartmentMutation = useMutation({
        mutationFn: () => {
            const departmentData = {
                "departmentName": formState.departmentName,
                "parentID": 0


            };

            return departmentsService.insertDepartment(departmentData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.DEPARTMENTS] });
            toastService.showToast(setToastProps, 'Department added successfully!', "success");
            setFormState({ departmentName: "" }); // Reset form after success

        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error adding department. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsAddingDepartment(false);
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
            departmentSchema.parse(formState); // Validate form data
            setIsAddingDepartment(true);
            await addDepartmentMutation.mutate();

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
                        <DialogTitle>Add New department</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="departmentName" className="text-left required-input-style">
                                Department name *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Department name"
                                inputValue={formState.departmentName}
                                inputType="text"
                                name="departmentName"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                    </div>
                    <ButtonComponent
                        buttonText="Save"
                        buttonTextWhenLoading="Saving..."
                        isLoading={isAddingDepartment}
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
