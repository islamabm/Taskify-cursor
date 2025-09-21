import React from 'react';
import FormInputsPreview from './FormInputsPreview';

interface FormInputsListProps {
    readonly formInputsData: {
        type: string;
        placeholder: string;
        value: string;
        name: string;
        inputClassName: string
        isWithLabel?: boolean,
        labelText?: string,
        labelHtmlFor?: string,
        labelClassName?: string,
    }[]
    readonly listDiveClassName: string
    readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}



export function FormInputsList({ formInputsData, listDiveClassName, onChange }: FormInputsListProps) {
    return (
        <div className={listDiveClassName}>
            {formInputsData.map((inputData, index) => (
                <FormInputsPreview
                    key={index}
                    inputPlaceHolder={inputData.placeholder}
                    inputValue={inputData.value}
                    inputType={inputData.type}
                    onChange={onChange}
                    name={inputData.name}
                    inputClassName={inputData.inputClassName}
                    isWithLabel={inputData.isWithLabel}
                    labelText={inputData.labelText}
                    labelHtmlFor={inputData.labelHtmlFor}
                    labelClassName={inputData.labelClassName}
                />
            ))}
        </div>
    );
}
