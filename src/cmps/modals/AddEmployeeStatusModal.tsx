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
import { AddEmployeeStatusModalState } from "../../types/commonTypes/commonTypes";
import { userStatusesService } from "../../services/userStatuses.service";
import { queryKeysService } from "../../services/queryKeys.service";


const userStatusSchema = z.object({
    userStatus: z.string().min(1, { message: "Status is required" }),

});


export function AddEmployeeStatusModal() {
    const [isAddingEmployeeStatus, setIsAddingEmployeeStatus] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<AddEmployeeStatusModalState>({
        userStatus: "",

    });




    const queryClient = useQueryClient();
    const addUserStatusMutation = useMutation({
        mutationFn: () => {
            const userStatusData = {
                "userStatus": formState.userStatus,


            };

            return userStatusesService.insertUserStatus(userStatusData);
        }, onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.USER_STATUSES] });
            toastService.showToast(setToastProps, 'Status added successfully!', "success");
            setFormState({
                userStatus: "",

            }); // Reset form after success
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error adding status. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsAddingEmployeeStatus(false);
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
            userStatusSchema.parse(formState); // Validate form data
            setIsAddingEmployeeStatus(true);
            await addUserStatusMutation.mutate();


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
                        <DialogTitle>Add New status</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="userStatus" className="text-left required-input-style">
                                Task title *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Task title"
                                inputValue={formState.userStatus}
                                inputType="text"
                                name="userStatus"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                    </div>
                    <ButtonComponent
                        buttonText="Save"
                        buttonTextWhenLoading="Saving..."
                        isLoading={isAddingEmployeeStatus}
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
