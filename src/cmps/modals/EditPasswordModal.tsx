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
import { z } from "zod";
import { employeesService } from "../../services/employees.service";
import { queryKeysService } from "../../services/queryKeys.service";


// Define validation schema with Zod
const employeePasswordSchema = z.object({
    // currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password and confirm password must match",
    path: ["confirmNewPassword"], // specify which field the error applies to
});

interface EditPasswordModalProps {
    readonly userID: number;
}

export function EditPasswordModal({ userID }: EditPasswordModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);
    const [formState, setFormState] = useState({
        userID: userID,
        currentPassword: " ",
        newPassword: " ",
        confirmNewPassword: " ",
    });
    useEffect(() => {
        // Update form state when employeeData changes
        setFormState({
            userID: userID,
            currentPassword: " ",
            newPassword: " ",
            confirmNewPassword: " ",
        });
    }, [userID]);


    const queryClient = useQueryClient();


    const updateEmployeePasswordMutation = useMutation({
        mutationFn: () => {
            const employeeData = {
                // "userID": formState.userID,
                // "oldPwd": formState.currentPassword,
                "pwdHash": formState.newPassword,

            };

            return employeesService.changeEmployeePassword(employeeData, +formState.userID);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.USERS] });
            toastService.showToast(setToastProps, 'User password updated successfully!', "success");
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error adding user. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsSubmitting(false);
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
            employeePasswordSchema.parse(formState);
            setIsSubmitting(true);
            updateEmployeePasswordMutation.mutate();
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
                    <IconWithTooltip iconName="Lock" tooltipTitle="Edit password" onClick={() => setIsDialogOpen(true)} />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">



                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="newPassword" className="text-left required-input-style">
                                New password *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="New password"
                                inputValue={formState.newPassword}
                                inputType="password"
                                name="newPassword"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="confirmNewPassword" className="text-left required-input-style">
                                Confirm Password *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Confirm Password"
                                inputValue={formState.confirmNewPassword}
                                inputType="password"
                                name="confirmNewPassword"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>
                    </div>
                    <ButtonComponent
                        buttonText="Save changes"
                        buttonTextWhenLoading="Saving changes..."
                        isLoading={isSubmitting}
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
