import { animateValue, motion } from 'framer-motion';
const GeometricExpansion = ({ delay = 0 }) => (
        <motion.div className="flex justify-center items-center py-12">
        <div className="flex items-center space-x-4">
            <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            className="w-16 h-px bg-gradient-to-r from-transparent to-accent origin-right"
            />
            
            <motion.div
            initial={{ scale: 0, rotate: 0 }}
            whileInView={{ scale: 1, rotate: 45 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: delay + 0.2, ease: "easeOut" }}
            className="w-3 h-3 border-2 border-accent transform rotate-45"
            />
            
            <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay + 0.1, ease: "easeOut" }}
            className="w-16 h-px bg-gradient-to-l from-transparent to-accent origin-left"
            />
        </div>
        </motion.div>
    );
export default GeometricExpansion