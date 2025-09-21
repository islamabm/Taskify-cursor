import React, { useState } from 'react'
import { ButtonComponent } from './helpers/ButtonComponent'
import { businessService } from '../services/businesses.service';
import ToastComponent from './helpers/ToastComponent';
import { toastService } from '../services/toast.service';

export default function FetchBusinessesButton() {


    //Loading state for fetch businesses
    const [loadingBusinesses, setLoadingBusinesses] = useState(false);


    const [toastProps, setToastProps] = useState<{
        key: number;
        variant: 'success' | 'destructive';
        title: string;
        description: string;
    } | null>(null);



    async function handleFetchBusinesses() {
        setLoadingBusinesses(true);
        //TODO: Call API to fetch businesses
        try {
            await businessService.updateBusinesses()
            toastService.showToast(setToastProps, "Businesses fetched successfully", "success");
        } catch (error) {
            console.error(error);
            toastService.showToast(setToastProps, "Error fetching businesses", "destructive");
        } finally {

            setLoadingBusinesses(false);
        }
    }




    return (
        <div className='flex justify-center items-center'>
            <ButtonComponent buttonText='Fetch businesses' buttonTextWhenLoading='Loading...' isLoading={loadingBusinesses} showButtonTextWhenLoading={true} onClick={handleFetchBusinesses} />

            {toastProps && (
                <ToastComponent
                    key={toastProps.key}
                    variant={toastProps.variant}
                    title={toastProps.title}
                    description={toastProps.description}
                />
            )}

        </div>

    )
}
