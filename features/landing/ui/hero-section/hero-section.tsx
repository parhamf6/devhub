
import IntroSide from "./components/intro";
import FeaturesSide from "./components/hero-features";
import { BeamsBackground } from "./components/background-beams";

export default function HeroSection() {
    return(
        <div >
            {/* <div>
                <BeamsBackground />
            </div> */}
            <div className="flex flex-col gap-2 p-4 mt-4  items-center justify-center ">
                <IntroSide />
                {/* <FeaturesSide /> */}
            </div>
        </div>
        
    );
}