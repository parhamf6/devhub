'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function ExploreCTA() {
    return (
        <motion.a
                whileHover={{ x: 4 }}
                href='/dashboard/tools'
                transition={{ type: 'spring', stiffness: 300 }}
                className=" flex items-center border-2 gap-2 rounded-2xl  px-6 py-3 text-lg
                font-semibold text-primary  shadow-md transition-colors"
            >
                Explore Tools
                <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
        </motion.a>
    );
}
