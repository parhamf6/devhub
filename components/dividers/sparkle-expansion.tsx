import { animateValue, motion } from 'framer-motion';
const SparkleExpansion = ({ delay = 0 }) => (
        <motion.div className="flex justify-center items-center py-12 relative">
        <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay, ease: "easeOut" }}
            className="w-64 h-px bg-gradient-to-r from-transparent via-accent to-transparent origin-center"
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
            className="absolute w-1 h-1 bg-accent rounded-full"
            style={{
                left: `${40 + i * 10}%`,
                top: '50%',
                transform: 'translateY(-50%)'
            }}
            />
        ))}
        </motion.div>
    );

export default SparkleExpansion