import React, { useEffect, useState } from 'react';
import { animateValue, motion } from 'framer-motion';

const AnimatedDividers = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

  // Divider 1: Expanding line with glow
    const ExpandingLine = ({ delay = 0 }) => (
        <motion.div className="flex justify-center items-center py-12">
        <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "100%", opacity: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.5, delay, ease: "easeOut" }}
            className="relative h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        >
            <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay + 0.5 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"
            />
        </motion.div>
        </motion.div>
    );

  // Divider 2: Dots expanding from center
    const DotExpansion = ({ delay = 0 }) => (
        <motion.div className="flex justify-center items-center py-12">
        <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ 
                duration: 0.5, 
                delay: delay + Math.abs(i - 2) * 0.1,
                ease: "easeOut"
                }}
                className="w-2 h-2 bg-blue-500 rounded-full"
            />
            ))}
        </div>
        </motion.div>
    );

  // Divider 3: Animated wave
    const AnimatedWave = ({ delay = 0 }) => (
        <motion.div className="flex justify-center items-center py-12">
        <motion.svg
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay, ease: "easeInOut" }}
            width="200" 
            height="20" 
            viewBox="0 0 200 20"
            className="stroke-blue-500 fill-none stroke-2"
        >
            <path d="M 0 10 Q 50 0 100 10 T 200 10" />
        </motion.svg>
        </motion.div>
    );

  // Divider 4: Expanding from center with sparkle effect
    const SparkleExpansion = ({ delay = 0 }) => (
        <motion.div className="flex justify-center items-center py-12 relative">
        <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay, ease: "easeOut" }}
            className="w-64 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent origin-center"
        />
        
      {/* Sparkle effects */}
        {[...Array(3)].map((_, i) => (
            <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 180 }}
            viewport={{ once: true }}
            transition={{ 
                duration: 0.8, 
                delay: delay + 0.3 + i * 0.1,
                ease: "easeOut"
            }}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
                left: `${40 + i * 10}%`,
                top: '50%',
                transform: 'translateY(-50%)'
            }}
            />
        ))}
        </motion.div>
    );

  // Divider 5: Geometric expansion
    const GeometricExpansion = ({ delay = 0 }) => (
        <motion.div className="flex justify-center items-center py-12">
        <div className="flex items-center space-x-4">
            <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            className="w-16 h-px bg-gradient-to-r from-transparent to-blue-500 origin-right"
            />
            
            <motion.div
            initial={{ scale: 0, rotate: 0 }}
            whileInView={{ scale: 1, rotate: 45 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: delay + 0.2, ease: "easeOut" }}
            className="w-3 h-3 border-2 border-blue-500 transform rotate-45"
            />
            
            <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay + 0.1, ease: "easeOut" }}
            className="w-16 h-px bg-gradient-to-l from-transparent to-blue-500 origin-left"
            />
        </div>
        </motion.div>
    );

  // Divider 6: Pulse wave
    const PulseWave = ({ delay = 0 }) => (
        <motion.div className="flex justify-center items-center py-12">
        <div className="flex items-center space-x-1">
            {[...Array(20)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ scaleY: 0, opacity: 0 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ 
                duration: 0.5, 
                delay: delay + i * 0.05,
                ease: "easeOut"
                }}
                className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 origin-bottom"
                style={{
                height: `${Math.sin(i * 0.5) * 10 + 12}px`
                }}
            />
            ))}
        </div>
        </motion.div>
    );
};

export default AnimatedDividers