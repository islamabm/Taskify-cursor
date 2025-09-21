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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { AddTaskTypeModalState } from "../../types/commonTypes/commonTypes";
import { taskTypesService } from "../../services/taskTypes.service";
import { queryKeysService } from "../../services/queryKeys.service";
import { departmentsService } from "../../services/departments.service";
import SelectDepartmentAndSub from "../Selects/SelectDepartmentAndSub";
import ErrorPage from "../ErrorPage";


// Validation schema for task fields
const taskTypeSchema = z.object({
    taskTypeName: z.string().min(1, { message: "Task type is required" }),

});


export function AddTaskTypeModal() {
    const [isAddingType, setIsAddingType] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<AddTaskTypeModalState>({
        taskTypeName: "",
        departmentID: "",

    });


    const { data: departments, isError: isDepartmentsError, error: departmentsError, isLoading: isLoadingDepartments } = useQuery({
        queryKey: [queryKeysService.DEPARTMENTS2],
        queryFn: () => departmentsService.fetchDepartmentsWithSubDepartments()
    });

    const queryClient = useQueryClient();
    const addTaskTypeMutation = useMutation({
        mutationFn: () => {
            const taskTypeData = {
                "ticketType": formState.taskTypeName,
                "department": {
                    "departmentID": +formState.departmentID,
                    // "parentID": 1,
                }


            };

            return taskTypesService.insertTaskType(taskTypeData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TASK_TYPES] });
            toastService.showToast(setToastProps, 'Task type added successfully!', "success");

            setFormState({ taskTypeName: "", departmentID: "" }); // Reset form after success

        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error adding task type. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsAddingType(false);
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
            taskTypeSchema.parse(formState); // Validate form data
            setIsAddingType(true);
            addTaskTypeMutation.mutate();
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
                    <Button onClick={() => setIsDialogOpen(true)}>Add new</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New type</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="taskTypeNames" className="text-left">
                                Task type
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Task type"
                                inputValue={formState.taskTypeName}
                                inputType="text"
                                name="taskTypeName"
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
                        buttonText="Save"
                        buttonTextWhenLoading="Saving..."
                        isLoading={isAddingType}
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
