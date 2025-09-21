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
import SelectEmployeeStatus from "../Selects/SelectEmployeeStatus";
import { employeesService } from "../../services/employees.service";
import ErrorPage from "../ErrorPage";
import { EditEmployee, EmployeeStatus, SubDepartment, TaskType, UserType } from "../../types/commonTypes/commonTypes";
import { z } from "zod";
import SelectDepartmentAndSub from "../Selects/SelectDepartmentAndSub";
import SelectEmployeeType from "../Selects/SelectEmployeeType";
import { departmentsService } from "../../services/departments.service";
import { userStatusesService } from "../../services/userStatuses.service";
import { userTypesService } from "../../services/userTypes.service";
import SelectEmployeeDepartment from "../Selects/SelectEmployeeDepartment";
import { queryKeysService } from "../../services/queryKeys.service";

// Define validation schema with Zod
const employeeSchema = z.object({
    employeeName: z.string().min(1, { message: "Name is required" }),
    employeeDepartmentID: z.string().min(1, { message: "Department is required" }),
    employeeStatusID: z.string().min(1, { message: "Status is required" }),
    employeePhone: z.string().min(1, { message: "Phone is required" }),
    employeeEmail: z.string().email({ message: "Please enter a valid email" }),
});

interface EditEmployeeModalProps {
    readonly employeeData: EditEmployee;
}

export function EditEmployeeModal({ employeeData }: EditEmployeeModalProps) {

    const [isUpdatingEmployee, setIsUpdatingEmployee] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);
    const [formState, setFormState] = useState<EditEmployee>({
        userID: employeeData.userID,
        fullName: employeeData.fullName,
        phone1: employeeData.phone1,
        // employeeDepartment: employeeData.employeeDepartment,
        departmentID: employeeData.departmentID,

        // employeeStatus: employeeData.employeeStatus,
        userStatusID: employeeData.userStatusID,
        userTypeID: employeeData.userTypeID,
        email: employeeData.email,
    });

    const queryClient = useQueryClient();


    const { data: statuses, isError: isStatusError, error: statusError, isLoading: isLoadingStatuses } = useQuery({
        queryKey: [queryKeysService.USER_STATUSES],
        queryFn: () => userStatusesService.getUsersStatus()
    });
    const { data: userTypes, isError: isEmployeeTypeError, error: employeeTypeError, isLoading: isLoadingEmployeeTypes } = useQuery({
        queryKey: [queryKeysService.USER_TYPES],
        queryFn: () => userTypesService.getUserTypes()
    });

    const { data: departments2, isError: isDepartments2Error, error: departments2Error, isLoading: isLoadingDepartments2 } = useQuery({
        queryKey: [queryKeysService.DEPARTMENTS],
        queryFn: () => departmentsService.getDepartments()
    });
    const statusesToRender = statuses
        ? statuses.data.map((status: EmployeeStatus) => ({
            itemValue: status.userStatusID,
            itemText: status.userStatus,
        }))
        : []; // fallback to empty array
    const userTypesToRender = userTypes
        ? userTypes.data.map((userType: UserType) => ({
            itemValue: userType.userTypeID,
            itemText: userType.userType,
        }))


        : []; // fallback to empty array

    const departmentsToRender = departments2
        ? departments2.data.map((department) => ({
            itemValue: department.departmentID,
            itemText: department.departmentName,
            helpVariable: department.parentID,
        }))


        : []; // fallback to empty array


    const updateEmployeeMutation = useMutation({
        mutationFn: () => {
            const employeeData = {
                // "userID": formState.employeeID,
                "fullName": formState.fullName,
                "email": formState.email,
                "phone1": formState.phone1,
                "phone2": "string",
                // "pwdHash": formState.password,
                "userType": {
                    "userTypeID": +formState.userTypeID,
                    // "userType": "string"
                },
                "userStatus": {
                    "userStatusID": +formState.userStatusID,
                    // "userStatus": "string"
                },
                "departmentID": +formState.departmentID,

            };

            return employeesService.editEmployee(employeeData, +formState.userID);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.USERS] });
            toastService.showToast(setToastProps, 'User updated successfully!', "success");
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error adding user. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsUpdatingEmployee(false);
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Update form state when employeeData changes
        setFormState({
            userID: employeeData.userID,
            fullName: employeeData.fullName,
            phone1: employeeData.phone1,
            // employeeDepartment: employeeData.employeeDepartment,
            departmentID: employeeData.departmentID,

            // employeeStatus: employeeData.employeeStatus,
            userStatusID: employeeData.userStatusID,
            userTypeID: employeeData.userTypeID,
            email: employeeData.email,
        });
    }, [employeeData]);



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
            // employeeSchema.parse(formState);
            setIsUpdatingEmployee(true);
            updateEmployeeMutation.mutate();
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

    if (isLoadingDepartments2 || isLoadingStatuses || !statuses || !userTypes || isLoadingEmployeeTypes) {
        return null; // Optionally, add a loading indicator here
    }
    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <IconWithTooltip iconName="Pencil" tooltipTitle="Edit" onClick={() => setIsDialogOpen(true)} />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit user</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeeName" className="text-left required-input-style">
                                Name *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="User name"
                                inputValue={formState.fullName}
                                inputType="text"
                                name="employeeName"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone1" className="text-left required-input-style">
                                Phone *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Phone"
                                inputValue={formState.phone1}
                                inputType="text"
                                name="phone1"
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
                                inputValue={formState.email}
                                inputType="email"
                                name="employeeEmail"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>


                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeeTypeID" className="text-left required-input-style">
                                Department  *                           </Label>

                            <SelectEmployeeDepartment
                                dataToRender={departmentsToRender}
                                handleDepartmentTypeSelect={(departmentID: string) =>
                                    setFormState((prevState) => ({
                                        ...prevState,
                                        departmentID: departmentID,
                                    }))
                                }
                                selectedValue={formState.departmentID}
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
                                        userStatusID: statusID,
                                    }))
                                }
                                selectedValue={formState.userStatusID}
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
                                selectedValue={formState.userTypeID}
                            />
                        </div>




                    </div>
                    <ButtonComponent
                        buttonText="Save changes"
                        buttonTextWhenLoading="Saving changes..."
                        isLoading={isUpdatingEmployee}
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
