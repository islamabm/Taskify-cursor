import React from 'react';
import { ImageComponent } from '../helpers/ImageComponent';


interface LoginImageSectionProps {
    readonly imageSrc: string;
}

export default function LoginImageSection({ imageSrc }: LoginImageSectionProps) {
    const divClassName = ['hidden', 'md:block', 'w-1/2', 'h-screen', 'overflow-hidden']
    const imgClassName = ['w-full', 'h-full', 'object-cover']
    return (
        <ImageComponent src={imageSrc} width="50vw" height="100vh" alt="Logo-image" imgClassName={imgClassName} divClassName={divClassName} />

    );
}
