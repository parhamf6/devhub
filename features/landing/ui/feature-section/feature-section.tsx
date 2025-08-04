import { AnimatedText } from "../../../../components/text-animation/underline-text";
import BentoGrid1 from "../../components/bento-grid";
import FAQCTA from "./components/faq-button";


export default function FeatureSection() {
    return(
        <div className="flex gap-4 p-4 m-2 flex-col"  id="features">
            <div className="flex flex-wrap gap-8 items-center justify-center p-4 mt-4">
                <div className="flex flex-wrap gap-4 items-center justify-center text-center text-coral">
                    <AnimatedText
                        text="Powerful Features"
                        textClassName="text-2xl font-bold mb-2"
                        underlinePath="M 0,10 Q 75,0 150,10 Q 225,20 300,10"
                        underlineHoverPath="M 0,10 Q 75,20 150,10 Q 225,0 300,10"
                        underlineDuration={1.5}
                    />
                    <h1 className="font-semibold text-lg text-muted-foreground"> to Enhance Your Development Experience</h1>
                </div>
                <div className="">
                    <FAQCTA />
                </div>
            </div>
            <div className="flex flex-wrap gap-4 p-4 items-center justify-center">
                <BentoGrid1/>
            </div>
        </div>
        
    );
}