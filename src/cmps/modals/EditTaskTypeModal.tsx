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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { EditTaskType } from "../../types/commonTypes/commonTypes";
import { z } from "zod";
import { taskTypesService } from "../../services/taskTypes.service";
import { queryKeysService } from "../../services/queryKeys.service";
import { departmentsService } from "../../services/departments.service";
import ErrorPage from "../ErrorPage";
import SelectDepartmentAndSub from "../Selects/SelectDepartmentAndSub";

// Define validation schema with Zod
const taskTypeSchema = z.object({
    ticketType: z.string().min(1, { message: "Task type is required" }),

});

interface EditTaskTypeModalProps {
    readonly taskTypeData: EditTaskType;
}

export function EditTaskTypeModal({ taskTypeData }: EditTaskTypeModalProps) {
    const [isUpdatingType, setIsUpdatingType] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<EditTaskType>({
        ticketTypeID: taskTypeData.ticketTypeID,
        ticketType: taskTypeData.ticketType,
        departmentID: taskTypeData.department?.departmentID,

    });



    const { data: departments, isError: isDepartmentsError, error: departmentsError, isLoading: isLoadingDepartments } = useQuery({
        queryKey: [queryKeysService.DEPARTMENTS2],
        queryFn: () => departmentsService.fetchDepartmentsWithSubDepartments()
    });

    const queryClient = useQueryClient();



    const updateTaskTypeMutation = useMutation({
        mutationFn: () => {
            const taskTypeData = {
                "ticketType": formState.ticketType,
                "department": {
                    "departmentID": +formState.departmentID,
                    // "parentID": 1,
                }

            };

            return taskTypesService.editTaskType(taskTypeData, formState.ticketTypeID);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TASK_TYPES] });
            toastService.showToast(setToastProps, 'Task type updated successfully!', "success");
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error updating task type. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsUpdatingType(false);
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Update form state when employeeData changes
        setFormState({
            ticketTypeID: taskTypeData.ticketTypeID,
            ticketType: taskTypeData.ticketType,
            departmentID: taskTypeData.department?.departmentID,

        });
    }, [taskTypeData]);


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
            taskTypeSchema.parse(formState);
            setIsUpdatingType(true);
            updateTaskTypeMutation.mutate();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => err.message).join(", ");
                toastService.showToast(setToastProps, errorMessages, "destructive");
            }
        }
    }

    if (isLoadingDepartments) {
        return null;
    }

    if (isDepartmentsError) {
        console.error("Error fetching departments:", departmentsError);
        return <ErrorPage errorText={`Error fetching departments data. Please try again later. ${departmentsError.message}`} />;
    }


    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <IconWithTooltip iconName="Pencil" tooltipTitle="Edit" onClick={() => setIsDialogOpen(true)} />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit type</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="ticketType" className="text-left required-input-style">
                                Task type *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Task type"
                                inputValue={formState.ticketType}
                                inputType="text"
                                name="ticketType"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 ">
                            <Label htmlFor="confirmPassword" className="text-left required-input-style">
                                Department*
                            </Label>

                            <SelectDepartmentAndSub
                                handleDepartmentChanged={(departmentID: string) =>
                                    setFormState((prevState) => ({
                                        ...prevState,
                                        departmentID: departmentID,
                                    }))
                                }
                                selectedValue={formState.departmentID}
                                dataToRender={departments}
                            />

                        </div>

                    </div>
                    <ButtonComponent
                        buttonText="Save changes"
                        buttonTextWhenLoading="Saving changes..."
                        isLoading={isUpdatingType}
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
