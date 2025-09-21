import React from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

// shadcn/ui
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

// existing app helpers
import BasicInput from "../cmps/helpers/BasicInput";
import { ButtonComponent } from "../cmps/helpers/ButtonComponent";
import ToastComponent from "../cmps/helpers/ToastComponent";
import { toastService } from "../services/toast.service";

// domain + services
import type { AddTaskModalState, Priority, TaskType, User } from "../types/commonTypes/commonTypes";
import { employeesService } from "../services/employees.service";
import { priorityService } from "../services/priority.service";
import { tasksService } from "../services/task.service";
import ErrorPage from "../cmps/ErrorPage";
import { departmentsService } from "../services/departments.service";
import { taskTypesService } from "../services/taskTypes.service";
import SelectDepartmentAndSub from "../cmps/Selects/SelectDepartmentAndSub";
import AutoCompleteBusinesses from "../cmps/AutoCompleteBusinesses";
import SelectPriorityTypeNumber from "../cmps/Selects/SelectPriorityTypeNumber";
import SelectTaskTypeNumber from "../cmps/Selects/SelectTaskTypeNumber";
import SelectEmployeeNumber from "../cmps/Selects/SelectEmployeeNumber";
import { queryKeysService } from "../services/queryKeys.service";
import { navigateService } from "../services/navigate.service";
import { useNavigate } from "react-router-dom";
import { routeService } from "../services/route.service";

