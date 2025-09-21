import React from 'react'
import { Icon } from './Icon'

export default function ScrollToTopCmp() {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-1000"
            aria-label="Scroll to top"
        >
            <Icon name='ArrowUpToLine' />
        </button>
    )
}
