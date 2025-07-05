import { useState, useRef, useEffect } from "react";
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
  Active,
  Over
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
  Table
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Type definitions
interface Widget {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  defaultProps: Record<string, any>;
}

interface WidgetCategory {
  title: string;
  widgets: Widget[];
}

// Widget definitions
const widgetCategories: Record<string, WidgetCategory> = {
  basic: {
    title: "Elementos Básicos",
    widgets: [
      { id: "heading", icon: Heading1, label: "Título", defaultProps: { level: 1, text: "Novo Título", align: "left" } },
      { id: "text", icon: FileText, label: "Texto", defaultProps: { content: "Novo parágrafo de texto", align: "left" } },
      { id: "button", icon: Square, label: "Botão", defaultProps: { text: "Clique aqui", url: "#", style: "primary", size: "medium" } },
      { id: "image", icon: Image, label: "Imagem", defaultProps: { url: "", alt: "", width: "100%", height: "auto" } },
      { id: "video", icon: Film, label: "Vídeo", defaultProps: { url: "", type: "youtube", autoplay: false } },
      { id: "divider", icon: Minus, label: "Divisor", defaultProps: { style: "solid", color: "#e5e7eb", thickness: 1 } },
      { id: "spacer", icon: Layers, label: "Espaçador", defaultProps: { height: 50 } },
      { id: "columns", icon: Grid, label: "Colunas", defaultProps: { columns: 2, gap: 20, items: [] } },
    ]
  },
  content: {
    title: "Elementos de Conteúdo",
    widgets: [
      { id: "hero", icon: Square, label: "Hero Banner", defaultProps: { title: "Bem-vindo", subtitle: "Subtítulo", bgImage: "", height: 400 } },
      { id: "card", icon: Square, label: "Card", defaultProps: { title: "Título do Card", content: "Conteúdo", image: "", style: "default" } },
      { id: "testimonial", icon: MessageSquare, label: "Testemunho", defaultProps: { name: "Nome", content: "Testemunho", location: "Local", image: "" } },
      { id: "gallery", icon: Grid, label: "Galeria", defaultProps: { images: [], columns: 3, gap: 10 } },
      { id: "accordion", icon: List, label: "Accordion", defaultProps: { items: [] } },
      { id: "tabs", icon: Square, label: "Abas", defaultProps: { tabs: [] } },
      { id: "quote", icon: Quote, label: "Citação", defaultProps: { text: "Citação", author: "Autor" } },
      { id: "table", icon: Table, label: "Tabela", defaultProps: { headers: [], rows: [] } },
    ]
  },
  forms: {
    title: "Formulários",
    widgets: [
      { id: "contact-form", icon: Mail, label: "Formulário Contato", defaultProps: { fields: ["name", "email", "message"] } },
      { id: "newsletter", icon: Mail, label: "Newsletter", defaultProps: { placeholder: "Seu email", buttonText: "Inscrever" } },
      { id: "prayer-request", icon: BookOpen, label: "Pedido de Oração", defaultProps: { fields: ["name", "request"] } },
      { id: "event-registration", icon: Calendar, label: "Inscrição Evento", defaultProps: { eventId: null } },
      { id: "donation-form", icon: DollarSign, label: "Formulário Doação", defaultProps: { campaigns: [] } },
    ]
  },
  church: {
    title: "Elementos Igreja",
    widgets: [
      { id: "service-times", icon: Clock, label: "Horários Cultos", defaultProps: {} },
      { id: "pastor-message", icon: MessageSquare, label: "Mensagem Pastor", defaultProps: {} },
      { id: "events-list", icon: Calendar, label: "Lista Eventos", defaultProps: { limit: 3, style: "grid" } },
      { id: "bible-verse", icon: BookOpen, label: "Versículo", defaultProps: {} },
      { id: "live-stream", icon: Radio, label: "Transmissão", defaultProps: {} },
      { id: "ministries", icon: Users, label: "Ministérios", defaultProps: { style: "cards" } },
      { id: "blog-posts", icon: FileText, label: "Posts Blog", defaultProps: { limit: 3, category: "all" } },
      { id: "testimonials-slider", icon: MessageSquare, label: "Testemunhos", defaultProps: { autoplay: true } },
    ]
  },
  advanced: {
    title: "Avançados",
    widgets: [
      { id: "map", icon: MapPin, label: "Mapa", defaultProps: { address: "", zoom: 15, height: 400 } },
      { id: "countdown", icon: Clock, label: "Contagem Regressiva", defaultProps: { date: "", title: "Evento" } },
      { id: "social-feed", icon: Share2, label: "Feed Social", defaultProps: { platform: "instagram", username: "" } },
      { id: "custom-html", icon: Code, label: "HTML Personalizado", defaultProps: { content: "" } },
      { id: "iframe", icon: Square, label: "iFrame", defaultProps: { url: "", height: 400 } },
    ]
  }
};

