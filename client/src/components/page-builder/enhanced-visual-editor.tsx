import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from "@/components/ui/color-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PageTemplates from "./page-templates";
import EnhancedRichTextEditor from "./enhanced-rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { 
  Save,
  Eye,
  Undo,
  Redo,
  Monitor,
  Tablet,
  Smartphone,
  Settings,
  Type,
  FileText,
  Square,
  Image,
  Film,
  Grid,
  Minus,
  Link,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  BookOpen,
  Radio,
  MessageSquare,
  Share2,
  Layers,
  Move,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Edit3,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Table,
  Layout,
  Columns,
  Play,
  Heart,
  Star,
  MousePointer,
  FormInput,
  Video,
  GripVertical,
  X,
  Plus,
  Maximize,
  Minimize,
  RotateCcw,
  Zap,
  Smartphone as Mobile
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Enhanced Types
interface PageElement {
  id: string;
  type: string;
  props: Record<string, any>;
  styles: {
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    borderRadius?: string;
    border?: string;
    textAlign?: string;
    width?: string;
    height?: string;
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    position?: string;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    zIndex?: string;
    opacity?: string;
    transform?: string;
    boxShadow?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    [key: string]: any;
  };
  content?: string;
  children?: PageElement[];
}

interface Widget {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  category: string;
  defaultProps: Record<string, any>;
  defaultStyles: Record<string, any>;
  previewComponent?: React.ComponentType<any>;
}

