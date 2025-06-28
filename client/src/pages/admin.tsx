import { useState } from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import ContentEditor from "@/components/admin/content-editor";
import EventManager from "@/components/admin/event-manager";
import TestimonialManager from "@/components/admin/testimonial-manager";
import MessageManager from "@/components/admin/message-manager";
import AnalyticsDashboard from "@/components/admin/analytics-dashboard";
import ContentManager from "@/components/admin/content-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MetaTags, { generatePageMeta } from "@/components/seo/meta-tags";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Hero Slides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Active carousel slides
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Published messages
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Testimonials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  Faith testimonies
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Service Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Weekly services
                </p>
              </CardContent>
            </Card>
          </div>
        );
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
