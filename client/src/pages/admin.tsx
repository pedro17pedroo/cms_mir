import { useState } from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import ContentEditor from "@/components/admin/content-editor";
import EventManager from "@/components/admin/event-manager";
import TestimonialManager from "@/components/admin/testimonial-manager";
import MessageManager from "@/components/admin/message-manager";
import AnalyticsDashboard from "@/components/admin/analytics-dashboard";
import ContentManager from "@/components/admin/content-manager";
import SocialMediaManager from "@/components/admin/social-media-manager";
import StreamingManager from "@/components/admin/streaming-manager";
import NewsletterManager from "@/components/admin/newsletter-manager";
import DonationManager from "@/components/admin/donation-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MetaTags, { generatePageMeta } from "@/components/seo/meta-tags";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AnalyticsDashboard />;
      case "content":
        return <ContentEditor />;
      case "content-manager":
        return <ContentManager />;
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
      default:
        return <ContentEditor />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <MetaTags {...generatePageMeta('admin')} />
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Church CMS Admin</h1>
            <p className="text-gray-600">Manage your church website content</p>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
