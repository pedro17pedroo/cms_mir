import { useQuery } from "@tanstack/react-query";
import HeroCarousel from "@/components/sections/hero-carousel";
import AboutSection from "@/components/sections/about-section";
import ServiceSchedule from "@/components/sections/service-schedule";
import LatestMessages from "@/components/sections/latest-messages";
import BibleVerse from "@/components/sections/bible-verse";
import Testimonials from "@/components/sections/testimonials";
import Newsletter from "@/components/sections/newsletter";
import SocialMedia from "@/components/sections/social-media";
import LiveStreaming from "@/components/sections/live-streaming";
import EventsSection from "./events-section";
import BlogSection from "./blog-section";
import { type LandingPageSection } from "@shared/schema";

interface DynamicSectionRendererProps {
  section: LandingPageSection;
}

function DynamicSectionRenderer({ section }: DynamicSectionRendererProps) {
  if (!section.isActive) return null;

  const config = JSON.parse(section.content);

  switch (section.sectionType) {
    case "hero":
      return <HeroCarousel />;
    
    case "about":
      return <AboutSection />;
    
    case "services":
      return <ServiceSchedule />;
    
    case "messages":
    case "sermons":
      return <LatestMessages />;
    
    case "testimonials":
      return <Testimonials />;
    
    case "bible_verse":
    case "bible-verse":
      return <BibleVerse />;
    
    case "newsletter":
      return <Newsletter />;
    
    case "social_media":
    case "social-media":
      return <SocialMedia />;
    
    case "live_streaming":
    case "live-streaming":
      return <LiveStreaming />;
    
    case "events":
      return <EventsSection />;
    
    case "blog":
      return <BlogSection />;
    
    case "custom":
      return (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">{section.title}</h2>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: config.html || "" }}
            />
          </div>
        </section>
      );
    
    default:
      return null;
  }
}

export default function DynamicLandingPage() {
  const { data: sections = [], isLoading } = useQuery<LandingPageSection[]>({
    queryKey: ["/api/landing-page-sections"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando página...</p>
        </div>
      </div>
    );
  }

  // Ordenar seções pela ordem definida
  const sortedSections = sections
    .filter((section: LandingPageSection) => section.isActive)
    .sort((a: LandingPageSection, b: LandingPageSection) => (a.order || 0) - (b.order || 0));

  return (
    <main>
      {sortedSections.map((section: LandingPageSection) => (
        <DynamicSectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}