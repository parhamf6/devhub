import { animateValue, motion } from 'framer-motion';
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
            className="stroke-accent fill-none stroke-2"
        >
            <path d="M 0 10 Q 50 0 100 10 T 200 10" />
        </motion.svg>
        </motion.div>
    );
export default AnimatedWave