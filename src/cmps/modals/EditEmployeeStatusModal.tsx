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

import { EmployeeStatusEditModalState } from "../../types/commonTypes/commonTypes";
import { z } from "zod";
import { userStatusesService } from "../../services/userStatuses.service";
import { queryKeysService } from "../../services/queryKeys.service";

// Define validation schema with Zod
const userStatusSchema = z.object({
    userStatus: z.string().min(1, { message: "Status title is required" }),

});

interface EditEmployeeStatusModalProps {
    readonly taskStatusData: EmployeeStatusEditModalState;
}

export function EditEmployeeStatusModal({ taskStatusData }: EditEmployeeStatusModalProps) {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<EmployeeStatusEditModalState>({
        userStatusID: taskStatusData.userStatusID,
        userStatus: taskStatusData.userStatus,

    });
    const queryClient = useQueryClient();



    const updateUserStatusMutation = useMutation({
        mutationFn: () => {
            const userStatusData = {
                "userStatus": formState.userStatus,
            };

            return userStatusesService.editUserStatus(userStatusData, +formState.userStatusID)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.USER_STATUSES] });
            toastService.showToast(setToastProps, 'User status edited successfully!', "success");
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error editing user status. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsUpdatingStatus(false);
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Update form state when employeeData changes
        setFormState({
            userStatusID: taskStatusData.userStatusID,
            userStatus: taskStatusData.userStatus,

        });
    }, [taskStatusData]);


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
            userStatusSchema.parse(formState);
            setIsUpdatingStatus(true);
            updateUserStatusMutation.mutate();
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
                        <DialogTitle>Edit status</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="userStatus" className="text-left required-input-style">
                                Status title *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Status title"
                                inputValue={formState.userStatus}
                                inputType="text"
                                name="userStatus"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>


                    </div>
                    <ButtonComponent
                        buttonText="Save changes"
                        buttonTextWhenLoading="Saving changes..."
                        isLoading={isUpdatingStatus}
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