// Enhanced Widget Categories
const widgetCategories = {
  basic: {
    title: "Elementos Básicos",
    widgets: [
      {
        id: "heading",
        icon: Type,
        label: "Título",
        category: "basic",
        defaultProps: {
          text: "Novo Título",
          level: 2,
          align: "left",
          hasLink: false,
          url: ""
        },
        defaultStyles: {
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "1rem"
        }
      },
      {
        id: "text",
        icon: FileText,
        label: "Texto",
        category: "basic",
        defaultProps: {
          content: "Digite seu texto aqui...",
          align: "left"
        },
        defaultStyles: {
          fontSize: "1rem",
          color: "#374151",
          lineHeight: "1.6"
        }
      },
      {
        id: "button",
        icon: MousePointer,
        label: "Botão",
        category: "basic",
        defaultProps: {
          text: "Clique Aqui",
          url: "#",
          style: "primary",
          size: "default"
        },
        defaultStyles: {
          backgroundColor: "#3b82f6",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "0.375rem",
          border: "none",
          cursor: "pointer"
        }
      },
      {
        id: "image",
        icon: Image,
        label: "Imagem",
        category: "basic",
        defaultProps: {
          url: "",
          alt: "Imagem",
          width: "100%",
          height: "auto"
        },
        defaultStyles: {
          borderRadius: "0.375rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }
      },
      {
        id: "container",
        icon: Layout,
        label: "Container",
        category: "basic",
        defaultProps: {
          direction: "column",
          spacing: "1rem"
        },
        defaultStyles: {
          padding: "1rem",
          backgroundColor: "#f9fafb",
          borderRadius: "0.375rem",
          border: "1px solid #e5e7eb"
        }
      },
      {
        id: "columns",
        icon: Columns,
        label: "Colunas",
        category: "basic",
        defaultProps: {
          columns: 2,
          spacing: "1rem"
        },
        defaultStyles: {
          display: "grid",
          gap: "1rem"
        }
      },
      {
        id: "spacer",
        icon: Minus,
        label: "Espaçador",
        category: "basic",
        defaultProps: {
          height: "2rem"
        },
        defaultStyles: {
          height: "2rem",
          backgroundColor: "transparent"
        }
      }
    ]
  },
  content: {
    title: "Conteúdo",
    widgets: [
      {
        id: "hero",
        icon: Layout,
        label: "Hero Banner",
        category: "content",
        defaultProps: {
          title: "Bem-vindos à Nossa Igreja",
          subtitle: "Junte-se a nós em adoração e comunhão",
          buttonText: "Saiba Mais",
          buttonUrl: "#",
          backgroundImage: "",
          height: "400px"
        },
        defaultStyles: {
          padding: "4rem 2rem",
          backgroundColor: "#1f2937",
          color: "white",
          textAlign: "center",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px"
        }
      },
      {
        id: "card",
        icon: Square,
        label: "Card",
        category: "content",
        defaultProps: {
          title: "Título do Card",
          content: "Conteúdo do card aqui...",
          imageUrl: "",
          buttonText: "Leia Mais",
          buttonUrl: "#"
        },
        defaultStyles: {
          padding: "1.5rem",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb"
        }
      },
      {
        id: "testimonial",
        icon: MessageSquare,
        label: "Testemunho",
        category: "content",
        defaultProps: {
          quote: "Compartilhe seu testemunho aqui...",
          author: "Nome do Autor",
          position: "Membro da Igreja",
          avatar: ""
        },
        defaultStyles: {
          padding: "2rem",
          backgroundColor: "#f3f4f6",
          borderRadius: "0.5rem",
          borderLeft: "4px solid #3b82f6"
        }
      },
      {
        id: "gallery",
        icon: Image,
        label: "Galeria",
        category: "content",
        defaultProps: {
          images: [],
          columns: 3,
          spacing: "1rem"
        },
        defaultStyles: {
          display: "grid",
          gap: "1rem"
        }
      }
    ]
  },
  church: {
    title: "Igreja",
    widgets: [
      {
        id: "service-times",
        icon: Calendar,
        label: "Horários dos Cultos",
        category: "church",
        defaultProps: {
          services: [
            { day: "Domingo", time: "09:00", service: "Culto Matutino" },
            { day: "Domingo", time: "19:00", service: "Culto Vespertino" }
          ]
        },
        defaultStyles: {
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        }
      },
      {
        id: "pastor-message",
        icon: Users,
        label: "Mensagem do Pastor",
        category: "church",
        defaultProps: {
          title: "Mensagem do Pastor",
          content: "Palavra de encorajamento e fé...",
          pastorName: "Pastor João",
          pastorImage: ""
        },
        defaultStyles: {
          padding: "2rem",
          backgroundColor: "#fef3c7",
          borderRadius: "0.5rem",
          border: "1px solid #fbbf24"
        }
      },
      {
        id: "bible-verse",
        icon: BookOpen,
        label: "Versículo Bíblico",
        category: "church",
        defaultProps: {
          verse: "Porque Deus amou o mundo de tal maneira...",
          reference: "João 3:16",
          version: "ARA"
        },
        defaultStyles: {
          padding: "2rem",
          backgroundColor: "#ede9fe",
          borderRadius: "0.5rem",
          textAlign: "center",
          fontStyle: "italic"
        }
      },
      {
        id: "donation-widget",
        icon: Heart,
        label: "Widget de Doação",
        category: "church",
        defaultProps: {
          title: "Contribua com a Obra",
          description: "Sua doação faz a diferença",
          buttonText: "Doar Agora",
          donationUrl: "#"
        },
        defaultStyles: {
          padding: "2rem",
          backgroundColor: "#dcfce7",
          borderRadius: "0.5rem",
          border: "1px solid #16a34a",
          textAlign: "center"
        }
      },
      {
        id: "events-list",
        icon: Calendar,
        label: "Lista de Eventos",
        category: "church",
        defaultProps: {
          events: [
            { title: "Culto Especial", date: "2024-01-15", time: "19:00" },
            { title: "Reunião de Oração", date: "2024-01-17", time: "20:00" }
          ]
        },
        defaultStyles: {
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        }
      },
      {
        id: "live-stream",
        icon: Video,
        label: "Transmissão ao Vivo",
        category: "church",
        defaultProps: {
          title: "Assista ao Vivo",
          description: "Participe dos nossos cultos online",
          streamUrl: "",
          isLive: false
        },
        defaultStyles: {
          padding: "2rem",
          backgroundColor: "#fef2f2",
          borderRadius: "0.5rem",
          border: "1px solid #ef4444",
          textAlign: "center"
        }
      }
    ]
  },
  forms: {
    title: "Formulários",
    widgets: [
      {
        id: "contact-form",
        icon: FormInput,
        label: "Formulário de Contato",
        category: "forms",
        defaultProps: {
          title: "Entre em Contato",
          fields: ["name", "email", "message"],
          submitText: "Enviar"
        },
        defaultStyles: {
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        }
      },
      {
        id: "newsletter",
        icon: Mail,
        label: "Newsletter",
        category: "forms",
        defaultProps: {
          title: "Receba Nossas Novidades",
          description: "Inscreva-se para receber atualizações",
          buttonText: "Inscrever-se"
        },
        defaultStyles: {
          padding: "2rem",
          backgroundColor: "#f0f9ff",
          borderRadius: "0.5rem",
          border: "1px solid #0ea5e9"
        }
      },
      {
        id: "prayer-request",
        icon: Heart,
        label: "Pedido de Oração",
        category: "forms",
        defaultProps: {
          title: "Pedido de Oração",
          description: "Compartilhe seu pedido de oração",
          buttonText: "Enviar Pedido"
        },
        defaultStyles: {
          padding: "2rem",
          backgroundColor: "#fef7ff",
          borderRadius: "0.5rem",
          border: "1px solid #a855f7"
        }
      }
    ]
  },
  media: {
    title: "Mídia",
    widgets: [
      {
        id: "video",
        icon: Video,
        label: "Vídeo",
        category: "media",
        defaultProps: {
          url: "",
          title: "Vídeo",
          autoplay: false,
          controls: true
        },
        defaultStyles: {
          width: "100%",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
        }
      },
      {
        id: "youtube",
        icon: Play,
        label: "YouTube",
        category: "media",
        defaultProps: {
          videoId: "",
          title: "Vídeo do YouTube",
          autoplay: false
        },
        defaultStyles: {
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: "0.5rem"
        }
      },
      {
        id: "audio",
        icon: Radio,
        label: "Áudio",
        category: "media",
        defaultProps: {
          url: "",
          title: "Áudio",
          controls: true
        },
        defaultStyles: {
          width: "100%",
          borderRadius: "0.5rem"
        }
      }
    ]
  },
  advanced: {
    title: "Avançado",
    widgets: [
      {
        id: "map",
        icon: MapPin,
        label: "Mapa",
        category: "advanced",
        defaultProps: {
          address: "Endereço da Igreja",
          zoom: 15,
          height: "400px"
        },
        defaultStyles: {
          width: "100%",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        }
      },
      {
        id: "countdown",
        icon: Clock,
        label: "Contagem Regressiva",
        category: "advanced",
        defaultProps: {
          title: "Próximo Evento",
          targetDate: "2024-12-31T23:59:59",
          showLabels: true
        },
        defaultStyles: {
          padding: "2rem",
          backgroundColor: "#1e293b",
          color: "white",
          borderRadius: "0.5rem",
          textAlign: "center"
        }
      },
      {
        id: "social-feed",
        icon: Share2,
        label: "Feed Social",
        category: "advanced",
        defaultProps: {
          platform: "instagram",
          username: "",
          postsCount: 6
        },
        defaultStyles: {
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        }
      },
      {
        id: "custom-html",
        icon: Code,
        label: "HTML Personalizado",
        category: "advanced",
        defaultProps: {
          html: "<div>Código HTML personalizado</div>",
          css: ""
        },
        defaultStyles: {
          padding: "1rem",
          backgroundColor: "#f8fafc",
          borderRadius: "0.375rem",
          border: "1px dashed #94a3b8"
        }
      }
    ]
  }
};

interface EnhancedVisualEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

// Helper function to get all available widgets
const getAllWidgets = (): Widget[] => {
  return Object.values(widgetCategories as any)
    .flatMap((cat: any) => cat.widgets);
};

export default function EnhancedVisualEditor({ initialContent, onSave, onCancel }: EnhancedVisualEditorProps) {
  const [elements, setElements] = useState<PageElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [history, setHistory] = useState<PageElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [devicePreview, setDevicePreview] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState("basic");
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showGlobalStyles, setShowGlobalStyles] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load initial content
  useEffect(() => {
    if (initialContent) {
      try {
        const parsed = JSON.parse(initialContent);
        if (parsed.elements) {
          setElements(parsed.elements);
          setHistory([parsed.elements]);
        }
      } catch (error) {
        console.error("Error parsing initial content:", error);
      }
    }
  }, [initialContent]);

  // History management
  const saveToHistory = (newElements: PageElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Check if dragging from widget panel
    const widgetType = active.data.current?.widgetType;
    if (widgetType) {
      setDraggedWidget(widgetType);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setDraggedWidget(null);
      return;
    }

    // Adding new widget
    if (draggedWidget) {
      const widget = getAllWidgets().find(w => w.id === draggedWidget);
      
      if (widget) {
        const newElement: PageElement = {
          id: `element-${Date.now()}`,
          type: widget.id,
          props: { ...widget.defaultProps },
          styles: { ...widget.defaultStyles }
        };

        const newElements = [...elements, newElement];
        setElements(newElements);
        saveToHistory(newElements);
        setSelectedElement(newElement.id);
      }
    } 
    // Reordering existing elements
    else if (active.id !== over.id) {
      const oldIndex = elements.findIndex(el => el.id === active.id);
      const newIndex = elements.findIndex(el => el.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newElements = arrayMove(elements, oldIndex, newIndex);
        setElements(newElements);
        saveToHistory(newElements);
      }
    }

    setActiveId(null);
    setDraggedWidget(null);
  };

  // Element actions
  const duplicateElement = (id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: `element-${Date.now()}`,
        props: { ...element.props },
        styles: { ...element.styles }
      };
      const index = elements.findIndex(el => el.id === id);
      const newElements = [...elements];
      newElements.splice(index + 1, 0, newElement);
      setElements(newElements);
      saveToHistory(newElements);
    }
  };

  const deleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    saveToHistory(newElements);
    setSelectedElement(null);
  };

  const updateElement = (id: string, updates: Partial<PageElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    saveToHistory(newElements);
  };

  const updateElementProps = (id: string, newProps: Record<string, any>) => {
    updateElement(id, { props: newProps });
  };

  const updateElementStyles = (id: string, newStyles: Record<string, any>) => {
    updateElement(id, { styles: newStyles });
  };

  const moveElement = (id: string, direction: "up" | "down") => {
    const index = elements.findIndex(el => el.id === id);
    if (index === -1) return;
    
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= elements.length) return;
    
    const newElements = arrayMove(elements, index, newIndex);
    setElements(newElements);
    saveToHistory(newElements);
  };

  // Save handler
  const handleSave = () => {
    const content = JSON.stringify({ elements });
    onSave(content);
    toast({
      title: "Página salva",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  // Clear all elements
  const clearAllElements = () => {
    if (elements.length > 0 && confirm("Tem certeza que deseja limpar todos os elementos?")) {
      setElements([]);
      saveToHistory([]);
      setSelectedElement(null);
    }
  };

  // Apply template
  const applyTemplate = (template: any) => {
    if (elements.length > 0 && !confirm("Tem certeza que deseja substituir o conteúdo atual?")) {
      return;
    }
    
    setElements(template.elements);
    saveToHistory(template.elements);
    setSelectedElement(null);
    setShowTemplates(false);
    toast({
      title: "Template aplicado",
      description: `Template "${template.name}" foi aplicado com sucesso.`,
    });
  };

  // Render element preview
  const renderElement = (element: PageElement) => {
    const combinedStyles: React.CSSProperties = {
      ...(element.styles as React.CSSProperties),
      outline: selectedElement === element.id ? "2px solid #3b82f6" : "none",
      outlineOffset: selectedElement === element.id ? "2px" : "0"
    };

    const baseClasses = "relative group transition-all duration-200 hover:shadow-sm";
    
    switch (element.type) {
      case "heading":
        const HeadingTag = `h${element.props.level || 2}` as keyof JSX.IntrinsicElements;
        const headingContent = element.props.hasLink && element.props.url ? (
          <a href={element.props.url} className="hover:underline">
            {element.props.text}
          </a>
        ) : (
          element.props.text
        );
        return (
          <HeadingTag 
            className={baseClasses}
            style={combinedStyles}
          >
            {headingContent}
          </HeadingTag>
        );
      
      case "text":
        return (
          <p 
            className={baseClasses}
            style={combinedStyles}
          >
            {element.props.content}
          </p>
        );
      
      case "button":
        return (
          <button 
            className={cn(baseClasses, "inline-block cursor-pointer")}
            style={combinedStyles}
          >
            {element.props.text}
          </button>
        );
      
      case "image":
        return (
          <div className={baseClasses} style={combinedStyles}>
            {element.props.url ? (
              <img 
                src={element.props.url} 
                alt={element.props.alt}
                className="max-w-full h-auto"
              />
            ) : (
              <div className="bg-gray-200 p-8 text-center text-gray-500 rounded">
                <Image className="w-12 h-12 mx-auto mb-2" />
                <p>Clique para adicionar imagem</p>
              </div>
            )}
          </div>
        );
      
      case "container":
        return (
          <div 
            className={cn(baseClasses, "min-h-[100px]")}
            style={combinedStyles}
          >
            <div className="text-center text-gray-400 text-sm p-4">
              Container - Adicione elementos aqui
            </div>
          </div>
        );

      case "hero":
        return (
          <div 
            className={cn(baseClasses, "relative overflow-hidden")}
            style={combinedStyles}
          >
            <div className="relative z-10 text-center">
              <h1 className="text-4xl font-bold mb-4">{element.props.title}</h1>
              <p className="text-xl mb-6 opacity-90">{element.props.subtitle}</p>
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                {element.props.buttonText}
              </button>
            </div>
          </div>
        );

      case "card":
        return (
          <div 
            className={baseClasses}
            style={combinedStyles}
          >
            {element.props.imageUrl && (
              <img src={element.props.imageUrl} alt="" className="w-full h-48 object-cover rounded-t-lg" />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{element.props.title}</h3>
              <p className="text-gray-600 mb-4">{element.props.content}</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                {element.props.buttonText}
              </button>
            </div>
          </div>
        );

      case "spacer":
        return (
          <div 
            className={cn(baseClasses, "bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center")}
            style={combinedStyles}
          >
            <span className="text-gray-400 text-sm">Espaçador</span>
          </div>
        );
      
      default:
        return (
          <div 
            className={cn(baseClasses, "bg-gray-100 p-4 text-center text-gray-500 rounded border-2 border-dashed border-gray-300")}
            style={combinedStyles}
          >
            <Square className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium capitalize">{element.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Enhanced Top Bar */}
      <div className="bg-white border-b p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onCancel}>
            ← Voltar
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex === 0}
              title="Desfazer"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              title="Refazer"
            >
              <Redo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllElements}
              title="Limpar Tudo"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(true)}
              title="Escolher Template"
            >
              <Layout className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              title="Mostrar/Ocultar Grade"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSnapToGrid(!snapToGrid)}
              title="Ajustar à Grade"
            >
              <Zap className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
            <Button
              variant={devicePreview === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDevicePreview("desktop")}
              title="Desktop"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={devicePreview === "tablet" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDevicePreview("tablet")}
              title="Tablet"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={devicePreview === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDevicePreview("mobile")}
              title="Mobile"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "Editar" : "Preview"}
          </Button>
          
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Left Sidebar - Enhanced Widget Panel */}
          {!previewMode && (
            <div className="w-80 bg-white border-r flex flex-col shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Elementos
                </h3>
                <p className="text-sm text-gray-500 mt-1">Arraste para adicionar à página</p>
              </div>
              
              <ScrollArea className="flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 m-4">
                    <TabsTrigger value="basic">Básico</TabsTrigger>
                    <TabsTrigger value="content">Conteúdo</TabsTrigger>
                    <TabsTrigger value="church">Igreja</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
                    <TabsTrigger value="forms">Formulários</TabsTrigger>
                    <TabsTrigger value="media">Mídia</TabsTrigger>
                    <TabsTrigger value="advanced">Avançado</TabsTrigger>
                  </TabsList>

                  {Object.entries(widgetCategories).map(([key, category]) => (
                    <TabsContent key={key} value={key} className="px-4 pb-4">
                      <div className="space-y-2">
                        {category.widgets.map((widget) => (
                          <WidgetItem
                            key={widget.id}
                            widget={widget}
                            onDragStart={() => setDraggedWidget(widget.id)}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </ScrollArea>
            </div>
          )}

          {/* Enhanced Canvas Area */}
          <div className="flex-1 overflow-auto bg-gray-100 p-8 relative">
            {showGrid && (
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="h-full w-full" 
                     style={{
                       backgroundImage: `
                         linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                       `,
                       backgroundSize: '20px 20px'
                     }} 
                />
              </div>
            )}
            
            <div 
              className={cn(
                "mx-auto bg-white shadow-lg transition-all duration-300 relative",
                {
                  "max-w-[375px]": devicePreview === "mobile",
                  "max-w-[768px]": devicePreview === "tablet",
                  "max-w-5xl": devicePreview === "desktop",
                }
              )}
            >
              {/* Device Preview Label */}
              <div className="absolute -top-6 left-0 text-xs text-gray-500 uppercase font-medium">
                {devicePreview === "desktop" && "Desktop (1024px+)"}
                {devicePreview === "tablet" && "Tablet (768px)"}
                {devicePreview === "mobile" && "Mobile (375px)"}
              </div>

              <div className="min-h-[600px] p-8">
                {elements.length === 0 ? (
                  <div className="text-center py-24 text-gray-500">
                    <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Comece a construir sua página</h3>
                    <p className="mb-4">Arraste elementos da barra lateral para criar seu layout</p>
                    <Badge variant="outline" className="text-xs">
                      {elements.length} elementos
                    </Badge>
                  </div>
                ) : (
                  <SortableContext
                    items={elements.map(el => el.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {elements.map((element) => (
                        <SortableElement
                          key={element.id}
                          element={element}
                          selected={selectedElement === element.id}
                          onSelect={() => setSelectedElement(element.id)}
                          onDelete={() => deleteElement(element.id)}
                          onDuplicate={() => duplicateElement(element.id)}
                          onMove={(direction) => moveElement(element.id, direction)}
                          previewMode={previewMode}
                        >
                          {renderElement(element)}
                        </SortableElement>
                      ))}
                    </div>
                  </SortableContext>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Right Sidebar - Properties Panel */}
          {!previewMode && selectedElement && (
            <EnhancedPropertiesPanel
              element={elements.find(el => el.id === selectedElement)!}
              onUpdateProps={(props) => updateElementProps(selectedElement, props)}
              onUpdateStyles={(styles) => updateElementStyles(selectedElement, styles)}
              onClose={() => setSelectedElement(null)}
            />
          )}

          {/* Templates Modal */}
          {showTemplates && (
            <PageTemplates
              onSelectTemplate={applyTemplate}
              onClose={() => setShowTemplates(false)}
            />
          )}

          <DragOverlay>
            {activeId && draggedWidget && (
              <div className="bg-white shadow-lg p-4 rounded cursor-move border-2 border-blue-400">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                  <p className="text-sm font-medium">{draggedWidget}</p>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

// Enhanced Widget Item Component
function WidgetItem({ widget, onDragStart }: { widget: any; onDragStart: () => void }) {
  const Icon = widget.icon;
  
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 cursor-move transition-all duration-200 group"
    >
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900">{widget.label}</p>
        <p className="text-xs text-gray-500 truncate">{widget.category}</p>
      </div>
      <div className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors">
        <GripVertical className="w-full h-full" />
      </div>
    </div>
  );
}

// URL Selector Component - for selecting between custom URL or existing page
interface URLSelectorProps {
  value: string;
  onChange: (value: string) => void;
  urlType?: string;
  onUrlTypeChange?: (type: string) => void;
  label?: string;
}

function URLSelector({ value, onChange, urlType, onUrlTypeChange, label = "URL" }: URLSelectorProps) {
  const { data: pages, isLoading } = useQuery<any[]>({
    queryKey: ['/api/pages'],
  });

  const currentUrlType = urlType || (value && value.startsWith('/') && !value.startsWith('http') ? 'page' : 'custom');

  const handleUrlTypeChange = (type: string) => {
    if (onUrlTypeChange) {
      onUrlTypeChange(type);
    }
    if (type === 'page') {
      onChange('');
    }
  };

  const handlePageSelect = (pageSlug: string) => {
    onChange(`/${pageSlug}`);
  };

  const publishedPages = pages?.filter(page => page.isPublished) || [];

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <RadioGroup
        value={currentUrlType}
        onValueChange={handleUrlTypeChange}
        className="flex flex-col space-y-2"
        data-testid="url-type-selector"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="url-custom" data-testid="radio-url-custom" />
          <Label htmlFor="url-custom" className="font-normal cursor-pointer">
            URL Personalizada
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="page" id="url-page" data-testid="radio-url-page" />
          <Label htmlFor="url-page" className="font-normal cursor-pointer">
            Selecionar Página Existente
          </Label>
        </div>
      </RadioGroup>

      {currentUrlType === 'custom' && (
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... ou /caminho"
          data-testid="input-custom-url"
        />
      )}

      {currentUrlType === 'page' && (
        <Select
          value={value.startsWith('/') ? value.substring(1) : value}
          onValueChange={handlePageSelect}
          disabled={isLoading || publishedPages.length === 0}
        >
          <SelectTrigger data-testid="select-page">
            <SelectValue placeholder={isLoading ? "Carregando..." : publishedPages.length === 0 ? "Nenhuma página publicada" : "Selecione uma página"} />
          </SelectTrigger>
          <SelectContent>
            {publishedPages.map((page) => (
              <SelectItem key={page.id} value={page.slug} data-testid={`page-option-${page.slug}`}>
                {page.title} ({page.slug})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

// Enhanced Properties Panel Component
function EnhancedPropertiesPanel({ 
  element, 
  onUpdateProps, 
  onUpdateStyles, 
  onClose 
}: { 
  element: PageElement; 
  onUpdateProps: (props: Record<string, any>) => void; 
  onUpdateStyles: (styles: Record<string, any>) => void; 
  onClose: () => void; 
}) {
  const [activeTab, setActiveTab] = useState("content");

  const handlePropChange = (key: string, value: any) => {
    onUpdateProps({ ...element.props, [key]: value });
  };

  const handleStyleChange = (key: string, value: any) => {
    onUpdateStyles({ ...element.styles, [key]: value });
  };

  return (
    <div className="w-80 bg-white border-l flex flex-col shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Propriedades
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="px-4 py-2 border-b">
        <Badge variant="outline" className="text-xs">
          {element.type}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 m-4">
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="style">Estilo</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="content" className="px-4 pb-4">
            <div className="space-y-4">
              {element.type === "heading" && (
                <>
                  <div>
                    <Label>Texto</Label>
                    <Input
                      value={element.props.text || ""}
                      onChange={(e) => handlePropChange("text", e.target.value)}
                      placeholder="Digite o título"
                      data-testid="input-heading-text"
                    />
                  </div>
                  <div>
                    <Label>Nível</Label>
                    <Select
                      value={element.props.level?.toString() || "2"}
                      onValueChange={(value) => handlePropChange("level", parseInt(value))}
                    >
                      <SelectTrigger data-testid="select-heading-level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">H1</SelectItem>
                        <SelectItem value="2">H2</SelectItem>
                        <SelectItem value="3">H3</SelectItem>
                        <SelectItem value="4">H4</SelectItem>
                        <SelectItem value="5">H5</SelectItem>
                        <SelectItem value="6">H6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="heading-link"
                      checked={element.props.hasLink || false}
                      onCheckedChange={(checked) => handlePropChange("hasLink", checked)}
                      data-testid="switch-heading-link"
                    />
                    <Label htmlFor="heading-link" className="font-normal cursor-pointer">
                      Adicionar Link
                    </Label>
                  </div>
                  {element.props.hasLink && (
                    <URLSelector
                      value={element.props.url || ""}
                      onChange={(value) => handlePropChange("url", value)}
                      urlType={element.props.urlType}
                      onUrlTypeChange={(type) => handlePropChange("urlType", type)}
                      label="URL do Link"
                    />
                  )}
                </>
              )}

              {element.type === "text" && (
                <div>
                  <Label>Conteúdo</Label>
                  <EnhancedRichTextEditor
                    value={element.props.content || ""}
                    onChange={(value) => handlePropChange("content", value)}
                    placeholder="Digite o texto"
                    minHeight="150px"
                  />
                </div>
              )}

              {element.type === "button" && (
                <>
                  <div>
                    <Label>Texto</Label>
                    <Input
                      value={element.props.text || ""}
                      onChange={(e) => handlePropChange("text", e.target.value)}
                      placeholder="Texto do botão"
                      data-testid="input-button-text"
                    />
                  </div>
                  <URLSelector
                    value={element.props.url || ""}
                    onChange={(value) => handlePropChange("url", value)}
                    urlType={element.props.urlType}
                    onUrlTypeChange={(type) => handlePropChange("urlType", type)}
                    label="URL"
                  />
                  <div>
                    <Label>Estilo</Label>
                    <Select
                      value={element.props.style || "primary"}
                      onValueChange={(value) => handlePropChange("style", value)}
                    >
                      <SelectTrigger data-testid="select-button-style">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primário</SelectItem>
                        <SelectItem value="secondary">Secundário</SelectItem>
                        <SelectItem value="outline">Contorno</SelectItem>
                        <SelectItem value="ghost">Fantasma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {element.type === "image" && (
                <>
                  <div>
                    <Label>URL da Imagem</Label>
                    <Input
                      value={element.props.url || ""}
                      onChange={(e) => handlePropChange("url", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label>Texto Alternativo</Label>
                    <Input
                      value={element.props.alt || ""}
                      onChange={(e) => handlePropChange("alt", e.target.value)}
                      placeholder="Descrição da imagem"
                    />
                  </div>
                </>
              )}

              {element.type === "hero" && (
                <>
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={element.props.title || ""}
                      onChange={(e) => handlePropChange("title", e.target.value)}
                      placeholder="Título principal"
                      data-testid="input-hero-title"
                    />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Input
                      value={element.props.subtitle || ""}
                      onChange={(e) => handlePropChange("subtitle", e.target.value)}
                      placeholder="Subtítulo"
                      data-testid="input-hero-subtitle"
                    />
                  </div>
                  <div>
                    <Label>Texto do Botão</Label>
                    <Input
                      value={element.props.buttonText || ""}
                      onChange={(e) => handlePropChange("buttonText", e.target.value)}
                      placeholder="Texto do botão"
                      data-testid="input-hero-button-text"
                    />
                  </div>
                  <URLSelector
                    value={element.props.buttonUrl || ""}
                    onChange={(value) => handlePropChange("buttonUrl", value)}
                    urlType={element.props.buttonUrlType}
                    onUrlTypeChange={(type) => handlePropChange("buttonUrlType", type)}
                    label="URL do Botão"
                  />
                  <div>
                    <Label>Imagem de Fundo</Label>
                    <Input
                      value={element.props.backgroundImage || ""}
                      onChange={(e) => handlePropChange("backgroundImage", e.target.value)}
                      placeholder="URL da imagem"
                      data-testid="input-hero-background"
                    />
                  </div>
                </>
              )}

              {element.type === "spacer" && (
                <div>
                  <Label>Altura</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[parseInt(element.props.height) || 32]}
                      onValueChange={([value]) => handlePropChange("height", `${value}px`)}
                      min={16}
                      max={200}
                      step={8}
                    />
                    <div className="text-xs text-gray-500 text-center">
                      {element.props.height || "32px"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="style" className="px-4 pb-4">
            <div className="space-y-4">
              {/* Colors */}
              <div>
                <Label>Cor do Texto</Label>
                <div className="flex gap-2">
                  <Input
                    value={element.styles.color || ""}
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    placeholder="#000000"
                  />
                  <input
                    type="color"
                    value={element.styles.color || "#000000"}
                    onChange={(e) => handleStyleChange("color", e.target.value)}
                    className="w-10 h-10 border rounded cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <Label>Cor de Fundo</Label>
                <div className="flex gap-2">
                  <Input
                    value={element.styles.backgroundColor || ""}
                    onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                    placeholder="transparent"
                  />
                  <input
                    type="color"
                    value={element.styles.backgroundColor || "#ffffff"}
                    onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                    className="w-10 h-10 border rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Typography */}
              <div>
                <Label>Tamanho da Fonte</Label>
                <Select
                  value={element.styles.fontSize || ""}
                  onValueChange={(value) => handleStyleChange("fontSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.75rem">Muito Pequeno</SelectItem>
                    <SelectItem value="0.875rem">Pequeno</SelectItem>
                    <SelectItem value="1rem">Normal</SelectItem>
                    <SelectItem value="1.125rem">Grande</SelectItem>
                    <SelectItem value="1.25rem">Muito Grande</SelectItem>
                    <SelectItem value="1.5rem">Extra Grande</SelectItem>
                    <SelectItem value="2rem">Gigante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Peso da Fonte</Label>
                <Select
                  value={element.styles.fontWeight || ""}
                  onValueChange={(value) => handleStyleChange("fontWeight", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Leve</SelectItem>
                    <SelectItem value="400">Normal</SelectItem>
                    <SelectItem value="500">Médio</SelectItem>
                    <SelectItem value="600">Semi-negrito</SelectItem>
                    <SelectItem value="700">Negrito</SelectItem>
                    <SelectItem value="800">Extra Negrito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Alignment */}
              <div>
                <Label>Alinhamento</Label>
                <div className="flex gap-1">
                  <Button
                    variant={element.styles.textAlign === "left" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStyleChange("textAlign", "left")}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={element.styles.textAlign === "center" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStyleChange("textAlign", "center")}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={element.styles.textAlign === "right" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStyleChange("textAlign", "right")}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={element.styles.textAlign === "justify" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStyleChange("textAlign", "justify")}
                  >
                    <AlignJustify className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <Label>Bordas Arredondadas</Label>
                <div className="space-y-2">
                  <Slider
                    value={[parseInt(element.styles.borderRadius || "0") || 0]}
                    onValueChange={([value]) => handleStyleChange("borderRadius", `${value}px`)}
                    min={0}
                    max={50}
                    step={1}
                  />
                  <div className="text-xs text-gray-500 text-center">
                    {element.styles.borderRadius || "0px"}
                  </div>
                </div>
              </div>

              {/* Opacity */}
              <div>
                <Label>Opacidade</Label>
                <div className="space-y-2">
                  <Slider
                    value={[parseFloat(element.styles.opacity || "1") * 100 || 100]}
                    onValueChange={([value]) => handleStyleChange("opacity", (value / 100).toString())}
                    min={0}
                    max={100}
                    step={5}
                  />
                  <div className="text-xs text-gray-500 text-center">
                    {Math.round((parseFloat(element.styles.opacity || "1") || 1) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="px-4 pb-4">
            <div className="space-y-4">
              {/* Spacing */}
              <div>
                <Label>Espaçamento Interno (Padding)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Cima"
                    value={element.styles.paddingTop || ""}
                    onChange={(e) => handleStyleChange("paddingTop", e.target.value)}
                  />
                  <Input
                    placeholder="Baixo"
                    value={element.styles.paddingBottom || ""}
                    onChange={(e) => handleStyleChange("paddingBottom", e.target.value)}
                  />
                  <Input
                    placeholder="Esquerda"
                    value={element.styles.paddingLeft || ""}
                    onChange={(e) => handleStyleChange("paddingLeft", e.target.value)}
                  />
                  <Input
                    placeholder="Direita"
                    value={element.styles.paddingRight || ""}
                    onChange={(e) => handleStyleChange("paddingRight", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Espaçamento Externo (Margin)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Cima"
                    value={element.styles.marginTop || ""}
                    onChange={(e) => handleStyleChange("marginTop", e.target.value)}
                  />
                  <Input
                    placeholder="Baixo"
                    value={element.styles.marginBottom || ""}
                    onChange={(e) => handleStyleChange("marginBottom", e.target.value)}
                  />
                  <Input
                    placeholder="Esquerda"
                    value={element.styles.marginLeft || ""}
                    onChange={(e) => handleStyleChange("marginLeft", e.target.value)}
                  />
                  <Input
                    placeholder="Direita"
                    value={element.styles.marginRight || ""}
                    onChange={(e) => handleStyleChange("marginRight", e.target.value)}
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <Label>Largura</Label>
                <Input
                  placeholder="auto"
                  value={element.styles.width || ""}
                  onChange={(e) => handleStyleChange("width", e.target.value)}
                />
              </div>

              <div>
                <Label>Altura</Label>
                <Input
                  placeholder="auto"
                  value={element.styles.height || ""}
                  onChange={(e) => handleStyleChange("height", e.target.value)}
                />
              </div>

              {/* Display */}
              <div>
                <Label>Tipo de Display</Label>
                <Select
                  value={element.styles.display || ""}
                  onValueChange={(value) => handleStyleChange("display", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="block">Block</SelectItem>
                    <SelectItem value="inline">Inline</SelectItem>
                    <SelectItem value="inline-block">Inline Block</SelectItem>
                    <SelectItem value="flex">Flex</SelectItem>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="none">Oculto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Flexbox controls when display is flex */}
              {element.styles.display === "flex" && (
                <>
                  <div>
                    <Label>Direção Flex</Label>
                    <Select
                      value={element.styles.flexDirection || ""}
                      onValueChange={(value) => handleStyleChange("flexDirection", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="row">Linha</SelectItem>
                        <SelectItem value="column">Coluna</SelectItem>
                        <SelectItem value="row-reverse">Linha Reversa</SelectItem>
                        <SelectItem value="column-reverse">Coluna Reversa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Justificar Conteúdo</Label>
                    <Select
                      value={element.styles.justifyContent || ""}
                      onValueChange={(value) => handleStyleChange("justifyContent", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flex-start">Início</SelectItem>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="flex-end">Fim</SelectItem>
                        <SelectItem value="space-between">Espaço Entre</SelectItem>
                        <SelectItem value="space-around">Espaço Ao Redor</SelectItem>
                        <SelectItem value="space-evenly">Espaço Uniforme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Alinhar Itens</Label>
                    <Select
                      value={element.styles.alignItems || ""}
                      onValueChange={(value) => handleStyleChange("alignItems", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flex-start">Início</SelectItem>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="flex-end">Fim</SelectItem>
                        <SelectItem value="stretch">Esticar</SelectItem>
                        <SelectItem value="baseline">Linha Base</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Position */}
              <div>
                <Label>Posição</Label>
                <Select
                  value={element.styles.position || ""}
                  onValueChange={(value) => handleStyleChange("position", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">Estático</SelectItem>
                    <SelectItem value="relative">Relativo</SelectItem>
                    <SelectItem value="absolute">Absoluto</SelectItem>
                    <SelectItem value="fixed">Fixo</SelectItem>
                    <SelectItem value="sticky">Pegajoso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

// Enhanced Sortable Element Component
function SortableElement({ 
  element, 
  selected, 
  onSelect, 
  onDelete, 
  onDuplicate, 
  onMove, 
  previewMode,
  children 
}: {
  element: PageElement;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (direction: "up" | "down") => void;
  previewMode: boolean;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (previewMode) {
    return <div>{children}</div>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group rounded-lg transition-all duration-200",
        selected && "ring-2 ring-blue-500 ring-opacity-50"
      )}
      onClick={onSelect}
    >
      {children}
      
      {/* Element Controls */}
      <div className={cn(
        "absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
        selected && "opacity-100"
      )}>
        <Button
          size="sm"
          variant="secondary"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onMove("up");
          }}
          title="Mover para cima"
        >
          <ChevronUp className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onMove("down");
          }}
          title="Mover para baixo"
        >
          <ChevronDown className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          title="Duplicar"
        >
          <Copy className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Excluir"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-gray-400 rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
          selected && "opacity-100"
        )}
        title="Arrastar para reordenar"
      >
        <GripVertical className="w-3 h-3 text-white" />
      </div>

      {/* Element Type Badge */}
      <div className={cn(
        "absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity",
        selected && "opacity-100"
      )}>
        <Badge variant="secondary" className="text-xs px-2 py-1">
          {element.type}
        </Badge>
      </div>
    </div>
  );
}