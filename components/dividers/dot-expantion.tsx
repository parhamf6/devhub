import { animateValue, motion } from 'framer-motion';

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
                className="w-2 h-2 bg-accent rounded-full"
            />
            ))}
        </div>
        </motion.div>
    );

export default DotExpansion