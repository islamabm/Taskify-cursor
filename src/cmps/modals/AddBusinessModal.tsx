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
import { AddBusinessModalState } from "../../types/commonTypes/commonTypes";
import { businessService } from "../../services/businesses.service";
import { queryKeysService } from "../../services/queryKeys.service";

const businessSchema = z.object({
    marketName: z.string().min(1, { message: "Business name is required" }),
    HaatBussID: z.number().positive({ message: "Haat business ID must be a positive number" }).nonnegative({ message: "Haat business ID cannot be 0 or negative" }),
});

export function AddBusinessModal() {
    const [isAddingBusiness, setIsAddingBusiness] = useState(false);
    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);

    const initialState = {
        marketName: "",
        marketNameAr: "",
        phone1: "",
        phone2: "",
        phone3: "",
        phone4: "",
        logoURL: "",
        HaatBussID: 0,
    };

    const [formState, setFormState] = useState<AddBusinessModalState>(initialState);

    const queryClient = useQueryClient();
    const addBusinessMutation = useMutation({
        mutationFn: () => {
            const businessData = {
                marketName: formState.marketName,
                marketNameAr: formState.marketNameAr,
                phone1: formState.phone1,
                phone2: formState.phone2,
                phone3: formState.phone3,
                phone4: formState.phone4,
                logoURL: formState.logoURL,
                HaatBussID: formState.HaatBussID,
            };

            return businessService.insertBusiness(businessData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeysService.BUSINESSES] });
            toastService.showToast(setToastProps, 'Business added successfully!', "success");
            setFormState(initialState); // Reset form state
        },
        onError: () => {
            toastService.showToast(setToastProps, 'Error adding business. Please try again.', "destructive");
        },
        onSettled: () => {
            setIsDialogOpen(false);
            setIsAddingBusiness(false);
        }
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: name === "HaatBussID" ? parseInt(value, 10) || 0 : value,
        }));
    }

    async function handleSubmit() {
        try {
            businessSchema.parse(formState);
            setIsAddingBusiness(true);
            await addBusinessMutation.mutate();
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
                        <DialogTitle>Add New Business</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="marketName" className="text-left required-input-style">
                                Business Name (EN) *
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
                            <Label htmlFor="HaatBussID" className="text-left required-input-style">
                                Haat Business ID *
                            </Label>
                            <BasicInput
                                inputPlaceHolder="Business ID"
                                inputValue={formState.HaatBussID + ''}
                                inputType="number"
                                name="HaatBussID"
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


                    </div>

                    <ButtonComponent
                        buttonText="Save"
                        buttonTextWhenLoading="Saving..."
                        isLoading={isAddingBusiness}
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
