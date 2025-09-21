import React from 'react'
import { ImageComponent } from '../helpers/ImageComponent'

// Constants for static values
const LOGO_URL = 'https://haatdaas.lan-wan.net/daas/images/drLogo.png'
const LOGO_WIDTH = 80
const LOGO_HEIGHT = 80
const LOGO_ALT = 'Company Logo'

// Define class names as strings
const DIV_CLASS_NAME = ['flex items-center']
const IMG_CLASS_NAME = ['rounded-full']

const AppHeaderLogoComponent = () => {
    return (
        <ImageComponent
            src={LOGO_URL}
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            alt={LOGO_ALT}
            imgClassName={IMG_CLASS_NAME}
            divClassName={DIV_CLASS_NAME}
        />
    )
}

// Exporting memoized component to prevent unnecessary re-renders
export default (AppHeaderLogoComponent)
