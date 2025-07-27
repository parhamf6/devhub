import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useInView, animate } from 'framer-motion';

// Array of stats to display
const stats = [
  { end: 54, suffix: '%', label: 'Faster Productivity' },
  { end: 20, suffix: '+', label: 'Integrated Tools' },
  { end: 99.9, suffix: '%', label: 'Uptime' },
];

export default function FeaturesSide() {
  // Create refs for each stat to detect when in view
    const refs = stats.map(() => useRef(null));
    const inViews = refs.map((ref) => useInView(ref, { once: true, margin: '-100px' }));

    return (
        <div className=" py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat, idx) => (
            <StatItem
                key={stat.label}
                end={stat.end}
                suffix={stat.suffix}
                label={stat.label}
                ref={refs[idx]}
                inView={inViews[idx]}
            />
            ))}
        </div>
        </div>
    );
}

const StatItem = React.forwardRef(
    (
        {
        end,
        suffix,
        label,
        inView,
        }: {
        end: number;
        suffix: string;
        label: string;
        inView: boolean;
        },
        ref: React.Ref<HTMLDivElement>
    ) => {
        // Motion value that will animate from 0 to end
        const motionVal = useMotionValue(0);
        // Spring for smoothness
        const spring = useSpring(motionVal, { stiffness: 100, damping: 20 });
        // State for displayed number
        const [display, setDisplay] = React.useState(0);

        useEffect(() => {
        if (inView) {
            motionVal.set(0);
            animate(motionVal, end, { duration: 2 });
        }
        }, [inView, end, motionVal]);

        // Subscribe to spring updates to update text
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
    }
);
