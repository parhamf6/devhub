import AboutSection from "@/features/about/about-section";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us – DevHub",
    description: "Learn About DevHub",
    robots: { index: true, follow: true }, // Optional: don't index
}

export default function About(){
    return(
        <AboutSection/>
    )
}