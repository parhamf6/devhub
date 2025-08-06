import SupportPage from "@/features/support/support-page"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Support – DevHub",
    description: "Learn how to Support DevHub",
    robots: { index: true, follow: true }, // Optional: don't index
}
export default function Support(){
    return <SupportPage />
}