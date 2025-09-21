import { Textarea } from '../../components/ui/textarea';
import React from 'react';

interface BasicTextAreaProps {
    readonly textAreaPlaceHolder: string;
    readonly textAreaValue: string;
    readonly onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function BasicTextArea({ textAreaPlaceHolder, textAreaValue, onChange }: BasicTextAreaProps) {
    return (
        <Textarea
            placeholder={textAreaPlaceHolder}
            value={textAreaValue}
            onChange={onChange}
            autoComplete="off"
        />
    );
}
