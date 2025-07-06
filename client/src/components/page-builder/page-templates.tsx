import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Layout, 
  FileText, 
  Calendar, 
  Users, 
  Heart, 
  Image,
  Mail,
  MapPin,
  Video,
  Newspaper,
  BookOpen,
  Settings,
  Zap
} from "lucide-react";

interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  preview: string;
  elements: any[];
  tags: string[];
}

const pageTemplates: PageTemplate[] = [
  {
    id: "landing-church",
    name: "Igreja - Landing Page",
    description: "Página inicial completa para igreja com hero, serviços, testemunhos e contato",
    category: "church",
    icon: Layout,
    preview: "/templates/church-landing.jpg",
    tags: ["igreja", "landing", "completo"],
    elements: [
      {
        type: "hero",
        props: {
          title: "Bem-vindos à Nossa Igreja",
          subtitle: "Uma comunidade de fé, esperança e amor",
          buttonText: "Conheça Nossa História",
          buttonUrl: "/sobre",
          backgroundImage: "https://images.unsplash.com/photo-1438183972690-6d4658e3290e"
        },
        styles: {
          padding: "4rem 2rem",
          backgroundColor: "#1f2937",
          color: "white",
          textAlign: "center",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }
      },
      {
        type: "service-times",
        props: {
          services: [
            { day: "Domingo", time: "09:00", service: "Culto Matutino" },
            { day: "Domingo", time: "19:00", service: "Culto Vespertino" },
            { day: "Quarta", time: "20:00", service: "Reunião de Oração" }
          ]
        },
        styles: {
          padding: "3rem 2rem",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }
      },
      {
        type: "testimonial",
        props: {
          quote: "Esta igreja transformou minha vida. Encontrei aqui uma família espiritual que me acolheu com amor.",
          author: "Maria Silva",
          position: "Membro há 5 anos",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c6"
        },
        styles: {
          padding: "2rem",
          backgroundColor: "#f3f4f6",
          borderRadius: "0.5rem",
          borderLeft: "4px solid #3b82f6"
        }
      }
    ]
  },
  {
    id: "about-page",
    name: "Página Sobre",
    description: "Página sobre com história, visão, missão e valores da igreja",
    category: "church",
    icon: Users,
    preview: "/templates/about-page.jpg",
    tags: ["sobre", "história", "missão"],
    elements: [
      {
        type: "heading",
        props: {
          text: "Nossa História",
          level: 1,
          align: "center"
        },
        styles: {
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "2rem",
          textAlign: "center"
        }
      },
      {
        type: "text",
        props: {
          content: "Há mais de 30 anos servindo nossa comunidade com amor, fé e dedicação. Nossa igreja nasceu do sonho de criar um espaço onde todos pudessem encontrar paz, comunhão e crescimento espiritual.",
          align: "center"
        },
        styles: {
          fontSize: "1.25rem",
          color: "#6b7280",
          lineHeight: "1.8",
          textAlign: "center",
          marginBottom: "3rem"
        }
      },
      {
        type: "columns",
        props: {
          columns: 3,
          spacing: "2rem"
        },
        styles: {
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2rem",
          marginBottom: "3rem"
        }
      }
    ]
  },
  {
    id: "events-page",
    name: "Página de Eventos",
    description: "Página para listar e divulgar eventos da igreja",
    category: "church",
    icon: Calendar,
    preview: "/templates/events-page.jpg",
    tags: ["eventos", "calendário", "atividades"],
    elements: [
      {
        type: "heading",
        props: {
          text: "Próximos Eventos",
          level: 1,
          align: "center"
        },
        styles: {
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "2rem",
          textAlign: "center"
        }
      },
      {
        type: "events-list",
        props: {
          events: [
            { 
              title: "Culto Especial de Páscoa", 
              date: "2024-03-31", 
              time: "19:00",
              description: "Celebração especial da ressurreição de Cristo",
              location: "Templo Principal"
            },
            { 
              title: "Retiro de Jovens", 
              date: "2024-04-15", 
              time: "08:00",
              description: "Final de semana de renovação espiritual",
              location: "Sítio da Igreja"
            }
          ]
        },
        styles: {
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }
      }
    ]
  },
  {
    id: "contact-page",
    name: "Página de Contato",
    description: "Página com formulário de contato, mapa e informações",
    category: "general",
    icon: Mail,
    preview: "/templates/contact-page.jpg",
    tags: ["contato", "formulário", "localização"],
    elements: [
      {
        type: "heading",
        props: {
          text: "Entre em Contato",
          level: 1,
          align: "center"
        },
        styles: {
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "2rem",
          textAlign: "center"
        }
      },
      {
        type: "columns",
        props: {
          columns: 2,
          spacing: "3rem"
        },
        styles: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem"
        }
      },
      {
        type: "contact-form",
        props: {
          title: "Envie uma Mensagem",
          fields: ["name", "email", "subject", "message"],
          submitText: "Enviar Mensagem"
        },
        styles: {
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }
      },
      {
        type: "map",
        props: {
          address: "Rua da Igreja, 123 - Centro",
          zoom: 16,
          height: "400px"
        },
        styles: {
          width: "100%",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }
      }
    ]
  },
  {
    id: "blog-post",
    name: "Post de Blog",
    description: "Layout para artigos e posts do blog da igreja",
    category: "content",
    icon: Newspaper,
    preview: "/templates/blog-post.jpg",
    tags: ["blog", "artigo", "conteúdo"],
    elements: [
      {
        type: "heading",
        props: {
          text: "Título do Artigo",
          level: 1,
          align: "left"
        },
        styles: {
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "1rem"
        }
      },
      {
        type: "text",
        props: {
          content: "Publicado em 15 de março de 2024 por Pastor João",
          align: "left"
        },
        styles: {
          fontSize: "0.875rem",
          color: "#6b7280",
          marginBottom: "2rem"
        }
      },
      {
        type: "image",
        props: {
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
          alt: "Imagem do artigo",
          width: "100%",
          height: "400px"
        },
        styles: {
          borderRadius: "0.5rem",
          marginBottom: "2rem"
        }
      },
      {
        type: "text",
        props: {
          content: "Conteúdo do artigo aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          align: "left"
        },
        styles: {
          fontSize: "1.125rem",
          lineHeight: "1.8",
          color: "#374151"
        }
      }
    ]
  },
  {
    id: "donation-page",
    name: "Página de Doações",
    description: "Página para receber doações e contribuições",
    category: "church",
    icon: Heart,
    preview: "/templates/donation-page.jpg",
    tags: ["doação", "contribuição", "dízimo"],
    elements: [
      {
        type: "hero",
        props: {
          title: "Contribua com a Obra de Deus",
          subtitle: "Sua contribuição faz a diferença na vida de muitas pessoas",
          buttonText: "Fazer Doação",
          buttonUrl: "#donate",
          backgroundImage: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b"
        },
        styles: {
          padding: "4rem 2rem",
          backgroundColor: "#065f46",
          color: "white",
          textAlign: "center",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }
      },
      {
        type: "donation-widget",
        props: {
          title: "Como Contribuir",
          description: "Escolha a forma mais conveniente para você",
          buttonText: "Contribuir Agora",
          donationUrl: "#"
        },
        styles: {
          padding: "3rem",
          backgroundColor: "#ecfdf5",
          borderRadius: "0.5rem",
          border: "1px solid #16a34a",
          textAlign: "center"
        }
      }
    ]
  },
  {
    id: "ministries-page",
    name: "Página de Ministérios",
    description: "Apresentação dos ministérios e departamentos da igreja",
    category: "church",
    icon: Users,
    preview: "/templates/ministries-page.jpg",
    tags: ["ministérios", "departamentos", "grupos"],
    elements: [
      {
        type: "heading",
        props: {
          text: "Nossos Ministérios",
          level: 1,
          align: "center"
        },
        styles: {
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "2rem",
          textAlign: "center"
        }
      },
      {
        type: "text",
        props: {
          content: "Conheça os ministérios da nossa igreja e encontre seu lugar de servir",
          align: "center"
        },
        styles: {
          fontSize: "1.25rem",
          color: "#6b7280",
          textAlign: "center",
          marginBottom: "3rem"
        }
      },
      {
        type: "gallery",
        props: {
          images: [
            { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18", title: "Ministério de Louvor" },
            { url: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643", title: "Ministério Infantil" },
            { url: "https://images.unsplash.com/photo-1529390079861-591de354faf5", title: "Ministério de Jovens" }
          ],
          columns: 3,
          spacing: "2rem"
        },
        styles: {
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2rem"
        }
      }
    ]
  },
  {
    id: "simple-blank",
    name: "Página em Branco",
    description: "Comece do zero com uma página totalmente em branco",
    category: "general",
    icon: FileText,
    preview: "/templates/blank-page.jpg",
    tags: ["branco", "personalizado", "livre"],
    elements: [
      {
        type: "heading",
        props: {
          text: "Nova Página",
          level: 1,
          align: "center"
        },
        styles: {
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "2rem",
          textAlign: "center"
        }
      },
      {
        type: "text",
        props: {
          content: "Comece a construir sua página aqui...",
          align: "center"
        },
        styles: {
          fontSize: "1.125rem",
          color: "#6b7280",
          textAlign: "center"
        }
      }
    ]
  }
];

interface PageTemplatesProps {
  onSelectTemplate: (template: PageTemplate) => void;
  onClose: () => void;
}

export default function PageTemplates({ onSelectTemplate, onClose }: PageTemplatesProps) {
  const categories = Array.from(new Set(pageTemplates.map(t => t.category)));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "church": return Users;
      case "content": return BookOpen;
      case "general": return Layout;
      default: return FileText;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "church": return "Igreja";
      case "content": return "Conteúdo";
      case "general": return "Geral";
      default: return category;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Escolher Template</h2>
              <p className="text-gray-600 mt-1">Selecione um template para começar sua página</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              {categories.map(category => {
                const CategoryIcon = getCategoryIcon(category);
                const templatesInCategory = pageTemplates.filter(t => t.category === category);
                
                return (
                  <div key={category} className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <CategoryIcon className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">{getCategoryName(category)}</h3>
                      <Badge variant="outline" className="ml-2">
                        {templatesInCategory.length}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {templatesInCategory.map(template => {
                        const TemplateIcon = template.icon;
                        
                        return (
                          <Card 
                            key={template.id} 
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => onSelectTemplate(template)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <TemplateIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-base">{template.name}</CardTitle>
                                  <CardDescription className="text-sm">
                                    {template.description}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="pt-0">
                              <div className="flex flex-wrap gap-1 mb-3">
                                {template.tags.map(tag => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>{template.elements.length} elementos</span>
                                <Button size="sm" className="h-8">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Usar Template
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}