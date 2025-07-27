import { animateValue, motion } from 'framer-motion';


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

export default ExpandingLine