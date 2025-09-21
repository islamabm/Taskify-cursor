import React from 'react';
import BasicInput from '../helpers/BasicInput';
import { Label } from '../../components/ui/label';

interface FormInputsPreviewProps {
    inputPlaceHolder: string;
    inputValue: string;
    inputType: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    isWithLabel?: boolean,
    labelText?: string,
    labelHtmlFor?: string,
    labelClassName?: string,
    inputClassName: string;
}

const FormInputsPreview: React.FC<FormInputsPreviewProps> = ({ inputPlaceHolder, inputValue, inputType, onChange, name, isWithLabel, labelText, labelHtmlFor, inputClassName, labelClassName }) => {
    return (
        <div>
            {isWithLabel && <Label htmlFor={labelHtmlFor} className={labelClassName}>{labelText}</Label>}
            <BasicInput
                inputPlaceHolder={inputPlaceHolder}
                inputValue={inputValue}
                inputType={inputType}
                onChange={onChange}
                name={name}
                inputClassName={inputClassName}
            />
        </div>
    );
}

export default FormInputsPreview;
