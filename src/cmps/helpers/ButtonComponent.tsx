import { Button } from '../../components/ui/button'
import React from 'react'
import ButtonsLoader from './ButtonsLoader'

interface ButtonComponentProps {
    readonly buttonText: string
    readonly buttonTextWhenLoading?: string
    readonly isLoading: boolean
    readonly showButtonTextWhenLoading?: boolean
    readonly onClick: () => void
}

export function ButtonComponent({ buttonText, isLoading, buttonTextWhenLoading, showButtonTextWhenLoading, onClick }: ButtonComponentProps) {
    return (
        <Button className='flex items-center gap-3' disabled={isLoading} onClick={onClick}>{showButtonTextWhenLoading && isLoading ? buttonTextWhenLoading : buttonText}
            {isLoading && <ButtonsLoader />}
        </Button>
    )
}


