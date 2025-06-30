import { useState } from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import QuickEditor from "@/components/admin/quick-editor";
import EventManager from "@/components/admin/event-manager";
import TestimonialManager from "@/components/admin/testimonial-manager";
import MessageManager from "@/components/admin/message-manager";
import AnalyticsDashboard from "@/components/admin/analytics-dashboard";
import ContentManager from "@/components/admin/content-manager";
import SocialMediaManager from "@/components/admin/social-media-manager";
import StreamingManager from "@/components/admin/streaming-manager";
import NewsletterManager from "@/components/admin/newsletter-manager";
import DonationManager from "@/components/admin/donation-manager";
import PageManager from "@/components/admin/page-manager";
import MenuManager from "@/components/admin/menu-manager";
import LandingPageManager from "@/components/admin/landing-page-manager";
import BlocksLibrary from "@/components/admin/blocks-library";
import HeaderCustomizer from "@/components/admin/header-customizer";
import SettingsPanel from "@/components/admin/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MetaTags, { generatePageMeta } from "@/components/seo/meta-tags";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AnalyticsDashboard />;
      case "quick-editor":
        return <QuickEditor />;
      case "content-manager":
        return <ContentManager />;
      case "pages":
        return <PageManager />;
      case "menus":
        return <MenuManager />;
      case "landing-page":
        return <LandingPageManager />;
      case "blocks":
        return <BlocksLibrary />;
      case "header":
        return <HeaderCustomizer />;
      case "events":
        return <EventManager />;
      case "testimonials":
        return <TestimonialManager />;
      case "messages":
        return <MessageManager />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "social-media":
        return <SocialMediaManager />;
      case "streaming":
        return <StreamingManager />;
      case "newsletter":
        return <NewsletterManager />;
      case "donations":
        return <DonationManager />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <MetaTags {...generatePageMeta('admin')} />
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Church CMS Admin</h1>
                <p className="text-gray-600 mt-1">Gerencie o conteúdo da sua igreja</p>
              </div>
              <div className="min-h-0">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
