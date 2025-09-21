import React from 'react'
import BtnsList from '../helpers/btns/BtnsList'
import { routeService } from '../../services/route.service';

export function NotFoundBtns() {
    const btnsArr = [
        { domName: "Tasks", routeName: routeService.TASKS },
        { domName: "Home", routeName: routeService.HOME },
    ]
    return (
        <div className='mt-4'>
            <BtnsList btnsArr={btnsArr} divClassName='flex items-center gap-4' />
        </div>
    )
}
