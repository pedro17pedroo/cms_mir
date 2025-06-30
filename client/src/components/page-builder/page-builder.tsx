import { useState, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Eye, 
  Undo, 
  Redo, 
  Settings,
  Type,
  Image,
  Layout,
  Square,
  Columns,
  Menu,
  MousePointer,
  FormInput,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Video,
  FileText,
  Users,
  Star,
  MessageCircle,
  Heart,
  Play,
  Grid3x3,
  Palette
} from 'lucide-react';

// Widget types
export interface Widget {
  id: string;
  type: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'basic' | 'content' | 'forms' | 'media' | 'church' | 'advanced';
  props?: Record<string, any>;
  content?: string;
  styles?: Record<string, any>;
}

// Page element structure
export interface PageElement {
  id: string;
  type: string;
  props: Record<string, any>;
  content?: string;
  styles?: Record<string, any>;
  children?: PageElement[];
}

// Available widgets
const AVAILABLE_WIDGETS: Widget[] = [
  // Basic Elements
  { id: 'heading', type: 'heading', name: 'Título', icon: Type, category: 'basic' },
  { id: 'text', type: 'text', name: 'Texto', icon: FileText, category: 'basic' },
  { id: 'button', type: 'button', name: 'Botão', icon: MousePointer, category: 'basic' },
  { id: 'image', type: 'image', name: 'Imagem', icon: Image, category: 'basic' },
  { id: 'spacer', type: 'spacer', name: 'Espaçador', icon: Square, category: 'basic' },
  
  // Layout Elements
  { id: 'container', type: 'container', name: 'Container', icon: Layout, category: 'basic' },
  { id: 'columns', type: 'columns', name: 'Colunas', icon: Columns, category: 'basic' },
  { id: 'section', type: 'section', name: 'Seção', icon: Grid3x3, category: 'basic' },
  
  // Content Elements
  { id: 'hero', type: 'hero', name: 'Hero Banner', icon: Layout, category: 'content' },
  { id: 'testimonial', type: 'testimonial', name: 'Testemunho', icon: MessageCircle, category: 'content' },
  { id: 'card', type: 'card', name: 'Card', icon: Square, category: 'content' },
  { id: 'gallery', type: 'gallery', name: 'Galeria', icon: Image, category: 'content' },
  
  // Forms
  { id: 'contact-form', type: 'contact-form', name: 'Formulário Contato', icon: FormInput, category: 'forms' },
  { id: 'newsletter', type: 'newsletter', name: 'Newsletter', icon: Mail, category: 'forms' },
  { id: 'prayer-request', type: 'prayer-request', name: 'Pedido de Oração', icon: Heart, category: 'forms' },
  
  // Media
  { id: 'video', type: 'video', name: 'Vídeo', icon: Video, category: 'media' },
  { id: 'audio', type: 'audio', name: 'Áudio', icon: Play, category: 'media' },
  { id: 'youtube', type: 'youtube', name: 'YouTube', icon: Play, category: 'media' },
  
  // Church Specific
  { id: 'service-times', type: 'service-times', name: 'Horários Cultos', icon: Calendar, category: 'church' },
  { id: 'pastor-message', type: 'pastor-message', name: 'Mensagem Pastor', icon: Users, category: 'church' },
  { id: 'events-list', type: 'events-list', name: 'Lista Eventos', icon: Calendar, category: 'church' },
  { id: 'donation-widget', type: 'donation-widget', name: 'Widget Doação', icon: Heart, category: 'church' },
  { id: 'bible-verse', type: 'bible-verse', name: 'Versículo', icon: FileText, category: 'church' },
  { id: 'live-stream', type: 'live-stream', name: 'Transmissão', icon: Video, category: 'church' },
  
  // Advanced
  { id: 'map', type: 'map', name: 'Mapa', icon: MapPin, category: 'advanced' },
  { id: 'countdown', type: 'countdown', name: 'Countdown', icon: Calendar, category: 'advanced' },
  { id: 'social-feed', type: 'social-feed', name: 'Feed Social', icon: Users, category: 'advanced' },
  { id: 'rating', type: 'rating', name: 'Avaliação', icon: Star, category: 'advanced' },
];

interface PageBuilderProps {
  pageId?: string;
  onSave: (elements: PageElement[]) => void;
  onPreview: () => void;
}

