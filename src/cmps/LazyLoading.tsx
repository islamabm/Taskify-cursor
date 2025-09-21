import React from 'react'
import { ColorsHeader } from './helpers/ColorsHeader'
import { LazyLoader } from './helpers/lazyloading/LazyLoader'
import { LazyText } from './helpers/lazyloading/LazyText'

function LazyLoading() {
    return (
        <div className='flex flex-col items-center justify-center h-screen space-y-4'>
            <ColorsHeader title="Loading..." />
            <LazyLoader />
            <LazyText />
        </div>
    )
}
export default LazyLoading