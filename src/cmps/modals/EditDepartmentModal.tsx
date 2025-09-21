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

import { Department } from "../../types/commonTypes/commonTypes";
import { z } from "zod";
import { departmentsService } from "../../services/departments.service";
import { queryKeysService } from "../../services/queryKeys.service";

// Define validation schema with Zod
const departmentSchema = z.object({
    departmentName: z.string().min(1, { message: "Department name is required" }),

});

interface EditDepartmentModalProps {
    readonly departmentData: Department;
}

export function EditDepartmentModal({ departmentData }: EditDepartmentModalProps) {
    const [isUpdatingDepartment, setIsUpdatingDepartment] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<Department>({
        departmentID: departmentData.departmentID,
        departmentName: departmentData.departmentName,
        parentID: 0

    });

    const queryClient = useQueryClient();



    const updateDepartmentMutation = useMutation({
        mutationFn: () => {
            const departmentData = {
                "departmentName": formState.departmentName,
                "parentID": 0
            };

            return departmentsService.editDepartment(departmentData, formState.departmentID);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.DEPARTMENTS] });
            toastService.showToast(setToastProps, 'Department updated successfully!', "success");
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error updating department. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsUpdatingDepartment(false);
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Update form state when employeeData changes
        setFormState({
            departmentID: departmentData.departmentID,
            departmentName: departmentData.departmentName,
            parentID: 0


        });
    }, [departmentData]);


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
            setIsUpdatingDepartment(true);
            updateDepartmentMutation.mutate();
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
                        <DialogTitle>Edit department</DialogTitle>
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