export default function PageBuilder({ pageId, onSave, onPreview }: PageBuilderProps) {
  const [elements, setElements] = useState<PageElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [history, setHistory] = useState<PageElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('widgets');

  const saveToHistory = useCallback((newElements: PageElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  };

  const addElement = (widget: Widget, index?: number) => {
    const newElement: PageElement = {
      id: `${widget.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: widget.type,
      props: widget.props || {},
      content: widget.content || getDefaultContent(widget.type),
      styles: widget.styles || {},
    };

    const newElements = [...elements];
    if (index !== undefined) {
      newElements.splice(index, 0, newElement);
    } else {
      newElements.push(newElement);
    }
    
    setElements(newElements);
    saveToHistory(newElements);
  };

  const removeElement = (elementId: string) => {
    const newElements = elements.filter(el => el.id !== elementId);
    setElements(newElements);
    saveToHistory(newElements);
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
  };

  const updateElement = (elementId: string, updates: Partial<PageElement>) => {
    const newElements = elements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
    setElements(newElements);
    saveToHistory(newElements);
  };

  const moveElement = (dragIndex: number, hoverIndex: number) => {
    const newElements = [...elements];
    const draggedElement = newElements[dragIndex];
    newElements.splice(dragIndex, 1);
    newElements.splice(hoverIndex, 0, draggedElement);
    setElements(newElements);
    saveToHistory(newElements);
  };

  const getDefaultContent = (type: string): string => {
    const defaults: Record<string, string> = {
      heading: 'Novo Título',
      text: 'Digite seu texto aqui...',
      button: 'Clique Aqui',
      hero: 'Bem-vindos à Nossa Igreja',
      testimonial: 'Compartilhe seu testemunho...',
      'pastor-message': 'Mensagem do Pastor',
      'bible-verse': 'Porque Deus amou o mundo...',
    };
    return defaults[type] || '';
  };

  const groupedWidgets = AVAILABLE_WIDGETS.reduce((acc, widget) => {
    if (!acc[widget.category]) acc[widget.category] = [];
    acc[widget.category].push(widget);
    return acc;
  }, {} as Record<string, Widget[]>);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex bg-gray-50">
        {/* Left Sidebar - Widgets & Settings */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Page Builder</h2>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={() => onSave(elements)} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={onPreview} className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
              <TabsTrigger value="widgets">Widgets</TabsTrigger>
              <TabsTrigger value="structure">Estrutura</TabsTrigger>
              <TabsTrigger value="settings">Config</TabsTrigger>
            </TabsList>

            <TabsContent value="widgets" className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-6">
                  {Object.entries(groupedWidgets).map(([category, widgets]) => (
                    <div key={category}>
                      <h3 className="text-sm font-medium text-gray-700 mb-3 capitalize">
                        {category === 'basic' ? 'Básicos' :
                         category === 'content' ? 'Conteúdo' :
                         category === 'forms' ? 'Formulários' :
                         category === 'media' ? 'Mídia' :
                         category === 'church' ? 'Igreja' : 'Avançados'}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {widgets.map((widget) => (
                          <WidgetItem
                            key={widget.id}
                            widget={widget}
                            onAdd={() => addElement(widget)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="structure" className="flex-1 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Elementos da Página</h3>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={undo} disabled={historyIndex === 0}>
                      <Undo className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={redo} disabled={historyIndex === history.length - 1}>
                      <Redo className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-96">
                  {elements.map((element, index) => (
                    <ElementItem
                      key={element.id}
                      element={element}
                      index={index}
                      isSelected={selectedElement === element.id}
                      onSelect={() => setSelectedElement(element.id)}
                      onRemove={() => removeElement(element.id)}
                      onMove={moveElement}
                    />
                  ))}
                  {elements.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <Layout className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Arraste widgets aqui para começar</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 p-4">
              {selectedElement ? (
                <ElementSettings
                  element={elements.find(el => el.id === selectedElement)!}
                  onUpdate={(updates) => updateElement(selectedElement, updates)}
                />
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Selecione um elemento para configurar</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-900">Editor de Página</h1>
                <Separator orientation="vertical" className="h-6" />
                <span className="text-sm text-gray-500">{elements.length} elementos</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Palette className="w-4 h-4 mr-2" />
                  Tema
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
              <CanvasArea
                elements={elements}
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
                onAddElement={addElement}
                onUpdateElement={updateElement}
                onMoveElement={moveElement}
              />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

// Widget item component for dragging
function WidgetItem({ widget, onAdd }: { widget: Widget; onAdd: () => void }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'widget',
    item: { widget },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      onClick={onAdd}
      className={`p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <widget.icon className="w-6 h-6 text-gray-600" />
        <span className="text-xs font-medium text-gray-700 text-center">
          {widget.name}
        </span>
      </div>
    </div>
  );
}

// Element item in structure tab
function ElementItem({ 
  element, 
  index, 
  isSelected, 
  onSelect, 
  onRemove, 
  onMove 
}: { 
  element: PageElement; 
  index: number; 
  isSelected: boolean; 
  onSelect: () => void; 
  onRemove: () => void; 
  onMove: (dragIndex: number, hoverIndex: number) => void; 
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    { index: number },
    void,
    { handlerId: string | symbol | null }
  >({
    accept: 'element',
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'element',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const widget = AVAILABLE_WIDGETS.find(w => w.type === element.type);

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`p-3 border rounded-lg cursor-pointer transition-colors mb-2 ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {widget && <widget.icon className="w-4 h-4 text-gray-600" />}
          <span className="text-sm font-medium text-gray-900">
            {widget?.name || element.type}
          </span>
        </div>
        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
          ✕
        </Button>
      </div>
    </div>
  );
}

// Element settings panel
function ElementSettings({ 
  element, 
  onUpdate 
}: { 
  element: PageElement; 
  onUpdate: (updates: Partial<PageElement>) => void; 
}) {
  const widget = AVAILABLE_WIDGETS.find(w => w.type === element.type);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        {widget && <widget.icon className="w-5 h-5 text-gray-600" />}
        <h3 className="text-sm font-medium text-gray-900">{widget?.name}</h3>
      </div>
      
      {/* Content settings */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-2 block">Conteúdo</label>
        <textarea
          value={element.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded text-sm"
          rows={3}
        />
      </div>

      {/* Style settings */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-gray-700">Estilo</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-600">Padding</label>
            <input
              type="text"
              placeholder="16px"
              className="w-full p-1 border border-gray-300 rounded text-xs"
              onChange={(e) => onUpdate({ 
                styles: { ...element.styles, padding: e.target.value } 
              })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Margin</label>
            <input
              type="text"
              placeholder="8px"
              className="w-full p-1 border border-gray-300 rounded text-xs"
              onChange={(e) => onUpdate({ 
                styles: { ...element.styles, margin: e.target.value } 
              })}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-600">Cor de Fundo</label>
          <input
            type="color"
            className="w-full h-8 border border-gray-300 rounded"
            onChange={(e) => onUpdate({ 
              styles: { ...element.styles, backgroundColor: e.target.value } 
            })}
          />
        </div>
      </div>
    </div>
  );
}

// Canvas area component
function CanvasArea({
  elements,
  selectedElement,
  onSelectElement,
  onAddElement,
  onUpdateElement,
  onMoveElement,
}: {
  elements: PageElement[];
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
  onAddElement: (widget: Widget, index?: number) => void;
  onUpdateElement: (id: string, updates: Partial<PageElement>) => void;
  onMoveElement: (dragIndex: number, hoverIndex: number) => void;
}) {
  const [{ isOver }, drop] = useDrop({
    accept: 'widget',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: (item: { widget: Widget }) => {
      onAddElement(item.widget);
    },
  });

  return (
    <div
      ref={drop}
      className={`min-h-screen bg-white rounded-lg shadow-sm border-2 border-dashed transition-colors ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}
      onClick={() => onSelectElement(null)}
    >
      {elements.length === 0 ? (
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <Layout className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Canvas Vazio</h3>
            <p className="text-sm">Arraste widgets da barra lateral para começar a construir sua página</p>
          </div>
        </div>
      ) : (
        <div className="p-8 space-y-4">
          {elements.map((element, index) => (
            <ElementRenderer
              key={element.id}
              element={element}
              isSelected={selectedElement === element.id}
              onSelect={() => onSelectElement(element.id)}
              onUpdate={(updates) => onUpdateElement(element.id, updates)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Element renderer for canvas
function ElementRenderer({
  element,
  isSelected,
  onSelect,
  onUpdate,
}: {
  element: PageElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<PageElement>) => void;
}) {
  const renderElement = () => {
    const styles = {
      padding: element.styles?.padding || '16px',
      margin: element.styles?.margin || '8px',
      backgroundColor: element.styles?.backgroundColor || 'transparent',
      ...element.styles,
    };

    switch (element.type) {
      case 'heading':
        return (
          <h2 className="text-2xl font-bold text-gray-900" style={styles}>
            {element.content}
          </h2>
        );
      case 'text':
        return (
          <p className="text-gray-700" style={styles}>
            {element.content}
          </p>
        );
      case 'button':
        return (
          <Button style={styles}>
            {element.content}
          </Button>
        );
      case 'hero':
        return (
          <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white p-12 rounded-lg" style={styles}>
            <h1 className="text-4xl font-bold mb-4">{element.content}</h1>
            <p className="text-xl opacity-90">Bem-vindos à nossa comunidade de fé</p>
          </div>
        );
      case 'container':
        return (
          <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg" style={styles}>
            <p className="text-center text-gray-500">Container - Arraste elementos aqui</p>
          </div>
        );
      default:
        return (
          <div className="p-4 border border-gray-300 rounded-lg bg-gray-50" style={styles}>
            <p className="text-sm text-gray-600">Elemento: {element.type}</p>
            <p className="text-gray-800">{element.content}</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative group cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {renderElement()}
      
      {isSelected && (
        <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
          {AVAILABLE_WIDGETS.find(w => w.type === element.type)?.name || element.type}
        </div>
      )}
    </div>
  );
}