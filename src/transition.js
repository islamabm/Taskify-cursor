import React from 'react';
import { motion } from 'framer-motion';

const transition = (OgComponent) => {
    return (props) => (
        <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 1 }}
        >
            <OgComponent {...props} />
        </motion.div>
    );
};

export default transition;
