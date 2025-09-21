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

import { EditUserType } from "../../types/commonTypes/commonTypes";
import { z } from "zod";
import { userTypesService } from "../../services/userTypes.service";
import { queryKeysService } from "../../services/queryKeys.service";

// Define validation schema with Zod
const userTypeSchema = z.object({
    userType: z.string().min(1, { message: "User type is required" }),

});

interface EditUserTypeModalProps {
    readonly userTypeData: EditUserType;
}

export function EditUserTypeModal({ userTypeData }: EditUserTypeModalProps) {
    const [isUpdatingType, setIsUpdatingType] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<EditUserType>({
        userTypeID: userTypeData.userTypeID,
        userType: userTypeData.userType,

    });

    const queryClient = useQueryClient();



    const updateUserTypeMutation = useMutation({
        mutationFn: () => {
            const userTypeData = {
                "userType": formState.userType,


            };

            return userTypesService.editUserType(userTypeData, formState.userTypeID);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.USER_TYPES] });
            toastService.showToast(setToastProps, 'User type updated successfully!', "success");
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error updating user type. Please try again.', "destructive");
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
            userTypeID: userTypeData.userTypeID,
            userType: userTypeData.userType,

        });
    }, [userTypeData]);


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
            userTypeSchema.parse(formState);
            setIsUpdatingType(true);
            updateUserTypeMutation.mutate();
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
                        <DialogTitle>Edit type</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="userType" className="text-left required-input-style">
                                User type *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Task type"
                                inputValue={formState.userType}
                                inputType="text"
                                name="userType"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
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
