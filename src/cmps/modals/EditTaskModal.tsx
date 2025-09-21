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
import { ButtonComponent } from "../helpers/ButtonComponent";
import { toastService } from "../../services/toast.service";
import ToastComponent from "../helpers/ToastComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Priority, Task, TaskStatus, TaskType } from "../../types/commonTypes/commonTypes";
import SelectEmployeeName from "../Selects/SelectEmployeeName";
import { employeesService } from "../../services/employees.service";
import { priorityService } from "../../services/priority.service";
import SelectTaskStatus from "../Selects/SelectTaskStatus";
import { tasksService } from "../../services/task.service";
import SelectTaskType from "../Selects/SelectTaskType";
import { IconWithTooltip } from "../helpers/IconWithTooltip";
import ErrorPage from "../ErrorPage";
import { Loader } from "../helpers/Loader";
import SelectPriorityType from "../Selects/SelectPriorityType";
import { departmentsService } from "../../services/departments.service";
import SelectEmployeeDepartment from "../Selects/SelectEmployeeDepartment";
import SelectEmployeeSubbDepartment from "../Selects/SelectEmployeeSubbDepartment";
import { taskStatusesService } from "../../services/taskStatuses.service";
import { taskTypesService } from "../../services/taskTypes.service";
import SelectDepartmentAndSub from "../Selects/SelectDepartmentAndSub";
import { CheckboxHelper } from "../helpers/CheckboxHelper";
import AutoCompleteBusinesses from "../AutoCompleteBusinesses";
import { queryKeysService } from "../../services/queryKeys.service";

// Validation schema for task fields
const taskSchema = z.object({
    businessName: z.string().min(1, { message: "Business Name is required" }),
    businessID: z.string().min(1, { message: "Business ID is required" }),
    employeeName: z.string().min(1, { message: "Employee Name is required" }),
    status: z.string().min(1, { message: "Status is required" }),
    createdDateTime: z.string().min(1, { message: "Created Date Time is required" }),
    startTime: z.string().min(1, { message: "Start Time is required" }),
    endTime: z.string().min(1, { message: "End Time is required" }),
    priority: z.string().min(1, { message: "Priority is required" }),
    type: z.string().min(1, { message: "Type is required" }),
    quantity: z.string().min(1, { message: "Quantity is required" }),
    notes: z.string().optional(),
});

interface EditTaskModalProps {
    readonly taskData: Task;
}

