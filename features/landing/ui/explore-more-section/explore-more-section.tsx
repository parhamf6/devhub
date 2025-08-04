import { AnimatedText } from "../../../../components/text-animation/underline-text";
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';


export default function ExploreMoreSection() {
    return(
        <div className="flex gap-4 p-4 m-2 flex-wrap flex-col items-center justify-center" >
            <div className="flex flex-wrap gap-8 items-center justify-center p-4 mt-4">
                <div className="flex flex-wrap gap-4 items-center justify-center text-center text-indigo">
                    <AnimatedText
                        text="Explore More In the world of Devhub"
                        textClassName="text-2xl font-bold mb-2"
                        underlinePath="M 0,10 Q 75,0 150,10 Q 225,20 300,10"
                        underlineHoverPath="M 0,10 Q 75,20 150,10 Q 225,0 300,10"
                        underlineDuration={1.5}
                    />
                </div>
                <motion.a
                        href="#FAQ"
                        whileHover={{ x: 4 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className=" flex items-center border-2 gap-2 rounded-2xl  px-6 py-3 text-lg font-semibold text-secondary bg-primary   shadow-md transition-colors"
                    >
                        Learn More
                        <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </motion.a>
            </div>
            <div className="flex flex-wrap gap-8 items-center justify-center p-4 mt-4">
                <div className="flex flex-wrap gap-4 items-center justify-center text-center text-pink">
                    <AnimatedText
                        text="Or Help us to grow"
                        textClassName="text-2xl font-bold mb-2"
                        underlinePath="M 0,10 Q 75,0 150,10 Q 225,20 300,10"
                        underlineHoverPath="M 0,10 Q 75,20 150,10 Q 225,0 300,10"
                        underlineDuration={1.5}
                    />
                </div>
                <motion.a
                        href="support"
                        whileHover={{ x: 4 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className=" flex items-center border-2 gap-2 rounded-2xl  px-6 py-3 text-lg font-semibold text-primary bg-secondary  shadow-md transition-colors"
                    >
                        Support Us
                        <ChevronRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </motion.a>
            </div>
        </div>
    );
}