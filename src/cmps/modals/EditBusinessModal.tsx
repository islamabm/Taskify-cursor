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

import { EditBusinessModalState } from "../../types/commonTypes/commonTypes";
import { z } from "zod";
import { businessService } from "../../services/businesses.service";
import { queryKeysService } from "../../services/queryKeys.service";

// Define validation schema with Zod
const businessSchema = z.object({
    marketName: z.string().min(1, { message: "Business name is required" }),
    HaatBussID: z.number().min(1, { message: "Haat Business ID must be a positive number" }),
});

interface EditBusinessModalProps {
    readonly businessData: EditBusinessModalState;
}

export function EditBusinessModal({ businessData }: EditBusinessModalProps) {
    const [isUpdatingBusiness, setIsUpdatingBusiness] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const [formState, setFormState] = useState<EditBusinessModalState>({
        marketName: businessData.marketName,
        HaatBussID: businessData.HaatBussID,
        marketID: businessData.marketID,
        phone1: businessData.phone1,
        phone2: businessData.phone2,
        phone3: businessData.phone3,
        phone4: businessData.phone4,
        marketNameAr: businessData.marketNameAr,
        logoURL: businessData.logoURL,
    });

    const queryClient = useQueryClient();

    const updateBusinessMutation = useMutation({
        mutationFn: () => {
            const updatedBusinessData = {
                "marketName": formState.marketName,
                "HaatBussID": formState.HaatBussID,
                "phone1": formState.phone1,
                "phone2": formState.phone2,
                "phone3": formState.phone3,
                "phone4": formState.phone4,
                "marketNameAr": formState.marketNameAr,
                "logoURL": formState.logoURL,
            };

            return businessService.editBusiness(updatedBusinessData, +formState.marketID);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.BUSINESSES] });
            toastService.showToast(setToastProps, 'Business updated successfully!', "success");
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error updating business. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsUpdatingBusiness(false);
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Update form state when businessData changes
        setFormState({
            marketName: businessData.marketName,
            HaatBussID: businessData.HaatBussID,
            marketID: businessData.marketID,
            phone1: businessData.phone1,
            phone2: businessData.phone2,
            phone3: businessData.phone3,
            phone4: businessData.phone4,
            marketNameAr: businessData.marketNameAr,
            logoURL: businessData.logoURL,
        });
    }, [businessData]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: name === "HaatBussID" ? parseInt(value, 10) || 0 : value,
        }));
    }

    async function handleSubmit() {
        try {
            // Validate form data
            businessSchema.parse(formState);
            setIsUpdatingBusiness(true);
            updateBusinessMutation.mutate();
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
                        <DialogTitle>Edit Business</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="marketName" className="text-left">
                                Business Name (EN)
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Business name in English"
                                inputValue={formState.marketName}
                                inputType="text"
                                name="marketName"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="marketNameAr" className="text-left">
                                Business Name (AR)
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Business name in Arabic"
                                inputValue={formState.marketNameAr}
                                inputType="text"
                                name="marketNameAr"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone1" className="text-left">
                                Phone 1
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Phone number 1"
                                inputValue={formState.phone1}
                                inputType="text"
                                name="phone1"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone2" className="text-left">
                                Phone 2
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Phone number 2"
                                inputValue={formState.phone2}
                                inputType="text"
                                name="phone2"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone3" className="text-left">
                                Phone 3
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Phone number 3"
                                inputValue={formState.phone3}
                                inputType="text"
                                name="phone3"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone4" className="text-left">
                                Phone 4
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Phone number 4"
                                inputValue={formState.phone4}
                                inputType="text"
                                name="phone4"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="logoURL" className="text-left">
                                Logo URL
                            </Label>
                            <BasicInput
                                inputPlaceHolder="https://example.com/logo.png"
                                inputValue={formState.logoURL}
                                inputType="text"
                                name="logoURL"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="HaatBussID" className="text-left">
                                Haat Business ID
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Business ID"
                                inputValue={String(formState.HaatBussID)}
                                inputType="number"
                                name="HaatBussID"
                                onChange={handleInputChange}
                                inputClassName="w-[250px]"
                            />
                        </div>

                    </div>
                    <ButtonComponent
                        buttonText="Save changes"
                        buttonTextWhenLoading="Saving changes..."
                        isLoading={isUpdatingBusiness}
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
