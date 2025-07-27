import Image from "next/image";
import LandingPage from "@/features/landing/pages/landing-page";
import Navbar from "@/components/navbar";
// import { Footer } from "@/components/footer";
import { FooterV2 } from "@/components/global/footer-v2";
import NavbarV2 from "@/components/global/navbar-v2";


export default function Home() {
  return (
    <main className="">
      <Navbar />
      {/* <NavbarV2/> */}
      <div>
        <LandingPage />
      </div>
      <FooterV2 />
    </main>
  );
}
