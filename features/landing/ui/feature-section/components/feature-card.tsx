// components/FeatureCardItem.tsx
import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion"

type FeatureCardItemProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    linkLabel: string;
};

const FeatureCardItem: React.FC<FeatureCardItemProps> = ({
    icon,
    title,
    description,
    linkLabel,
    }) => {
    return (
        <div className="flex flex-col gap-4 border border-border rounded-[32px] justify-between sm:overflow-y-scroll md:overflow-y-hidden p-4 w-[320px] h-[320px]
        hover:shadow-[-5px_-5px_10px_0px_#FAFBFF,5px_5px_10px_0px_#161B1D] transition-shadow duration-300 ">
            <div>{icon}</div>
            <div>
                <h2 className="text-2xl font-semibold ">{title}</h2>
            </div>
            <div>
                <p className="text-sm">{description}</p>
            </div>
            <div className=" text-accent border p-2  rounded-[16px] text-sm font-medium
            hover:bg-accent hover:text-background transition-colors duration-300 ring">
                <a href="" className="flex gap-2 items-center justify-center">
                    {linkLabel}
                    <ChevronRight className="text-sm" />
                </a>
            </div>
        </div>
    );
};

export default FeatureCardItem;




