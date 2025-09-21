import { useState } from "react";

export function useForm(initialFields: { [key: string]: any }) {
    const [fields, setFields] = useState(initialFields);

    function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
        const field = target.name;
        let value = target.type === "checkbox" ? target.checked : target.value;

        setFields((prevFields) => ({ ...prevFields, [field]: value }));
    }

    return [fields, handleChange] as const;
}
