import Lottie from 'lottie-react'
import React from 'react'


interface AnimatedCmpProps {
    readonly animatedName: object
}

export function AnimatedCmp({ animatedName }: AnimatedCmpProps) {
    return (
        <Lottie animationData={animatedName} />
    )
}
