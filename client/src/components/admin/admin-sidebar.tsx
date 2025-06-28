import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Home, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Heart,
  Settings,
  LogOut,
  BarChart3,
  Share2,
  Video,
  Mail,
  DollarSign,
  Users
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "content", label: "Conteúdo", icon: FileText },
    { id: "content-manager", label: "Gestor Conteúdo", icon: Users },
    { id: "events", label: "Eventos", icon: Calendar },
    { id: "messages", label: "Mensagens", icon: MessageSquare },
    { id: "testimonials", label: "Testemunhos", icon: Heart },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "social-media", label: "Redes Sociais", icon: Share2 },
    { id: "streaming", label: "Streaming", icon: Video },
    { id: "newsletter", label: "Newsletter", icon: Mail },
    { id: "donations", label: "Doações", icon: DollarSign },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="bg-[hsl(43,96%,56%)] text-white px-3 py-2 rounded font-bold text-lg">
            MIR
          </div>
          <div>
            <div className="font-medium text-gray-900">Church CMS</div>
            <div className="text-sm text-gray-500">Admin Panel</div>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Button
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === item.id 
                      ? "bg-[hsl(43,96%,56%)] text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            Back to Site
          </Button>
        </Link>
      </div>
    </div>
  );
}
