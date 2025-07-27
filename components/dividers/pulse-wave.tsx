import { animateValue, motion } from 'framer-motion';
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
export default PulseWave