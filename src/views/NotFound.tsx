import React from 'react';
import { NotFoundImage } from '../cmps/notFound/NotFoundImage';
import { NotFoundTitle } from '../cmps/notFound/NotFoundTitle';
import NotFoundParagraphs from '../cmps/notFound/NotFoundParagraphs';
import { NotFoundBtns } from '../cmps/notFound/NotFoundBtns';
import transition from "../transition"




function NotFound() {
    return (
        <div className='flex items-center justify-center'>
            <div className="flex flex-col items-center">
                <NotFoundImage />
                <NotFoundTitle />
                <NotFoundParagraphs />
                <NotFoundBtns />
            </div>

        </div>
    );
}

export default transition(NotFound);