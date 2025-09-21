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
import { AddSubDepartmentModalState } from "../../types/commonTypes/commonTypes";
import { departmentsService } from "../../services/departments.service";
import { useSearchParams } from "react-router-dom";
import ErrorPage from "../ErrorPage";
import { queryKeysService } from "../../services/queryKeys.service";

// Validation schema for task fields
const departmentSchema = z.object({
    subDepartmentName: z.string().min(1, { message: "Sub-department Name is required" }),
});

export function AddSubDepartmentModal() {
    // All hooks are called here at the top level, unconditionally:
    const [searchParams] = useSearchParams();
    const parentID = searchParams.get('departmentID');

    const [isAddingSubDepartment, setIsAddingSubDepartment] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<AddSubDepartmentModalState>({
        subDepartmentName: "",
    });

    const queryClient = useQueryClient();
    const addSubDepartmentMutation = useMutation({
        mutationFn: () => {
            const departmentData = {
                "departmentName": formState.subDepartmentName,
                "parentID": Number(parentID),
            };

            return departmentsService.insertDepartment(departmentData);
        },
        onSuccess: () => {
            // queryKey: [queryKeysService.SUB_DEPARTMENTS, selectedDepartmentID],

            queryClient.invalidateQueries({ queryKey: [queryKeysService.SUB_DEPARTMENTS, parentID] });
            toastService.showToast(setToastProps, 'Sub-department added successfully!', "success");
            setFormState({ subDepartmentName: "" });
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error adding sub-department. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsAddingSubDepartment(false);
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Now we can check if parentID is missing, after all hooks have been called
    if (!parentID) {
        return <ErrorPage errorText="No parent department selected. Please check the URL and try again." />;
    }

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
            setIsAddingSubDepartment(true);
            await addSubDepartmentMutation.mutate();
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
                        <DialogTitle>Add New Sub-department</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subDepartmentName" className="text-left required-input-style">
                                Name *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Sub-department name"
                                inputValue={formState.subDepartmentName}
                                inputType="text"
                                name="subDepartmentName"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>
                    </div>
                    <ButtonComponent
                        buttonText="Save"
                        buttonTextWhenLoading="Saving..."
                        isLoading={isAddingSubDepartment}
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
