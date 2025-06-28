import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroCarousel from "@/components/sections/hero-carousel";
import AboutSection from "@/components/sections/about-section";
import ServiceSchedule from "@/components/sections/service-schedule";
import LatestMessages from "@/components/sections/latest-messages";
import BibleVerse from "@/components/sections/bible-verse";
import Testimonials from "@/components/sections/testimonials";
import Newsletter from "@/components/sections/newsletter";
import SocialMedia from "@/components/sections/social-media";
import LiveStreaming from "@/components/sections/live-streaming";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroCarousel />
        <LiveStreaming />
        <AboutSection />
        <ServiceSchedule />
        <LatestMessages />
        <BibleVerse />
        <Testimonials />
        <SocialMedia />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
