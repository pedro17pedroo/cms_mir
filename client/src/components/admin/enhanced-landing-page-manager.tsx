import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
  SortableContext as SortableContextType,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLandingPageSectionSchema, type LandingPageSection, type InsertLandingPageSection } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  GripVertical, 
  Home,
  Users,
  Calendar,
  MessageSquare,
  BookOpen,
  Heart,
  Quote,
  Radio,
  Share2,
  Mail,
  Sparkles
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SortableItemProps {
  section: LandingPageSection;
  onEdit: (section: LandingPageSection) => void;
  onToggle: (section: LandingPageSection) => void;
  onDelete: (id: number) => void;
}

function SortableItem({ section, onEdit, onToggle, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getSectionIcon = (type: string) => {
    const icons = {
      hero: Home,
      about: Users,
      services: Calendar,
      messages: MessageSquare,
      events: Calendar,
      blog: BookOpen,
      testimonials: Heart,
      bible_verse: Quote,
      live_streaming: Radio,
      social_media: Share2,
      newsletter: Mail,
      custom: Sparkles,
    };
    const IconComponent = icons[type as keyof typeof icons] || Sparkles;
    return <IconComponent className="h-4 w-4" />;
  };

  const getSectionDescription = (type: string) => {
    const descriptions = {
      hero: "Carrossel principal da página",
      about: "Visão, missão e crenças",
      services: "Horários dos cultos",
      messages: "Mensagens e sermões recentes",
      events: "Próximos eventos da igreja",
      blog: "Últimas publicações do blog",
      testimonials: "Testemunhos dos membros",
      bible_verse: "Versículo bíblico em destaque",
      live_streaming: "Transmissão ao vivo",
      social_media: "Links das redes sociais",
      newsletter: "Inscrição para newsletter",
      custom: "Conteúdo personalizado",
    };
    return descriptions[type as keyof typeof descriptions] || "Seção personalizada";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${
        isDragging ? "shadow-lg" : "hover:shadow-md"
      } transition-all duration-200`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-md ${section.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {getSectionIcon(section.sectionType)}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{section.title}</h4>
              <p className="text-sm text-gray-500">{getSectionDescription(section.sectionType)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant={section.isActive ? "default" : "secondary"}>
            {section.isActive ? "Ativa" : "Inativa"}
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggle(section)}
            className="p-2"
          >
            {section.isActive ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(section)}
            className="p-2"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(section.id)}
            className="p-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface EnhancedLandingPageManagerProps {}

export default function EnhancedLandingPageManager({}: EnhancedLandingPageManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<LandingPageSection | null>(null);
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: sections = [], isLoading } = useQuery<LandingPageSection[]>({
    queryKey: ["/api/landing-page-sections"],
  });

  const form = useForm<InsertLandingPageSection>({
    resolver: zodResolver(insertLandingPageSectionSchema),
    defaultValues: {
      sectionType: "hero",
      title: "",
      content: JSON.stringify({
        showContent: true,
        backgroundColor: "#ffffff",
        textColor: "#000000"
      }),
      order: 0,
      isActive: true,
    },
  });

  const createSectionMutation = useMutation({
    mutationFn: (data: InsertLandingPageSection) => apiRequest("/api/landing-page-sections", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landing-page-sections"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Seção criada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar seção", variant: "destructive" });
    },
  });

  const updateSectionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertLandingPageSection> }) => 
      apiRequest(`/api/landing-page-sections/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landing-page-sections"] });
      setIsDialogOpen(false);
      setEditingSection(null);
      form.reset();
      toast({ title: "Seção atualizada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar seção", variant: "destructive" });
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/landing-page-sections/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/landing-page-sections"] });
      toast({ title: "Seção removida com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover seção", variant: "destructive" });
    },
  });

  // Reordenar seções com drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex((section) => section.id === active.id);
      const newIndex = sections.findIndex((section) => section.id === over?.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);
      
      // Atualizar ordem no backend
      newSections.forEach((section, index) => {
        updateSectionMutation.mutate({
          id: section.id,
          data: { order: index + 1 }
        });
      });
    }
  };

  const onSubmit = (data: InsertLandingPageSection) => {
    const nextOrder = Math.max(...sections.map(s => s.order || 0), 0) + 1;
    const finalData = { ...data, order: editingSection ? data.order : nextOrder };
    
    if (editingSection) {
      updateSectionMutation.mutate({ id: editingSection.id, data: finalData });
    } else {
      createSectionMutation.mutate(finalData);
    }
  };

  const handleEdit = (section: LandingPageSection) => {
    setEditingSection(section);
    form.reset({
      sectionType: section.sectionType,
      title: section.title,
      content: section.content,
      order: section.order,
      isActive: section.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleNewSection = () => {
    setEditingSection(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const toggleActive = (section: LandingPageSection) => {
    updateSectionMutation.mutate({
      id: section.id,
      data: { isActive: !section.isActive }
    });
  };

  const sectionTypes = [
    { value: "hero", label: "Hero/Banner Principal" },
    { value: "about", label: "Sobre Nós" },
    { value: "services", label: "Horários de Cultos" },
    { value: "messages", label: "Mensagens Recentes" },
    { value: "events", label: "Próximos Eventos" },
    { value: "blog", label: "Últimas Publicações do Blog" },
    { value: "testimonials", label: "Testemunhos" },
    { value: "bible_verse", label: "Versículo do Dia" },
    { value: "live_streaming", label: "Transmissão ao Vivo" },
    { value: "social_media", label: "Redes Sociais" },
    { value: "newsletter", label: "Newsletter" },
    { value: "custom", label: "Seção Personalizada" },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Landing Page</CardTitle>
          <CardDescription>Carregando seções...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const sortedSections = [...sections].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestão Avançada de Landing Page</CardTitle>
              <CardDescription>
                Configure e organize seções da página inicial com drag-and-drop
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewSection} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Seção
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSection ? "Editar Seção" : "Nova Seção"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sectionType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Seção</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {sectionTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título da Seção</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Bem-vindos à nossa igreja" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Configuração (JSON)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder='{"showContent": true, "backgroundColor": "#ffffff"}'
                              rows={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ordem</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Ativa</FormLabel>
                              <div className="text-sm text-gray-500">
                                Seção visível na página
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {createSectionMutation.isPending || updateSectionMutation.isPending ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {sortedSections.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma seção configurada</h3>
              <p className="text-gray-500 mb-4">Crie sua primeira seção para começar a construir a landing page</p>
              <Button onClick={handleNewSection} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar primeira seção
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={sortedSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {sortedSections.map((section) => (
                    <SortableItem
                      key={section.id}
                      section={section}
                      onEdit={handleEdit}
                      onToggle={toggleActive}
                      onDelete={deleteSectionMutation.mutate}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
}