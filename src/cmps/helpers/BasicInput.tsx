import { Input } from '../../components/ui/input';
import React from 'react';

interface BasicInputProps {
  readonly inputPlaceHolder: string;
  readonly inputValue: string | number;
  readonly inputType: string;
  readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly name: string;
  readonly inputClassName: string

}

export default function BasicInput({ inputPlaceHolder, inputValue, inputType, onChange, name, inputClassName }: BasicInputProps) {
  return (
    <Input
      type={inputType}
      placeholder={inputPlaceHolder}
      value={inputValue}
      onChange={onChange}
      autoComplete="off"
      name={name}
      className={inputClassName}
    />
  );
}
