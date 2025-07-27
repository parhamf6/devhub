import Image from "next/image";
import React from "react";
import { Timeline } from "./timeline-component";

export function TimelineDemo() {
    const data = [
        {
        title: "July 2024",
        content: (
            <div>
            <p className=" text-xs md:text-sm font-normal mb-8">
                Start the Poject from a simple idea , what is We have a dashboard that have every thing in it ?
            </p>
            <div className="grid grid-cols-2 gap-4">
                
            </div>
            </div>
        ),
        },
        {
        title: "Early 2023",
        content: (
            <div>
            <p className=" text-xs md:text-sm font-normal mb-8">
                I usually run out of copy, but when I see content this big, I try to
                integrate lorem ipsum.
            </p>
            <p className=" text-xs md:text-sm font-normal mb-8">
                Lorem ipsum is for people who are too lazy to write copy. But we are
                not. Here are some more example of beautiful designs I built.
            </p>
            <div className="grid grid-cols-2 gap-4">
                
            </div>
            </div>
        ),
        },
        {
        title: "Changelog",
        content: (
            <div>
            <p className=" text-xs md:text-sm font-normal mb-4">
                Deployed 5 new components on Aceternity today
            </p>
            <div className="mb-8">
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Card grid component
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Startup template Aceternity
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Random file upload lol
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Himesh Reshammiya Music CD
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Salman Bhai Fan Club registrations open
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                
            </div>
            </div>
        ),
        },
    ];
    return (
        <div className="min-h-screen w-full">
        <div className=" w-full">
            <Timeline data={data} />
        </div>
        </div>
    );
}
