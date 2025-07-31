"use client"
import DashbaordSection from "@/features/dashboard/dashabord";
import { motion , Variants } from "framer-motion";

export default function DashbaordPage(){
    const fadeUpVariant: Variants = {
        hidden: { 
            opacity: 0, 
            y: 60 
        },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    }
    return(
        // <motion.div
        //     variants={fadeUpVariant}
        //     initial="hidden"
        //     whileInView="visible"
        //     viewport={{ once: true, amount: 0.3 }}
        // >
        //     <DashbaordSection />
        // </motion.div>
        <DashbaordSection />
    )
}