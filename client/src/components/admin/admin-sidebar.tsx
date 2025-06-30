import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
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
  Users,
  Layout,
  Menu,
  Palette,
  Blocks,
  Globe,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface MenuGroup {
  id: string;
  label: string;
  icon: any;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "overview", "content", "design", "engagement"
  ]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const singleItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "quick-editor", label: "Editor Rápido", icon: FileText },
  ];

  const menuGroups: MenuGroup[] = [
    {
      id: "content",
      label: "Gestão de Conteúdo",
      icon: FileText,
      items: [
        { id: "content-manager", label: "Gestor de Conteúdo", icon: FileText },
        { id: "pages", label: "Páginas", icon: Globe },
        { id: "menus", label: "Menus", icon: Menu },
        { id: "messages", label: "Mensagens", icon: MessageSquare },
        { id: "events", label: "Eventos", icon: Calendar },
        { id: "testimonials", label: "Testemunhos", icon: Heart }
      ]
    },
    {
      id: "design",
      label: "Design e Layout",
      icon: Palette,
      items: [
        { id: "landing-page", label: "Landing Page", icon: Layout },
        { id: "blocks", label: "Biblioteca de Blocos", icon: Blocks },
        { id: "header", label: "Personalização Header", icon: Palette }
      ]
    },
    {
      id: "engagement",
      label: "Engajamento",
      icon: Users,
      items: [
        { id: "social-media", label: "Redes Sociais", icon: Share2 },
        { id: "newsletter", label: "Newsletter", icon: Mail },
        { id: "streaming", label: "Transmissões", icon: Video }
      ]
    },
    {
      id: "financial",
      label: "Financeiro",
      icon: DollarSign,
      items: [
        { id: "donations", label: "Doações", icon: DollarSign }
      ]
    },
    {
      id: "analytics",
      label: "Análises",
      icon: BarChart3,
      items: [
        { id: "analytics", label: "Relatórios", icon: BarChart3 }
      ]
    }
  ];

  const bottomItems = [
    { id: "settings", label: "Configurações", icon: Settings }
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="p-6 border-b flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-[hsl(43,96%,56%)] text-white px-3 py-2 rounded-lg font-bold text-lg">
            MIR
          </div>
          <div>
            <div className="font-semibold text-gray-900">Church CMS</div>
            <div className="text-sm text-gray-500">Admin Panel</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="p-4">
          <ul className="space-y-2">
            {/* Single Items */}
            {singleItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <Button
                    variant={activeTab === item.id ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start text-sm font-medium transition-colors ${
                      activeTab === item.id 
                        ? "bg-[hsl(43,96%,56%)] text-white hover:bg-[hsl(43,96%,50%)]" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Button>
                </li>
              );
            })}

            {/* Grouped Items */}
            {menuGroups.map((group) => {
              const isExpanded = expandedGroups.includes(group.id);
              const hasActiveItem = group.items.some(item => item.id === activeTab);
              
              return (
                <li key={group.id} className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-sm font-medium transition-colors ${
                      hasActiveItem 
                        ? "bg-gray-100 text-gray-900" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => toggleGroup(group.id)}
                  >
                    <group.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="truncate flex-1 text-left">{group.label}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    )}
                  </Button>
                  
                  {isExpanded && (
                    <ul className="ml-4 space-y-1 border-l border-gray-200 pl-3">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.id}>
                            <Button
                              variant={activeTab === item.id ? "default" : "ghost"}
                              size="sm"
                              className={`w-full justify-start text-sm transition-colors ${
                                activeTab === item.id 
                                  ? "bg-[hsl(43,96%,56%)] text-white hover:bg-[hsl(43,96%,50%)]" 
                                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              }`}
                              onClick={() => setActiveTab(item.id)}
                            >
                              <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}

            {/* Settings */}
            <li className="pt-2 border-t border-gray-200">
              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start text-sm font-medium transition-colors ${
                  activeTab === "settings" 
                    ? "bg-[hsl(43,96%,56%)] text-white hover:bg-[hsl(43,96%,50%)]" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="truncate">Configurações</span>
              </Button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t flex-shrink-0">
        <Link href="/">
          <Button variant="outline" size="sm" className="w-full justify-start text-sm">
            <LogOut className="h-4 w-4 mr-3" />
            Voltar ao Site
          </Button>
        </Link>
      </div>
    </div>
  );
}
