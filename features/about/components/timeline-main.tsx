import Image from "next/image";
import React from "react";
import { Timeline } from "./timeline-component";

export function TimelineDemo() {
    const data = [
        {
        title: "15 July 2025",
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
        title: "4 August 2025",
        content: (
            <div>
            <p className=" text-xs md:text-sm font-normal mb-8">
                lunch the first mvp on vercel
            </p>
            </div>
        ),
        },
        {
        title: "Changelog",
        content: (
            <div>
            <p className="text-xs md:text-sm font-normal mb-4">
                We’re excited to share the latest DevHub updates! Over the past week, we’ve shipped powerful new tools, polished key UI elements, and squashed bugs to keep your developer journey smooth.
            </p>
            <div className="mb-8">
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Added JSON/CSV Converter tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Launched Color Picker tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Released cURL Builder tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Introduced Hash Text Generator tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Added JSON/YAML Converter tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Ship Base64 Encoder/Decoder tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ New JWT Encoder/Decoder tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Added URL Encoder/Decoder tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ New JSON ↔ TOML Converter tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ New JSON ↔ CSV Converter tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ New JSON ↔ XML Converter tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Build UUID Generator tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ New HMAC Generatortool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Introduced Password Strength Checker tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Build ULID Generator tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ New Bcrypt Generator tool
                </div>
                <div className="flex gap-2 items-center text-xs md:text-sm">
                ✅ Added Rsa Key pair Generator tool
                </div>
            </div>
            </div>
        ),
        }
            ];
    return (
        <div className="min-h-screen w-full">
        <div className=" w-full">
            <Timeline data={data} />
        </div>
        </div>
    );
}