interface PageElement {
  id: string;
  type: string;
  props: any;
  children?: PageElement[];
}

interface VisualPageBuilderProps {
  initialContent?: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

export default function VisualPageBuilder({ initialContent, onSave, onCancel }: VisualPageBuilderProps) {
  const [elements, setElements] = useState<PageElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedWidget, setDraggedWidget] = useState<any>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [history, setHistory] = useState<PageElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [devicePreview, setDevicePreview] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
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
      const widget = Object.values(widgetCategories)
        .flatMap(cat => cat.widgets)
        .find((w: any) => w.id === draggedWidget);
      
      if (widget && typeof widget === 'object' && 'id' in widget && 'defaultProps' in widget) {
        const newElement: PageElement = {
          id: `element-${Date.now()}`,
          type: widget.id as string,
          props: { ...(widget as any).defaultProps }
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
        props: { ...element.props }
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

  const updateElementProps = (id: string, newProps: Record<string, any>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, props: { ...el.props, ...newProps } } : el
    );
    setElements(newElements);
    saveToHistory(newElements);
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

  // Render element preview
  const renderElement = (element: PageElement) => {
    const baseClasses = "relative group border-2 border-transparent hover:border-blue-400 transition-colors p-4 cursor-move";
    
    switch (element.type) {
      case "heading":
        const HeadingTag = `h${element.props.level}` as keyof JSX.IntrinsicElements;
        return (
          <div className={cn(baseClasses, `text-${element.props.align}`)}>
            <HeadingTag className={cn("font-bold", {
              "text-4xl": element.props.level === 1,
              "text-3xl": element.props.level === 2,
              "text-2xl": element.props.level === 3,
              "text-xl": element.props.level === 4,
            })}>
              {element.props.text}
            </HeadingTag>
          </div>
        );
      
      case "text":
        return (
          <div className={cn(baseClasses, `text-${element.props.align}`)}>
            <p>{element.props.content}</p>
          </div>
        );
      
      case "button":
        return (
          <div className={baseClasses}>
            <Button 
              variant={element.props.style}
              size={element.props.size}
              className="pointer-events-none"
            >
              {element.props.text}
            </Button>
          </div>
        );
      
      case "image":
        return (
          <div className={baseClasses}>
            {element.props.url ? (
              <img 
                src={element.props.url} 
                alt={element.props.alt}
                style={{ width: element.props.width, height: element.props.height }}
                className="max-w-full"
              />
            ) : (
              <div className="bg-gray-200 p-8 text-center text-gray-500">
                <Image className="w-12 h-12 mx-auto mb-2" />
                <p>Clique para adicionar imagem</p>
              </div>
            )}
          </div>
        );
      
      case "spacer":
        return (
          <div className={baseClasses} style={{ height: element.props.height }}>
            <div className="h-full bg-gray-100 flex items-center justify-center text-gray-400">
              Espaçador {element.props.height}px
            </div>
          </div>
        );
      
      default:
        return (
          <div className={baseClasses}>
            <div className="bg-gray-100 p-4 text-center text-gray-500">
              <Square className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">{element.type}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b p-3 flex items-center justify-between">
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
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex === history.length - 1}
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
            <Button
              variant={devicePreview === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDevicePreview("desktop")}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={devicePreview === "tablet" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDevicePreview("tablet")}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={devicePreview === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDevicePreview("mobile")}
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
          {/* Left Sidebar - Widget Panel */}
          {!previewMode && (
            <div className="w-80 bg-white border-r flex flex-col">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Elementos</h3>
              </div>
              
              <ScrollArea className="flex-1">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 m-4">
                    <TabsTrigger value="basic">Básicos</TabsTrigger>
                    <TabsTrigger value="content">Conteúdo</TabsTrigger>
                    <TabsTrigger value="church">Igreja</TabsTrigger>
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

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto bg-gray-100 p-8">
            <div 
              className={cn(
                "mx-auto bg-white shadow-lg transition-all duration-300",
                {
                  "max-w-[375px]": devicePreview === "mobile",
                  "max-w-[768px]": devicePreview === "tablet",
                  "max-w-5xl": devicePreview === "desktop",
                }
              )}
            >
              <div className="min-h-[600px] p-8">
                {elements.length === 0 ? (
                  <div className="text-center py-24 text-gray-500">
                    <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Comece a construir sua página</h3>
                    <p>Arraste elementos da barra lateral para criar seu layout</p>
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

          {/* Right Sidebar - Properties Panel */}
          {!previewMode && selectedElement && (
            <PropertiesPanel
              element={elements.find(el => el.id === selectedElement)}
              onUpdate={(props) => updateElementProps(selectedElement, props)}
              onClose={() => setSelectedElement(null)}
            />
          )}

          <DragOverlay>
            {activeId && draggedWidget && (
              <div className="bg-white shadow-lg p-4 rounded cursor-move">
                <p className="text-sm font-medium">{draggedWidget}</p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

// Widget Item Component
function WidgetItem({ widget, onDragStart }: { widget: any; onDragStart: () => void }) {
  const Icon = widget.icon;
  
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
    >
      <Icon className="w-5 h-5 text-gray-600" />
      <span className="text-sm font-medium">{widget.label}</span>
    </div>
  );
}

// Sortable Element Component
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableElementProps {
  element: PageElement;
  children: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (direction: "up" | "down") => void;
  previewMode: boolean;
}

function SortableElement({ 
  element, 
  children, 
  selected, 
  onSelect, 
  onDelete, 
  onDuplicate, 
  onMove,
  previewMode 
}: SortableElementProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        selected && !previewMode && "ring-2 ring-blue-500 ring-offset-2"
      )}
      onClick={!previewMode ? onSelect : undefined}
    >
      {!previewMode && (
        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            size="sm"
            variant="secondary"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onMove("up");
            }}
          >
            <ChevronUp className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onMove("down");
            }}
          >
            <ChevronDown className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}
      
      <div {...attributes} {...listeners}>
        {children}
      </div>
    </div>
  );
}

// Properties Panel Component
interface PropertiesPanelProps {
  element: PageElement | undefined;
  onUpdate: (props: Record<string, any>) => void;
  onClose: () => void;
}

function PropertiesPanel({ element, onUpdate, onClose }: PropertiesPanelProps) {
  if (!element) return null;

  return (
    <div className="w-80 bg-white border-l flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Propriedades</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          ✕
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Dynamic properties based on element type */}
          {element.type === "heading" && (
            <>
              <div className="space-y-2">
                <Label>Texto</Label>
                <Input
                  value={element.props.text}
                  onChange={(e) => onUpdate({ text: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Nível</Label>
                <Select
                  value={element.props.level.toString()}
                  onValueChange={(value) => onUpdate({ level: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">H1</SelectItem>
                    <SelectItem value="2">H2</SelectItem>
                    <SelectItem value="3">H3</SelectItem>
                    <SelectItem value="4">H4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Alinhamento</Label>
                <div className="flex gap-2">
                  <Button
                    variant={element.props.align === "left" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdate({ align: "left" })}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={element.props.align === "center" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdate({ align: "center" })}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={element.props.align === "right" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdate({ align: "right" })}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {element.type === "text" && (
            <>
              <div className="space-y-2">
                <Label>Conteúdo</Label>
                <Textarea
                  value={element.props.content}
                  onChange={(e) => onUpdate({ content: e.target.value })}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Alinhamento</Label>
                <div className="flex gap-2">
                  <Button
                    variant={element.props.align === "left" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdate({ align: "left" })}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={element.props.align === "center" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdate({ align: "center" })}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={element.props.align === "right" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdate({ align: "right" })}
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={element.props.align === "justify" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdate({ align: "justify" })}
                  >
                    <AlignJustify className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {element.type === "button" && (
            <>
              <div className="space-y-2">
                <Label>Texto</Label>
                <Input
                  value={element.props.text}
                  onChange={(e) => onUpdate({ text: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Link</Label>
                <Input
                  value={element.props.url}
                  onChange={(e) => onUpdate({ url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Estilo</Label>
                <Select
                  value={element.props.style}
                  onValueChange={(value) => onUpdate({ style: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primário</SelectItem>
                    <SelectItem value="secondary">Secundário</SelectItem>
                    <SelectItem value="outline">Contorno</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Tamanho</Label>
                <Select
                  value={element.props.size}
                  onValueChange={(value) => onUpdate({ size: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Pequeno</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="lg">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          {element.type === "image" && (
            <>
              <div className="space-y-2">
                <Label>URL da Imagem</Label>
                <Input
                  value={element.props.url}
                  onChange={(e) => onUpdate({ url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Texto Alternativo</Label>
                <Input
                  value={element.props.alt}
                  onChange={(e) => onUpdate({ alt: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Largura</Label>
                <Input
                  value={element.props.width}
                  onChange={(e) => onUpdate({ width: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Altura</Label>
                <Input
                  value={element.props.height}
                  onChange={(e) => onUpdate({ height: e.target.value })}
                />
              </div>
            </>
          )}
          
          {element.type === "spacer" && (
            <div className="space-y-2">
              <Label>Altura (px)</Label>
              <Slider
                value={[element.props.height]}
                onValueChange={(value) => onUpdate({ height: value[0] })}
                min={10}
                max={200}
                step={10}
              />
              <div className="text-sm text-gray-500 text-center">
                {element.props.height}px
              </div>
            </div>
          )}
          
          {/* Add more property panels for other element types */}
        </div>
      </ScrollArea>
    </div>
  );
}