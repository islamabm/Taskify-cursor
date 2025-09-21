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
import { AddUserTypeModalState } from "../../types/commonTypes/commonTypes";
import { userTypesService } from "../../services/userTypes.service";
import { queryKeysService } from "../../services/queryKeys.service";


// Validation schema for task fields
const userTypeSchema = z.object({
    userTypeName: z.string().min(1, { message: "User type is required" }),

});

interface AddUserTypeModalProps { }

export function AddUserTypeModal({ }: AddUserTypeModalProps) {
    const [isAddingType, setIsAddingType] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<AddUserTypeModalState>({
        userTypeName: "",

    });




    const queryClient = useQueryClient();
    const addUserTypeMutation = useMutation({
        mutationFn: () => {
            const userTypeData = {
                "userType": formState.userTypeName,



            };

            return userTypesService.insertUserType(userTypeData);

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.USER_TYPES] });
            toastService.showToast(setToastProps, 'User type added successfully!', "success");
            setFormState({ userTypeName: "" }); // Reset form after success

        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error adding user type. Please try again.', "destructive");
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
            userTypeSchema.parse(formState); // Validate form data
            setIsAddingType(true);
            addUserTypeMutation.mutate();
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
                        <DialogTitle>Add New type</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="userTypeName" className="text-left">
                                User type
                            </Label>
                            <BasicInput
                                inputPlaceHolder="User type"
                                inputValue={formState.userTypeName}
                                inputType="text"
                                name="userTypeName"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
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
