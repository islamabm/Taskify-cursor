import React from 'react'
import { ImageComponent } from '../helpers/ImageComponent'




interface LoginHeaderAndLogoProps {
    readonly logoSrc: string;
    readonly logoName: string;
}

export default function LoginHeaderAndLogo({ logoSrc, logoName }: LoginHeaderAndLogoProps) {

    const divClassName = ['flex', 'items-center']
    const imgClassName = ['rounded-full', '']

    return (
        <div className=" mb-8 flex items-center justify-center flex-col gap-2">
            <div className="w-10 h-10">
                <ImageComponent src={logoSrc} width={50} height={50} alt="Logo-image" imgClassName={imgClassName} divClassName={divClassName} />
            </div>
            <h1 className="text-3xl font-bold  mb-2">{logoName}</h1>
            <h2 className="text-xl font-semibold text-foreground mb-2">Log in to your account</h2>
            <p className="text-muted-foreground">Welcome Back! Please enter your details</p>
        </div>
    )
}
