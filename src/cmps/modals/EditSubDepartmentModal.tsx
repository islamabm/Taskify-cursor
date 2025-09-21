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

import { EditSubDepartment } from "../../types/commonTypes/commonTypes";
import { z } from "zod";
import { departmentsService } from "../../services/departments.service";
import { useSearchParams } from "react-router-dom";
import { queryKeysService } from "../../services/queryKeys.service";

// Define validation schema with Zod
const departmentSchema = z.object({
    departmentName: z.string().min(1, { message: "Department name is required" }),

});

interface EditSubDepartmentModalProps {
    readonly subDepartmentData: EditSubDepartment;
}

export function EditSubDepartmentModal({ subDepartmentData }: EditSubDepartmentModalProps) {
    const [searchParams] = useSearchParams()
    const [isUpdatingSubDepartment, setIsUpdatingSubDepartment] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<EditSubDepartment>({
        departmentID: subDepartmentData.departmentID,
        // subDepartmentID: subDepartmentData.subDepartmentID,
        departmentName: subDepartmentData.departmentName,
        parentID: subDepartmentData.parentID

    });

    const queryClient = useQueryClient();



    const updateSubDepartmentMutation = useMutation({
        mutationFn: () => {
            const departmentData = {
                "departmentName": formState.departmentName,
                "parentID": formState.parentID


            };

            return departmentsService.editDepartment(departmentData, formState.departmentID);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.SUB_DEPARTMENTS, searchParams.get('departmentID')] });
            toastService.showToast(setToastProps, 'Department updated successfully!', "success");
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error updating department. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsUpdatingSubDepartment(false);
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Update form state when employeeData changes
        setFormState({
            departmentID: subDepartmentData.departmentID,
            departmentName: subDepartmentData.departmentName,
            parentID: subDepartmentData.parentID


        });
    }, [subDepartmentData]);


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
            setIsUpdatingSubDepartment(true);
            updateSubDepartmentMutation.mutate();
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
                        <DialogTitle>Edit Sub-department</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="departmentName" className="text-left required-input-style">
                                Sub-department name *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Sub-department name"
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
                        isLoading={isUpdatingSubDepartment}
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
