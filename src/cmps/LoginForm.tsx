import React, { useMemo } from 'react';
import { FormInputsList } from './FormInputs/FormInputsList';

interface LoginFormProps {
    username: string;
    password: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
    username,
    password,
    onChange,
}) => {
    const formInputsData =
        useMemo(() =>
            [
                {
                    type: "text",
                    placeholder: "Phone number *",
                    value: username,
                    name: "username",
                    inputClassName: "w-[350px] p-3 border border-border rounded bg-input text-foreground",
                    labelClassName: "block text-foreground mb-2",
                    labelText: "Phone",
                    labelHtmlFor: "phone",
                    isWithLabel: true

                },
                {
                    type: "password",
                    placeholder: "Password *",
                    value: password,
                    name: "password",
                    inputClassName: "w-[350px] p-3 border border-border rounded bg-input text-foreground",
                    labelClassName: "block text-foreground mb-2",
                    labelText: "Password",
                    labelHtmlFor: "password",
                    isWithLabel: true

                }
            ],
            [username, password])

    return (
        <FormInputsList formInputsData={formInputsData} listDiveClassName="flex flex-col items-center gap-4 mb-3" onChange={onChange} />
    );
};

export default LoginForm;
