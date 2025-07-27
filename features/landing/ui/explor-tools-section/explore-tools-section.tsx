import { ToolCard, ToolCardProps } from "@/components/tool-card";
import ExploreCTA from "../feature-section/components/explor-button";
import { AnimatedText } from "../../../../components/text-animation/underline-text";

const tools: ToolCardProps[] = [
    {
        name: "ESLint",
        slug: "eslint1",
        description: "Pluggable linting utility for JavaScript and JSX.",
        category: "Linting",
        version: "8.55.0",
        tags: ["javascript", "quality", "code"],
        iconUrl: "/icons/eslint.png",
    },
    {
        name: "ESLint",
        slug: "eslint2",
        description: "Pluggable linting utility for JavaScript and JSX.",
        category: "Linting",
        version: "8.55.0",

        tags: ["javascript", "quality", "code"],
        iconUrl: "/icons/eslint.png",
    },
    {
        name: "ESLint",
        slug: "eslint3",
        description: "Pluggable linting utility for JavaScript and JSX.",
        category: "Linting",
        version: "8.55.0",
        tags: ["javascript", "quality", "code"],
        iconUrl: "/icons/eslint.png",
    },
  // Add more tool objects here
];


export default function ExploreToolsSection() {
    return(
        <div className="flex gap-4 p-4 m-2 flex-col" >
            <div className="flex flex-wrap gap-8 items-center justify-center p-4 mt-4 ">
                <div className="flex flex-wrap gap-4 items-center justify-center text-center">
                    <AnimatedText
                        text="Powerful Tools"
                        textClassName="text-2xl font-bold mb-2"
                        underlinePath="M 0,10 Q 75,0 150,10 Q 225,20 300,10"
                        underlineHoverPath="M 0,10 Q 75,20 150,10 Q 225,0 300,10"
                        underlineDuration={1.5}
                    />
                    <h1 className="font-semibold text-lg text-muted-foreground"> to Code Faster and Better</h1>
                </div>
                <div className="">
                    <ExploreCTA />
                </div>
            </div>
            <div className="flex flex-wrap gap-4 items-center justify-center">
                {tools.map((tool) => (
                    <ToolCard key={tool.slug} {...tool} />
                ))}
            </div>
        </div>
    );
}