export function EditTaskModal({ taskData }: EditTaskModalProps) {
    const [isUpdatingTask, setIsUpdatingTask] = useState(false);
    const userID = localStorage.getItem('USERTYPEID_TASKIFY')?.replace(/^"|"$/g, '') || '';
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<Task>({
        ...taskData

    });
    const userTypeID = localStorage.getItem('USERTYPEID_TASKIFY')?.replace(/^"|"$/g, '');


    const queryClient = useQueryClient();

    const { data: priorityTypes, isError: isPriorityError, error: priorityError, isLoading: isLoadingPriorityTypes } = useQuery({
        queryKey: [queryKeysService.PRIORITY_LEVELS],
        queryFn: () => priorityService.getPriorityLevels()
    });
    const { data: taskStatuses, isError: isTaskStatusesError, error: taskStatusesError, isLoading: isLoadingTaskStatuses } = useQuery({
        queryKey: [queryKeysService.TASK_STATUSES],
        queryFn: () => taskStatusesService.getTaskStatuses()
    });
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
        queryFn: () => employeesService.getEmployees()
    });

    const updateTaskMutation = useMutation({
        mutationFn: () => {
            const taskData = {

                "priorityLevel": {
                    "priorityLevelID": +formState.priorityLevel.priorityLevelID,
                },
                "ticketType": {
                    "ticketTypeID": +formState.ticketType.ticketTypeID,
                },
                "user": {
                    "userID": +formState.user.userID,
                },

                "market": {
                    "marketID": formState.market.marketID,
                },
                "customStatus": {
                    "customStatusID": +formState.customStatus.customStatusID,
                },
                "department": {
                    "departmentID": +formState.department.departmentID,
                },
                "deadline": +formState.deadline,
                "quantity": +formState.quantity,
                "isMessage": formState.isMessage,
                "isPublished": formState.isPublished,
                "isAppCheck": formState.isAppCheck,
                "isCategorized": formState.isCategorized,
                "isTagged": formState.isTagged,
                "content": formState.content

            }

            return tasksService.editTask(taskData, formState.ticketID);
        }, onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TASKS] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, formState.ticketID + ""] });
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TICKET, formState.ticketID] });
            toastService.showToast(setToastProps, 'Task updated successfully!', "success");
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error updating task. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsEditTaskModalOpen(false);
            setIsUpdatingTask(false);
        }
    });

    // useEffect(() => {
    //     // Update form state when employeeData changes
    //     setFormState({
    //         ...taskData

    //     });
    // }, [taskData]);

    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

    useEffect(() => {
        setFormState(taskData); // Update form state when taskData changes
    }, [taskData]);

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
            setIsUpdatingTask(true);
            updateTaskMutation.mutate();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => err.message).join(", ");
                toastService.showToast(setToastProps, errorMessages, "destructive");
            }
        }
    }
    function openEditTaskModal() {
        setIsEditTaskModalOpen(true);
    }
    function handleSelectPartner(id: string) {
        setFormState((prevState) => ({
            ...prevState,
            market: {
                ...prevState.market,
                marketID: id, // Update marketID
            }
        }));
    }



    if (isLoadingPriorityTypes || isLoadingTaskStatuses || isLoadingTaskTypes || isLoadingDepartments) {
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
    if (isTaskStatusesError) {
        console.error("Error fetching task statuses:", taskStatusesError);
        return <ErrorPage errorText={`Error fetching task statuses data. Please try again later. ${taskStatusesError.message}`} />;
    }
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
    const taskStatusesToRender = taskStatuses
        ? taskStatuses.data.map((taskStatus: TaskStatus) => ({
            itemValue: taskStatus.customStatusID,
            itemText: taskStatus.customStatus,
        }))


        : []; // fallback to empty array

    const taskTypesToRender = taskTypes
        ? taskTypes.data.map((taskType: TaskType) => ({
            itemValue: taskType.ticketTypeID,
            itemText: taskType.ticketType,
        }))


        : []; // fallback to empty array
    const employeesToRender = employees
        ? employees.data.map((employee: TaskType) => ({
            itemValue: employee.userID,
            itemText: employee.fullName,
        }))


        : []; // fallback to empty array


    const handleCheckboxChange = (field: "isPublished" | "isMessage" | "isAppCheck" | "isCategorized" | "isTagged") => {
        setFormState((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };





    return (
        <div>
            <Dialog open={isEditTaskModalOpen} onOpenChange={setIsEditTaskModalOpen}>
                <DialogTrigger asChild>
                    <IconWithTooltip iconName="Pencil" tooltipTitle="Edit" onClick={openEditTaskModal} />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {(userID === "3" || userID === "4" || userID === "5") &&
                            <>
                                <div className="grid grid-cols-4 items-center gap-4 ">

                                    <Label htmlFor="Business" className="text-left">
                                        Business
                                    </Label>
                                    <AutoCompleteBusinesses onSelectPartner={handleSelectPartner} initialHaatBussID={formState.market.HaatBussID} initialMarketName={formState.market.marketName} />
                                </div>


                                <div className="grid grid-cols-4 items-center gap-4 ">
                                    <Label htmlFor="confirmPassword" className="text-left">
                                        Department
                                    </Label>

                                    <SelectDepartmentAndSub
                                        handleDepartmentChanged={(departmentID: string) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                department: {
                                                    ...prevState.department,
                                                    departmentID: departmentID,
                                                }
                                            }))
                                        }
                                        selectedValue={formState.department.departmentID}
                                        dataToRender={departments}
                                    />

                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="employeeName" className="text-left">
                                        Assign to
                                    </Label>
                                    <SelectEmployeeName
                                        dataToRender={employeesToRender}
                                        handleEmployeeSelect={(userID: string) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                user: {
                                                    ...prevState.user,
                                                    userID: userID,
                                                }
                                            }))
                                        }
                                        selectedValue={formState.user.userID}
                                    />
                                </div>
                                {userTypeID === "3" &&

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="status" className="text-left">
                                            Status
                                        </Label>
                                        <SelectTaskStatus
                                            dataToRender={taskStatusesToRender}
                                            handleStatusSelect={(statusID: string) =>
                                                setFormState((prevState) => ({
                                                    ...prevState,
                                                    customStatus: {
                                                        ...prevState.customStatus,
                                                        customStatusID: statusID,
                                                    }
                                                }))
                                            }
                                            selectedValue={formState.customStatus.customStatusID}
                                        />
                                    </div>
                                }
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="priority" className="text-left">
                                        Priority
                                    </Label>
                                    <SelectPriorityType
                                        dataToRender={priorityTypesToRender}
                                        selectedValue={formState.priorityLevel.priorityLevelID}
                                        handlePriorityTypeSelect={(priorityID: string) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                priorityLevel: {
                                                    ...prevState.priorityLevel,
                                                    priorityLevelID: priorityID,
                                                }
                                            }))
                                        }
                                    // selectedValue={formState.ticketType.ticketTypeID}
                                    // dataToRender={taskTypesToRender}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="type" className="text-left">
                                        Type
                                    </Label>
                                    <SelectTaskType
                                        dataToRender={taskTypesToRender}

                                        handleTaskTypeSelect={(typeID: string) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                ticketType: {
                                                    ...prevState.ticketType,
                                                    ticketTypeID: typeID,
                                                }
                                            }))
                                        }
                                        selectedValue={formState.ticketType.ticketTypeID}
                                        dataToRender={taskTypesToRender}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="quantity" className="text-left">
                                        Quantity
                                    </Label>
                                    <BasicInput
                                        inputPlaceHolder="Quantity"
                                        inputValue={formState.quantity}
                                        inputType="text"
                                        name="quantity"
                                        onChange={handleInputChange}
                                        inputClassName="w-[250px]"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="deadline" className="text-left">
                                        Deadline
                                    </Label>
                                    <BasicInput
                                        inputPlaceHolder="Deadline"
                                        inputValue={formState.deadline}
                                        inputType="text"
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
                                        inputValue={formState.content}
                                        inputType="text"
                                        name="content"
                                        onChange={handleInputChange}
                                        inputClassName="w-[250px]"
                                    />
                                </div>
                            </>}

                        {taskData.department.departmentID === 7 &&
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="isPublished" className="text-left">
                                        Published
                                    </Label>
                                    <CheckboxHelper
                                        checked={formState.isPublished}
                                        onChange={() => handleCheckboxChange("isPublished")}
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="isMessage" className="text-left">
                                        Message
                                    </Label>
                                    <CheckboxHelper
                                        checked={formState.isMessage}
                                        onChange={() => handleCheckboxChange("isMessage")}
                                    />
                                </div>
                            </>

                        }
                        {(+taskData.ticketType.ticketTypeID === 38 || +taskData.ticketType.ticketTypeID === 5) &&
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="isCategorized" className="text-left">
                                        Categorized
                                    </Label>
                                    <CheckboxHelper
                                        checked={formState.isCategorized}
                                        onChange={() => handleCheckboxChange("isCategorized")}
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="isTagged" className="text-left">
                                        Tagged
                                    </Label>
                                    <CheckboxHelper
                                        checked={formState.isTagged}
                                        onChange={() => handleCheckboxChange("isTagged")}
                                    />
                                </div>
                            </>

                        }
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="isAppCheck" className="text-left">
                                App check
                            </Label>
                            <CheckboxHelper
                                checked={formState.isAppCheck}
                                onChange={() => handleCheckboxChange("isAppCheck")}
                            />
                        </div>
                    </div>
                    <ButtonComponent
                        buttonText="Save changes"
                        buttonTextWhenLoading="Saving changes..."
                        isLoading={isUpdatingTask}
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
