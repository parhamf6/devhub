'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react'; // Optional: you can swap or remove

type Props = {
    onClick?: () => void;
};

const GetStartedButton: React.FC<Props> = ({ onClick }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0px 0px 15px' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={onClick}
            className=" flex items-center border-2 gap-2 rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-background  shadow-md transition-colors"
            >
            Get Started
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            <span className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:ring transition-all"></span>
        </motion.button>
    );
};

export default GetStartedButton;
