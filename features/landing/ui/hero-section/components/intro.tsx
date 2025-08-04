
import { Button } from "@/components/ui/button";
import GetStartedButton from "@/features/landing/components/cta-button";
import LearnCTA from "@/features/landing/components/learn-button";
import BlurText from "@/components/text-animation/text-animation";
import { ChevronRight , ChevronRightSquare , ChevronRightCircleIcon , MoveRight , ArrowUpRightIcon  } from "lucide-react";
import { Announcement , AnnouncementTag , AnnouncementTitle } from "@/features/landing/components/announcment";


export default function IntroSide() {
    return (
        <div className="flex flex-col gap-4 p-4 m-4 items-center">
            <div className="items-center justify-center flex flex-col gap-8" >
                <Button variant="secondary" size="sm" className="gap-4">
                    Read our launch article <ArrowUpRightIcon className="w-4 h-4" />
                </Button>
                {/* <Announcement>
                    <AnnouncementTag>Latest update</AnnouncementTag>
                    <AnnouncementTitle>
                    New feature added
                    <ArrowUpRightIcon className="shrink-0 text-muted-foreground" size={16} />
                    </AnnouncementTitle>
                </Announcement> */}
            </div>
            <div className="justify-center items-center text-center ">
                {/* <div className="text-4xl mb-4 mt-8 text-secondary font-extrabold">
                    <h1 >Unleash Your Productivity with Dev Hub</h1>
                </div> */}
                <div className="mt-8 text-center ">
                    <BlurText
                        text="Unleash Your Productivity with Dev Hub"
                        delay={150}
                        animateBy="words"
                        direction="top"
                        className="text-4xl mb-8 font-serif flex items-center justify-center flex-wrap text-center font-extrabold"
                    />
                </div>
                <div className="text-lg mb-8">
                    <p>
                        Dev Hub brings all your essential developer tools into one seamless platform.
                    </p>
                    <p>
                        Streamline your workflow and enhance your productivity today!
                    </p>
                </div>
            </div>
            <div>
                <h1 className="text-accent">By the way its Free and open-source</h1>
            </div>
            <div className="flex gap-4 flex-wrap justify-center items-center mt-6">
                <div>
                    {/* <p>Get Started</p> */}
                    <GetStartedButton />
                </div>
                <div>
                    <LearnCTA/>
                </div>
            </div>
        </div>
    );
}