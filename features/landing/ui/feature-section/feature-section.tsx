import ExploreCTA from "./components/explor-button";
import FeatureCardItem from "./components/feature-card";
import { ClipboardCheck, LibraryBig, LayoutDashboard } from "lucide-react";
import { AnimatedText } from "../../../../components/text-animation/underline-text";
import BentoGrid1 from "../../components/bento-grid";


// export default function FeatureSection() {
//     return(
//         <div className="flex gap-4 p-4 m-2 flex-col" >
//             <div className="flex flex-wrap gap-8 items-center justify-center p-4 mt-4">
//                 <div className="flex flex-wrap gap-4 items-center justify-center text-center">
//                     <AnimatedText
//                         text="Powerful Features"
//                         textClassName="text-2xl font-bold mb-2"
//                         underlinePath="M 0,10 Q 75,0 150,10 Q 225,20 300,10"
//                         underlineHoverPath="M 0,10 Q 75,20 150,10 Q 225,0 300,10"
//                         underlineDuration={1.5}
//                     />
//                     <h1 className="font-semibold text-lg text-muted-foreground"> to Enhance Your Development Experience</h1>
//                 </div>
//                 <div className="">
//                     <ExploreCTA />
//                 </div>
//             </div>
//             <div className="flex flex-wrap gap-4 p-4 items-center justify-center">
//                 <FeatureCardItem
//                     icon={<ClipboardCheck size={48} />}
//                     title="Manage Your Tasks in the Easy Way"
//                     description="Manage your projects effectively with our task management system."
//                     linkLabel="Manage"
//                 />
//                 <FeatureCardItem
//                     icon={<LibraryBig size={48} />}
//                     title="Documentation and Learning Resources"
//                     description="Find everything you need to succeed with our extensive library of resources."
//                     linkLabel="Learn"
//                 />
//                 <FeatureCardItem
//                     icon={<LayoutDashboard size={48} />}
//                     title="Organize Your Dashboard "
//                     description="Customizable dashboards let you build the exact combination of widgets that drive your workflow."
//                     linkLabel="Build"
//                 />
//             </div>
//         </div>
        
//     );
// }

export default function FeatureSection() {
    return(
        <div className="flex gap-4 p-4 m-2 flex-col" >
            <div className="flex flex-wrap gap-8 items-center justify-center p-4 mt-4">
                <div className="flex flex-wrap gap-4 items-center justify-center text-center">
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
                    <ExploreCTA />
                </div>
            </div>
            <div className="flex flex-wrap gap-4 p-4 items-center justify-center">
                <BentoGrid1/>
            </div>
        </div>
        
    );
}