// import ContactUs1 from "@/components/mvpblocks/contact-us-1";
import Navbar from "@/components/navbar";
import { FooterV2 } from "@/components/global/footer-v2";
// import ContactUs2 from "@/components/mvpblocks/contact-us-2";
import ContactPage from "./components/contact-section";

export default function ContactSection(){
    return(
        <main>
            <Navbar/>
            <div>
                {/* <ContactUs1/> */}
                {/* <ContactUs2 /> */}
                <ContactPage />
            </div>
            <div className="mt-32">
                <FooterV2/>
            </div>
        </main>
    )
}