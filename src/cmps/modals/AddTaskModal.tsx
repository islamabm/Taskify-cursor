
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
import { AddTaskModalState, Priority, TaskType, User } from "../../types/commonTypes/commonTypes";
import { employeesService } from "../../services/employees.service";
import { priorityService } from "../../services/priority.service";
import SelectTaskStatus from "../Selects/SelectTaskStatus";
import { tasksService } from "../../services/task.service";
import ErrorPage from "../ErrorPage";
import { departmentsService } from "../../services/departments.service";
import { taskStatusesService } from "../../services/taskStatuses.service";
import { taskTypesService } from "../../services/taskTypes.service";
import SelectDepartmentAndSub from "../Selects/SelectDepartmentAndSub";
import AutoCompleteBusinesses from "../AutoCompleteBusinesses";
import SelectPriorityTypeNumber from "../Selects/SelectPriorityTypeNumber";
import SelectTaskTypeNumber from "../Selects/SelectTaskTypeNumber";
import SelectEmployeeNumber from "../Selects/SelectEmployeeNumber";
import { queryKeysService } from "../../services/queryKeys.service";

// Validation schema for task fields



export function AddTaskModal() {
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [partnerID, setPartnerID] = React.useState<number>(0);


    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<AddTaskModalState>({
        userID: "",
        departmentID: "",
        priorityLevelID: "",
        ticketTypeID: "",
        deadline: 0,
        quantity: 0,
        content: ""
    });





    const { data: priorityTypes, isError: isPriorityError, error: priorityError, isLoading: isLoadingPriorityTypes } = useQuery({
        queryKey: [queryKeysService.PRIORITY_LEVELS],
        queryFn: () => priorityService.getPriorityLevels()
    });
    // const { data: taskStatuses, isError: isTaskStatusesError, error: taskStatusesError, isLoading: isLoadingTaskStatuses } = useQuery({
    //     queryKey: ['taskStatuses'],
    //     queryFn: () => taskStatusesService.getTaskStatuses()
    // });
    const { data: taskTypes, isError: isTaskTypesError, error: taskTypesError, isLoading: isLoadingTaskTypes } = useQuery({
        queryKey: [queryKeysService.TASK_TYPES],
        queryFn: () => taskTypesService.getTasksTypes()
    });
    const { data: departments, isError: isDepartmentsError, error: departmentsError, isLoading: isLoadingDepartments } = useQuery({
        queryKey: [queryKeysService.DEPARTMENTS2],
        queryFn: () => departmentsService.fetchDepartmentsWithSubDepartments()
    });
    const { data: employees, isError: isEmployeesError, error: employeesError, isLoading: isLoadingEmployees } = useQuery({
        queryKey: [queryKeysService.USERS],
        queryFn: () => employeesService.getMyEmployees()
    });


    const queryClient = useQueryClient();



    const addTaskMutation = useMutation({
        mutationFn: () => {
            const taskData = {

                "priorityLevel": {
                    "priorityLevelID": formState.priorityLevelID,
                },
                "ticketType": {
                    "ticketTypeID": formState.ticketTypeID,
                },
                "user": {
                    "userID": formState.userID,
                },

                "market": {
                    "marketID": partnerID,
                },
                "customStatus": {
                    "customStatusID": 8,
                },
                "department": {
                    "departmentID": formState.departmentID,
                },
                "deadline": +formState.deadline,
                "quantity": +formState.quantity,
                "content": formState.content

            }

            return tasksService.insertTask(taskData);
        }, onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TASKS] });
            toastService.showToast(setToastProps, 'Task added successfully!', "success");
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error adding task. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsAddingTask(false);
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
            // taskSchema.parse(formState); // Validate form data

            if (formState.departmentID === "" || formState.priorityLevelID === "" || formState.ticketTypeID === "" || formState.userID === "" || partnerID === 0 || formState.deadline === 0 || formState.quantity === 0) {
                toastService.showToast(setToastProps, 'Make sure all required fields are filled out.', "destructive");
            } else {

                setIsAddingTask(true);
                addTaskMutation.mutate();
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => err.message).join(", ");
                toastService.showToast(setToastProps, errorMessages, "destructive");
            }
        }
    }








    if (isLoadingPriorityTypes || isLoadingTaskTypes || isLoadingDepartments || isLoadingEmployees) {
        return null;
    }

    if (isDepartmentsError) {
        console.error("Error fetching departments:", departmentsError);
        return <ErrorPage errorText={`Error fetching departments data. Please try again later. ${departmentsError.message}`} />;
    }
    if (isPriorityError) {
        console.error("Error fetching priority types:", priorityError);
        return <ErrorPage errorText={`Error fetching priority types data. Please try again later. ${priorityError.message}`} />;
    }
    // if (isTaskStatusesError) {
    //     console.error("Error fetching task statuses:", taskStatusesError);
    //     return <ErrorPage errorText={`Error fetching task statuses data. Please try again later. ${taskStatusesError.message}`} />;
    // }
    if (isTaskTypesError) {
        console.error("Error fetching task types:", taskTypesError);
        return <ErrorPage errorText={`Error fetching task types data. Please try again later. ${taskTypesError.message}`} />;
    }
    if (isEmployeesError) {
        console.error("Error fetching employees:", employeesError);
        return <ErrorPage errorText={`Error fetching employees data. Please try again later. ${employeesError.message}`} />;
    }



    const priorityTypesToRender = priorityTypes
        ? priorityTypes.data.map((priorityType: Priority) => ({
            itemValue: priorityType.priorityLevelID,
            itemText: priorityType.priorityLevel,
        }))


        : []; // fallback to empty array
    // const taskStatusesToRender = taskStatuses
    //     ? taskStatuses.data.map((taskStatus: TaskStatus) => ({
    //         itemValue: taskStatus.customStatusID,
    //         itemText: taskStatus.customStatus,
    //     }))


    //     : []; // fallback to empty array

    const taskTypesToRender = taskTypes
        ? taskTypes.data.map((taskType: TaskType) => ({
            itemValue: taskType.ticketTypeID,
            itemText: taskType.ticketType,
        }))


        : []; // fallback to empty array
    const employeesToRender = employees
        ? employees.data.map((employee: User) => ({
            itemValue: employee.userID,
            itemText: employee.fullName,
        }))


        : []; // fallback to empty array


    function handleSelectPartner(id: string, name: string) {
        setPartnerID(+id);
    }


    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => setIsDialogOpen(true)}>Add new</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">

                        <div className="grid grid-cols-4 items-center gap-4 ">

                            <Label htmlFor="Business" className="text-left required-input-style">
                                Business *
                            </Label>
                            <AutoCompleteBusinesses onSelectPartner={handleSelectPartner} />
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

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeeName" className="text-left required-input-style">
                                Assign to *

                            </Label>
                            <SelectEmployeeNumber
                                dataToRender={employeesToRender}
                                handleEmployeeSelect={(employeeID: number) =>
                                    setFormState((prevState) => ({
                                        ...prevState,
                                        userID: employeeID,
                                    }))
                                }
                                selectedValue={formState.userID}
                            />

                        </div>
                        {/* <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-left">
                                Status
                            </Label>
                            <SelectTaskStatus
                                dataToRender={taskStatusesToRender}
                                handleStatusSelect={(taskStatusID: string) =>
                                    setFormState((prevState) => ({
                                        ...prevState,
                                        statusID: taskStatusID,
                                    }))
                                }
                                selectedValue={formState.statusID}
                            />
                        </div> */}


                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-left required-input-style">
                                Priority *
                            </Label>
                            <SelectPriorityTypeNumber
                                dataToRender={priorityTypesToRender}
                                handlePriorityTypeSelect={(priorityID: number) =>
                                    setFormState((prevState) => ({
                                        ...prevState,
                                        priorityLevelID: priorityID,
                                    }))
                                }
                                selectedValue={formState.priorityLevelID}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-left required-input-style">
                                Type *
                            </Label>
                            <SelectTaskTypeNumber
                                dataToRender={taskTypesToRender}
                                handleTaskTypeSelect={(taskTypeID: number) =>
                                    setFormState((prevState) => ({
                                        ...prevState,
                                        ticketTypeID: taskTypeID,
                                    }))
                                }
                                selectedValue={formState.ticketTypeID}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-left required-input-style">
                                Quantity *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Quantity"
                                inputValue={formState.quantity}
                                inputType="number"
                                name="quantity"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="deadline" className="text-left required-input-style">
                                Deadline *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Deadline"
                                inputValue={formState.deadline}
                                inputType="number"
                                name="deadline"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="content" className="text-left">
                                Notes
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Notes"
                                inputValue={formState.content ?? ""}
                                inputType="text"
                                name="content"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>
                    </div>
                    <ButtonComponent
                        buttonText="Save"
                        buttonTextWhenLoading="Saving..."
                        isLoading={isAddingTask}
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