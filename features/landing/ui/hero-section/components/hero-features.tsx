import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useInView, animate } from 'framer-motion';

// Array of stats to display
const stats = [
  { end: 54, suffix: '%', label: 'Faster Productivity' },
  { end: 20, suffix: '+', label: 'Integrated Tools' },
  { end: 99.9, suffix: '%', label: 'Uptime' },
];

export default function FeaturesSide() {
    return (
        <div className="py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
            <StatItem
                key={stat.label}
                end={stat.end}
                suffix={stat.suffix}
                label={stat.label}
            />
            ))}
        </div>
        </div>
    );
}

const StatItem = ({
    end,
    suffix,
    label,
    }: {
    end: number;
    suffix: string;
    label: string;
    }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    const motionVal = useMotionValue(0);
    const spring = useSpring(motionVal, { stiffness: 100, damping: 20 });
    const [display, setDisplay] = React.useState(0);

    useEffect(() => {
        if (inView) {
        motionVal.set(0);
        animate(motionVal, end, { duration: 2 });
        }
    }, [inView, end, motionVal]);

    useEffect(() => {
        const unsubscribe = spring.on('change', (latest) => {
        const value = end % 1 !== 0 ? latest.toFixed(1) : Math.round(latest);
        setDisplay(parseFloat(value));
        });
        return () => unsubscribe();
    }, [spring, end]);

    return (
        <div ref={ref}>
        <motion.div className="text-4xl font-bold">
            {display}
            {suffix}
        </motion.div>
        <div className="mt-2 text-sm">{label}</div>
        </div>
    );
};