// --- Page Component ---
export default function AddTaskPage() {
    const [isAddingTask, setIsAddingTask] = React.useState(false);
    const [partnerID, setPartnerID] = React.useState<number>(0);
    const navigate = useNavigate()
    const [toastProps, setToastProps] = React.useState<{
        key: number;
        variant: "success" | "destructive";
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = React.useState<AddTaskModalState>({
        userID: "",
        departmentID: "",
        priorityLevelID: "",
        ticketTypeID: "",
        deadline: 0,
        quantity: 0,
        content: "",
    });

    const queryClient = useQueryClient();

    // data
    const {
        data: priorityTypes,
        isError: isPriorityError,
        error: priorityError,
        isLoading: isLoadingPriorityTypes,
    } = useQuery({
        queryKey: [queryKeysService.PRIORITY_LEVELS],
        queryFn: () => priorityService.getPriorityLevels(),
    });

    const {
        data: taskTypes,
        isError: isTaskTypesError,
        error: taskTypesError,
        isLoading: isLoadingTaskTypes,
    } = useQuery({
        queryKey: [queryKeysService.TASK_TYPES],
        queryFn: () => taskTypesService.getTasksTypes(),
    });

    const {
        data: departments,
        isError: isDepartmentsError,
        error: departmentsError,
        isLoading: isLoadingDepartments,
    } = useQuery({
        queryKey: [queryKeysService.DEPARTMENTS2],
        queryFn: () => departmentsService.fetchDepartmentsWithSubDepartments(),
    });

    const {
        data: employees,
        isError: isEmployeesError,
        error: employeesError,
        isLoading: isLoadingEmployees,
    } = useQuery({
        queryKey: [queryKeysService.USERS],
        queryFn: () => employeesService.getMyEmployees(),
    });

    // mutation
    const addTaskMutation = useMutation({
        mutationFn: () => {
            const taskData = {
                priorityLevel: { priorityLevelID: formState.priorityLevelID },
                ticketType: { ticketTypeID: formState.ticketTypeID },
                user: { userID: formState.userID },
                market: { marketID: partnerID },
                customStatus: { customStatusID: 8 },
                department: { departmentID: formState.departmentID },
                deadline: +formState.deadline,
                quantity: +formState.quantity,
                content: formState.content,
            };
            return tasksService.insertTask(taskData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.TASKS] });
            toastService.showToast(setToastProps, "Task added successfully!", "success");
            // navigateService.handleNavigation()
            navigateService.handleNavigation(navigate, routeService.TASKS)

            setFormState((s) => ({ ...s, content: "", quantity: 0, deadline: 0 }));
            setPartnerID(0);
        },
        onError: () => {
            toastService.showToast(setToastProps, "Error adding task. Please try again.", "destructive");
        },
        onSettled: () => {
            setIsAddingTask(false);
        },
    });

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit() {
        try {
            if (
                formState.departmentID === "" ||
                formState.priorityLevelID === "" ||
                formState.ticketTypeID === "" ||
                formState.userID === "" ||
                partnerID === 0 ||
                formState.deadline === 0 ||
                formState.quantity === 0
            ) {
                toastService.showToast(
                    setToastProps,
                    "Make sure all required fields are filled out.",
                    "destructive"
                );
            } else {
                setIsAddingTask(true);
                addTaskMutation.mutate();

            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map((err) => err.message).join(", ");
                toastService.showToast(setToastProps, errorMessages, "destructive");
            }
        }
    }

    if (isLoadingPriorityTypes || isLoadingTaskTypes || isLoadingDepartments || isLoadingEmployees) {
        return (
            <div className="min-h-[60vh] grid place-items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className="text-sm text-muted-foreground"
                >
                    Loading form…
                </motion.div>
            </div>
        );
    }

    if (isDepartmentsError) {
        console.error("Error fetching departments:", departmentsError);
        return (
            <ErrorPage errorText={`Error fetching departments data. Please try again later. ${departmentsError.message}`} />
        );
    }
    if (isPriorityError) {
        console.error("Error fetching priority types:", priorityError);
        return (
            <ErrorPage errorText={`Error fetching priority types data. Please try again later. ${priorityError.message}`} />
        );
    }
    if (isTaskTypesError) {
        console.error("Error fetching task types:", taskTypesError);
        return (
            <ErrorPage errorText={`Error fetching task types data. Please try again later. ${taskTypesError.message}`} />
        );
    }
    if (isEmployeesError) {
        console.error("Error fetching employees:", employeesError);
        return (
            <ErrorPage errorText={`Error fetching employees data. Please try again later. ${employeesError.message}`} />
        );
    }

    const priorityTypesToRender = priorityTypes
        ? priorityTypes.data.map((p: Priority) => ({ itemValue: p.priorityLevelID, itemText: p.priorityLevel }))
        : [];
    const taskTypesToRender = taskTypes
        ? taskTypes.data.map((t: TaskType) => ({ itemValue: t.ticketTypeID, itemText: t.ticketType }))
        : [];
    const employeesToRender = employees
        ? employees.data.map((e: User) => ({ itemValue: e.userID, itemText: e.fullName }))
        : [];

    function handleSelectPartner(id: string) {
        setPartnerID(+id);
    }

    // animation helpers
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
    } as const;
    const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } } as const;

    return (
        // <div dir="ltr" className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 mt-10 sm:mt-0">

        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4">
            {/* Centered form card like the screenshot */}
            <div className="mx-auto max-w-3xl py-8 sm:py-10">
                <Card className="rounded-3xl shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-2xl text-center">Create a New Task</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6">
                            <motion.div variants={item} className="grid gap-2">
                                <Label>
                                    Business <span className="required-input-style">*</span>
                                </Label>
                                <AutoCompleteBusinesses onSelectPartner={handleSelectPartner} />
                            </motion.div>

                            <motion.div variants={item} className="grid gap-2">
                                <Label>
                                    Campaign Department <span className="required-input-style">*</span>
                                </Label>
                                <SelectDepartmentAndSub
                                    handleDepartmentChanged={(departmentID: string) => setFormState((prev) => ({ ...prev, departmentID }))}
                                    selectedValue={formState.departmentID}
                                    dataToRender={departments}
                                />
                            </motion.div>

                            {/* <div className="grid sm:grid-cols-2 gap-4"> */}
                            <motion.div variants={item} className="grid gap-2">
                                <Label>
                                    Assign to <span className="required-input-style">*</span>
                                </Label>
                                <SelectEmployeeNumber
                                    dataToRender={employeesToRender}
                                    handleEmployeeSelect={(employeeID: number) => setFormState((prev) => ({ ...prev, userID: employeeID }))}
                                    selectedValue={formState.userID}
                                />
                            </motion.div>
                            <motion.div variants={item} className="grid gap-2">
                                <Label>
                                    Priority <span className="required-input-style">*</span>
                                </Label>
                                <SelectPriorityTypeNumber
                                    dataToRender={priorityTypesToRender}
                                    handlePriorityTypeSelect={(priorityID: number) =>
                                        setFormState((prev) => ({ ...prev, priorityLevelID: priorityID }))
                                    }
                                    selectedValue={formState.priorityLevelID}
                                />
                            </motion.div>
                            {/* </div> */}

                            {/* <div className="grid sm:grid-cols-2 gap-4"> */}
                            <motion.div variants={item} className="grid gap-2">
                                <Label>
                                    Type <span className="required-input-style">*</span>
                                </Label>
                                <SelectTaskTypeNumber
                                    dataToRender={taskTypesToRender}
                                    handleTaskTypeSelect={(taskTypeID: number) => setFormState((prev) => ({ ...prev, ticketTypeID: taskTypeID }))}
                                    selectedValue={formState.ticketTypeID}
                                />
                            </motion.div>
                            <motion.div variants={item} className="grid gap-2">
                                <Label>
                                    Quantity <span className="required-input-style">*</span>
                                </Label>
                                <BasicInput
                                    inputPlaceHolder="Quantity"
                                    inputValue={formState.quantity}
                                    inputType="number"
                                    name="quantity"
                                    onChange={handleInputChange}
                                />
                            </motion.div>
                            {/* </div> */}

                            {/* <div className="grid sm:grid-cols-2 gap-4"> */}
                            <motion.div variants={item} className="grid gap-2">
                                <Label>
                                    Deadline  <span className="required-input-style">*</span>
                                </Label>
                                <BasicInput
                                    inputPlaceHolder="Deadline"
                                    inputValue={formState.deadline}
                                    inputType="number"
                                    name="deadline"
                                    onChange={handleInputChange}
                                />
                            </motion.div>
                            <motion.div variants={item} className="grid gap-2">
                                <Label>Notes</Label>
                                <BasicInput
                                    inputPlaceHolder="Notes"
                                    inputValue={formState.content ?? ""}
                                    inputType="text"
                                    name="content"
                                    onChange={handleInputChange}
                                />
                            </motion.div>
                            {/* </div> */}

                            <Separator />

                            <motion.div variants={item} className="flex items-center justify-end gap-2">
                                <Button onClick={handleSubmit} className="rounded-2xl">
                                    Save Task
                                </Button>
                                {/* <Button variant="ghost" type="button" onClick={() => history.back()} className="rounded-2xl">
                                    Cancel
                                </Button> */}
                            </motion.div>
                        </motion.div>
                    </CardContent>
                </Card>
            </div>

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