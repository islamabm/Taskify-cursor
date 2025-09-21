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
import SelectEmployeeStatus from "../Selects/SelectEmployeeStatus";
import { employeesService } from "../../services/employees.service";
import ErrorPage from "../ErrorPage";
import { AddEmployee, Department, EmployeeStatus, UserType } from "../../types/commonTypes/commonTypes";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import SelectEmployeeType from "../Selects/SelectEmployeeType";
import { departmentsService } from "../../services/departments.service";
import { userStatusesService } from "../../services/userStatuses.service";
import { userTypesService } from "../../services/userTypes.service";
import SelectEmployeeDepartment from "../Selects/SelectEmployeeDepartment";
import { queryKeysService } from "../../services/queryKeys.service";

const employeeSchema = z.object({
    employeeName: z.string().min(1, { message: "Name is required" }),
    // employeeDepartmentID: z.string().min(1, { message: "Department is required" }),
    // employeeStatusID: z.string().min(1, { message: "Status is required" }),
    employeeEmail: z.string().email({ message: "Please enter a valid email" }),
    employeePhone: z.string()
        .min(10, { message: "Phone number must be at least 10 digits" })
        .regex(/^\+?\d{10,15}$/, { message: "Please enter a valid phone number" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" }),
    // .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
    // .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
    // .regex(/\d/, { message: "Password must contain a number" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});


export function AddEmployeeModal() {
    const [isAddingEmployee, setIsAddingEmployee] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<AddEmployee>({
        employeeName: "",
        employeeTypeID: "",
        employeeDepartmentID: "",
        employeePhone: "",
        employeeStatusID: "",
        employeeEmail: "",
        password: "",
        confirmPassword: ""
    });

    const queryClient = useQueryClient();


    const { data: departments2, isError: isDepartments2Error, error: departments2Error, isLoading: isLoadingDepartments2 } = useQuery({
        queryKey: [queryKeysService.DEPARTMENTS],
        queryFn: () => departmentsService.getDepartments()
    });
    const { data: statuses, isError: isStatusError, error: statusError, isLoading: isLoadingStatuses } = useQuery({
        queryKey: [queryKeysService.TASK_STATUSES],
        queryFn: () => userStatusesService.getUsersStatus()
    });
    const { data: userTypes, isError: isEmployeeTypeError, error: employeeTypeError, isLoading: isLoadingEmployeeTypes } = useQuery({
        queryKey: [queryKeysService.USER_TYPES],
        queryFn: () => userTypesService.getUserTypes()
    });


    const statusesToRender = statuses ? statuses.data.map((status: EmployeeStatus) => ({
        itemValue: status.userStatusID,
        itemText: status.userStatus,
    })) : []; // Fallback to empty array



    const userTypesToRender = userTypes ? userTypes.data.map((userType: UserType) => ({
        itemValue: userType.userTypeID,
        itemText: userType.userType,
    }))
        : []; // fallback to empty array

    const departmentsToRender = departments2 ? departments2.data.map((department: Department) => ({
        itemValue: department.departmentID,
        itemText: department.departmentName,
        helpVariable: department.parentID,
    }))
        : []; // fallback to empty array


    const addEmployeeMutation = useMutation({

        mutationFn: () => {
            const employeeData = {
                "fullName": formState.employeeName,
                "email": formState.employeeEmail,
                "phone1": formState.employeePhone,
                "phone2": "",
                "pwdHash": formState.password,
                "userType": {
                    "userTypeID": +formState.employeeTypeID,

                },
                "userStatus": {
                    "userStatusID": +formState.employeeStatusID,
                },
                "departmentID": +formState.employeeDepartmentID,
            };




            return employeesService.addEmployee(employeeData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.USERS] });
            toastService.showToast(setToastProps, 'User added successfully!', "success");

            setFormState({
                employeeName: "",
                employeeTypeID: "",
                employeeDepartmentID: "",
                employeePhone: "",
                employeeStatusID: "",
                employeeEmail: "",
                password: "",
                confirmPassword: ""
            }); // Reset form after success

        },
        onError: (error) => {
            // console.error("Error adding employee:", error);
            if (error.statusCode === 404) {
                toastService.showToast(setToastProps, 'Error adding user. User already exists.', "destructive");
            } else {

                toastService.showToast(setToastProps, 'Error adding user. Please try again.', "destructive");
            }
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsAddingEmployee(false);
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
            // Validate form data
            employeeSchema.parse(formState);
            setIsAddingEmployee(true);
            await addEmployeeMutation.mutate();

        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => err.message).join(", ");
                toastService.showToast(setToastProps, errorMessages, "destructive");
            }
        }
    }

    if (isDepartments2Error) {
        console.error("Error fetching departments:", departments2Error);
        return <ErrorPage />;
    }
    if (isStatusError) {
        console.error("Error fetching statuses:", statusError);
        return <ErrorPage />;
    }
    if (isEmployeeTypeError) {
        console.error("Error fetching employee types:", employeeTypeError);
        return <ErrorPage />;
    }
    if (isLoadingDepartments2 || isLoadingStatuses || !departments2 || !statuses || !userTypes || isLoadingEmployeeTypes) {
        return null;
    }

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => setIsDialogOpen(true)}>Add new</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add new user</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeeName" className="text-left required-input-style">
                                Name *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="User Name"
                                inputValue={formState.employeeName}
                                inputType="text"
                                name="employeeName"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeeTypeID" className="text-left required-input-style">
                                Employee type *
                            </Label>
                            <SelectEmployeeType
                                dataToRender={userTypesToRender}
                                handleEmployeeTypeSelect={(typeID: string) =>
                                    setFormState((prevState) => ({
                                        ...prevState,
                                        employeeTypeID: typeID,
                                    }))
                                }
                                selectedValue={formState.employeeTypeID}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeeTypeID" className="text-left required-input-style">
                                Department *
                            </Label>
                            <SelectEmployeeDepartment
                                dataToRender={departmentsToRender}
                                handleDepartmentTypeSelect={(departmentID: string) =>
                                    setFormState((prevState) => ({
                                        ...prevState,
                                        employeeDepartmentID: departmentID,
                                    }))
                                }
                                selectedValue={formState.employeeDepartmentID}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeeStatus" className="text-left required-input-style">
                                Status *
                            </Label>
                            <SelectEmployeeStatus


                                dataToRender={statusesToRender}
                                handleStatusSelect={(statusID: string) =>
                                    setFormState((prevState) => ({
                                        ...prevState,
                                        employeeStatusID: statusID,
                                    }))
                                }
                                selectedValue={formState.employeeStatusID}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeePhone" className="text-left required-input-style">
                                Phone *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Phone"
                                inputValue={formState.employeePhone}
                                inputType="text"
                                name="employeePhone"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeeEmail" className="text-left required-input-style">
                                Email *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Email"
                                inputValue={formState.employeeEmail}
                                inputType="email"
                                name="employeeEmail"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-left required-input-style">
                                Password *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Password"
                                inputValue={formState.password ?? ""}
                                inputType="password"
                                name="password"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="confirmPassword" className="text-left required-input-style">
                                Confirm Password *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Confirm Password"
                                inputValue={formState.confirmPassword ?? ""}
                                inputType="password"
                                name="confirmPassword"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                    </div>
                    <ButtonComponent
                        buttonText="Save"
                        buttonTextWhenLoading="Saving..."
                        isLoading={isAddingEmployee}
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
