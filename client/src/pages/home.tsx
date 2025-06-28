import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroCarousel from "@/components/sections/hero-carousel";
import AboutSection from "@/components/sections/about-section";
import ServiceSchedule from "@/components/sections/service-schedule";
import LatestMessages from "@/components/sections/latest-messages";
import BibleVerse from "@/components/sections/bible-verse";
import Testimonials from "@/components/sections/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroCarousel />
        <AboutSection />
        <ServiceSchedule />
        <LatestMessages />
        <BibleVerse />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
