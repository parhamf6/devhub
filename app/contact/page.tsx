import ContactSection from "@/features/contact/contact-section";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact – DevHub",
    description: "Learn how to contact DevHub",
    robots: { index: true, follow: true }, // Optional: don't index
}

export default function Contact(){
    return(
        <ContactSection/>
    )
}