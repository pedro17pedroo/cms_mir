import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMenuItemSchema, type MenuItem, type InsertMenuItem } from "@shared/schema";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  GripVertical, 
  Menu, 
  ChevronRight,
  ChevronDown,
  Home,
  Users,
  Calendar,
  MessageSquare,
  BookOpen,
  Heart,
  Settings,
  Globe,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SortableMenuItemProps {
  item: MenuItem;
  children?: MenuItem[];
  level: number;
  onEdit: (item: MenuItem) => void;
  onToggle: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  isDragging: boolean;
}

function SortableMenuItem({ 
  item, 
  children = [], 
  level, 
  onEdit, 
  onToggle, 
  onDelete,
  isDragging 
}: SortableMenuItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: item.id.toString(),
    data: {
      type: "menu-item",
      item,
      level
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };

  const getIcon = (iconName?: string) => {
    const icons: any = {
      home: Home,
      users: Users,
      calendar: Calendar,
      message: MessageSquare,
      book: BookOpen,
      heart: Heart,
      settings: Settings,
      globe: Globe,
      menu: Menu,
    };
    const IconComponent = icons[iconName || "menu"] || Menu;
    return <IconComponent className="h-4 w-4" />;
  };

  const indentStyle = {
    marginLeft: level * 24 + "px",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-gray-200 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-all ${
        isDragging || isSortableDragging ? "shadow-lg border-purple-300" : ""
      }`}
    >
      <div style={indentStyle} className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-md ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {getIcon(item.icon ?? undefined)}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.url}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {level > 0 && (
            <Badge variant="secondary" className="text-xs">
              Submenu
            </Badge>
          )}
          
          <Badge variant={item.isActive ? "default" : "secondary"}>
            {item.isActive ? "Ativo" : "Inativo"}
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggle(item)}
            className="p-2"
          >
            {item.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            className="p-2"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item.id)}
            className="p-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DroppableZoneProps {
  id: string;
  children: React.ReactNode;
  level: number;
}

function DroppableZone({ id, children, level }: DroppableZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      type: "droppable-zone",
      level
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-2 transition-all ${
        isOver ? "bg-purple-100 border-2 border-dashed border-purple-400 rounded-lg" : ""
      }`}
    >
      {children}
    </div>
  );
}

interface EnhancedMenuManagerProps {}

export default function EnhancedMenuManager({}: EnhancedMenuManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [urlType, setUrlType] = useState<"custom" | "page">("custom");
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const { data: pages = [] } = useQuery<any[]>({
    queryKey: ["/api/pages"],
  });

  const form = useForm<InsertMenuItem>({
    resolver: zodResolver(insertMenuItemSchema),
    defaultValues: {
      title: "",
      url: "",
      parentId: undefined,
      order: 0,
      isActive: true,
      icon: "",
    },
  });

  const createMenuItemMutation = useMutation({
    mutationFn: async (data: InsertMenuItem) => {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Item de menu criado com sucesso!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar item de menu", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertMenuItem> }) => 
      fetch(`/api/menu-items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(res => {
        if (!res.ok) throw new Error("Failed to update menu item");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      if (editingItem) {
        setIsDialogOpen(false);
        setEditingItem(null);
        form.reset();
        toast({ title: "Item de menu atualizado com sucesso!" });
      }
    },
    onError: () => {
      toast({ title: "Erro ao atualizar item de menu", variant: "destructive" });
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: (id: number) => 
      fetch(`/api/menu-items/${id}`, {
        method: "DELETE",
      }).then(res => {
        if (!res.ok) throw new Error("Failed to delete menu item");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({ title: "Item de menu removido com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover item de menu", variant: "destructive" });
    },
  });

  // Organize menu items into hierarchy
  const organizeMenuItems = (items: MenuItem[]) => {
    const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
    const parentItems = sortedItems.filter(item => !item.parentId);
    const childItems = sortedItems.filter(item => item.parentId);
    
    const result: any[] = [];
    
    parentItems.forEach(parent => {
      result.push({
        ...parent,
        level: 0,
        children: childItems.filter(child => child.parentId === parent.id)
      });
      
      const parentChildren = childItems.filter(child => child.parentId === parent.id);
      parentChildren.forEach(child => {
        result.push({
          ...child,
          level: 1,
          children: []
        });
      });
    });
    
    return result;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeItem = menuItems.find(item => item.id.toString() === active.id);
    const overItem = menuItems.find(item => item.id.toString() === over.id);

    if (!activeItem) return;

    try {
      if (overItem) {
        // Reordering logic
        const activeIndex = menuItems.findIndex(item => item.id === activeItem.id);
        const overIndex = menuItems.findIndex(item => item.id === overItem.id);
        
        if (activeIndex !== overIndex) {
          // Update order based on new position
          const newOrder = overItem.order || 0;
          await updateMenuItemMutation.mutateAsync({
            id: activeItem.id,
            data: { order: newOrder }
          });
        }
      }

      // Check for level changes based on drop zone
      const overData = over.data.current;
      if (overData?.type === "droppable-zone") {
        const targetLevel = overData.level;
        const currentLevel = activeItem.parentId ? 1 : 0;
        
        if (targetLevel !== currentLevel) {
          if (targetLevel === 0 && currentLevel === 1) {
            // Convert submenu to main menu
            await updateMenuItemMutation.mutateAsync({
              id: activeItem.id,
              data: { parentId: null }
            });
            toast({ title: "Submenu convertido para menu principal!" });
          } else if (targetLevel === 1 && currentLevel === 0) {
            // Convert main menu to submenu - need to determine parent
            const availableParents = menuItems.filter(item => !item.parentId && item.id !== activeItem.id);
            if (availableParents.length > 0) {
              await updateMenuItemMutation.mutateAsync({
                id: activeItem.id,
                data: { parentId: availableParents[0].id }
              });
              toast({ title: "Menu convertido para submenu!" });
            }
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
    } catch (error) {
      toast({ title: "Erro ao reordenar menu", variant: "destructive" });
    }
  };

  const onSubmit = (data: InsertMenuItem) => {
    const nextOrder = Math.max(...menuItems.map(item => item.order || 0), 0) + 1;
    const finalData = { ...data, order: editingItem ? data.order : nextOrder };
    
    if (editingItem) {
      updateMenuItemMutation.mutate({ id: editingItem.id, data: finalData });
    } else {
      createMenuItemMutation.mutate(finalData);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    
    const urlWithoutSlash = item.url.startsWith("/") ? item.url.substring(1) : "";
    const matchingPage = pages.find(page => page.slug === urlWithoutSlash);
    const isPageUrl = item.url.startsWith("/") && 
                      !item.url.includes("://") && 
                      item.url.split("/").filter(Boolean).length === 1 &&
                      matchingPage;
    
    setUrlType(isPageUrl ? "page" : "custom");
    form.reset({
      title: item.title,
      url: item.url,
      parentId: item.parentId || undefined,
      order: item.order,
      isActive: item.isActive,
      icon: item.icon || "",
    });
    setIsDialogOpen(true);
  };

  const handleNewItem = () => {
    setEditingItem(null);
    setUrlType("custom");
    form.reset({
      title: "",
      url: "",
      parentId: undefined,
      order: 0,
      isActive: true,
      icon: "",
    });
    setIsDialogOpen(true);
  };

  const toggleActive = (item: MenuItem) => {
    updateMenuItemMutation.mutate({
      id: item.id,
      data: { isActive: !item.isActive }
    });
  };

  useEffect(() => {
    if (urlType === "page" && form.watch("url") && !form.watch("url").startsWith("/")) {
      form.setValue("url", "", { shouldValidate: true });
    }
  }, [urlType]);

  const organizedMenuItems = organizeMenuItems(menuItems);
  const parentMenuItems = menuItems.filter(item => !item.parentId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Menus Avançada</CardTitle>
          <CardDescription>Carregando menus...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const activeItem = menuItems.find(item => item.id.toString() === activeId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestão de Menus Avançada</CardTitle>
              <CardDescription>
                Arraste e solte para reordenar menus e criar submenus dinamicamente
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar Menu
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Pré-visualização do Menu</DialogTitle>
                    <DialogDescription>
                      Visualize como o menu aparecerá no site
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <nav className="space-y-2">
                      {parentMenuItems
                        .filter(item => item.isActive)
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((item) => {
                          const children = menuItems.filter(child => 
                            child.parentId === item.id && child.isActive
                          ).sort((a, b) => (a.order || 0) - (b.order || 0));
                          
                          return (
                            <div key={item.id} className="space-y-1">
                              <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
                                {item.icon && <span className="text-gray-600">{item.icon}</span>}
                                <span className="font-medium">{item.title}</span>
                                {children.length > 0 && <ChevronRight className="h-4 w-4 ml-auto" />}
                              </div>
                              {children.length > 0 && (
                                <div className="ml-6 space-y-1">
                                  {children.map((child) => (
                                    <div key={child.id} className="flex items-center gap-2 p-1 text-sm hover:bg-gray-100 rounded">
                                      {child.icon && <span className="text-gray-500">{child.icon}</span>}
                                      <span>{child.title}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })
                      }
                    </nav>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleNewItem} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingItem ? "Editar Item de Menu" : "Novo Item de Menu"}
                    </DialogTitle>
                    <DialogDescription>
                      Configure as informações do item de menu
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ex: Início" 
                                {...field} 
                                data-testid="input-menu-title"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <div>
                          <FormLabel>Tipo de URL</FormLabel>
                          <Select 
                            value={urlType} 
                            onValueChange={(value: "custom" | "page") => setUrlType(value)}
                            data-testid="select-url-type"
                          >
                            <SelectTrigger data-testid="trigger-url-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="custom" data-testid="option-url-custom">
                                URL Personalizada
                              </SelectItem>
                              <SelectItem value="page" data-testid="option-url-page">
                                Selecionar Página Existente
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {urlType === "page" ? (
                          <div className="space-y-2">
                            <FormLabel>Página</FormLabel>
                            <Select
                              value={form.watch("url").startsWith("/") ? form.watch("url").substring(1) : ""}
                              onValueChange={(slug) => {
                                form.setValue("url", `/${slug}`, { shouldValidate: true, shouldDirty: true });
                              }}
                              data-testid="select-page"
                            >
                              <SelectTrigger data-testid="trigger-page-selector">
                                <SelectValue placeholder="Selecione uma página" />
                              </SelectTrigger>
                              <SelectContent>
                                {pages.filter(page => page.isPublished).map((page) => (
                                  <SelectItem 
                                    key={page.id} 
                                    value={page.slug}
                                    data-testid={`option-page-${page.slug}`}
                                  >
                                    {page.title} ({page.slug})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {form.watch("url") && (
                              <p className="text-sm text-gray-500" data-testid="text-selected-url">
                                URL gerada: {form.watch("url")}
                              </p>
                            )}
                          </div>
                        ) : (
                          <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>URL Personalizada</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Ex: / ou https://exemplo.com" 
                                    {...field} 
                                    data-testid="input-custom-url"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="parentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Menu Pai (Opcional)</FormLabel>
                              <FormControl>
                                <Select 
                                  onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                                  value={field.value?.toString() || ""}
                                  data-testid="select-parent-menu"
                                >
                                  <SelectTrigger data-testid="trigger-parent-menu">
                                    <SelectValue placeholder="Menu principal" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="" data-testid="option-parent-none">Menu principal</SelectItem>
                                    {parentMenuItems.map((parent) => (
                                      <SelectItem 
                                        key={parent.id} 
                                        value={parent.id.toString()}
                                        data-testid={`option-parent-${parent.id}`}
                                      >
                                        {parent.title}
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
                          name="icon"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ícone</FormLabel>
                              <FormControl>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value || ""}
                                  data-testid="select-icon"
                                >
                                  <SelectTrigger data-testid="trigger-icon">
                                    <SelectValue placeholder="Selecione um ícone" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="home" data-testid="option-icon-home">🏠 Início</SelectItem>
                                    <SelectItem value="users" data-testid="option-icon-users">👥 Sobre</SelectItem>
                                    <SelectItem value="calendar" data-testid="option-icon-calendar">📅 Eventos</SelectItem>
                                    <SelectItem value="message" data-testid="option-icon-message">💬 Mensagens</SelectItem>
                                    <SelectItem value="book" data-testid="option-icon-book">📖 Blog</SelectItem>
                                    <SelectItem value="heart" data-testid="option-icon-heart">❤️ Testemunhos</SelectItem>
                                    <SelectItem value="settings" data-testid="option-icon-settings">⚙️ Configurações</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Ativo</FormLabel>
                              <div className="text-sm text-gray-500">
                                Item visível no menu
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={Boolean(field.value)}
                                onCheckedChange={field.onChange}
                                data-testid="switch-menu-active"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsDialogOpen(false)}
                          data-testid="button-cancel-menu"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createMenuItemMutation.isPending || updateMenuItemMutation.isPending}
                          className="bg-purple-600 hover:bg-purple-700"
                          data-testid="button-save-menu"
                        >
                          {createMenuItemMutation.isPending || updateMenuItemMutation.isPending ? "Salvando..." : "Salvar"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {organizedMenuItems.length === 0 ? (
            <div className="text-center py-12">
              <Menu className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum menu configurado</h3>
              <p className="text-gray-500 mb-4">Crie seu primeiro item de menu para começar</p>
              <Button onClick={handleNewItem} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar primeiro menu
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 Como usar:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Reordenar:</strong> Arraste itens para cima/baixo para alterar a ordem</li>
                  <li>• <strong>Criar submenu:</strong> Arraste um menu para a direita de outro para torná-lo submenu</li>
                  <li>• <strong>Remover submenu:</strong> Arraste um submenu para a esquerda para torná-lo menu principal</li>
                  <li>• <strong>Ativar/Desativar:</strong> Use o botão de olho para mostrar/ocultar itens</li>
                </ul>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="space-y-2">
                  <DroppableZone id="main-menu-zone" level={0}>
                    <h5 className="text-sm font-medium text-gray-600 mb-2">📋 Menus Principais</h5>
                  </DroppableZone>
                  
                  <SortableContext items={organizedMenuItems.map(item => item.id.toString())} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {organizedMenuItems.map((item) => (
                        <SortableMenuItem
                          key={item.id}
                          item={item}
                          children={item.children}
                          level={item.level}
                          onEdit={handleEdit}
                          onToggle={toggleActive}
                          onDelete={deleteMenuItemMutation.mutate}
                          isDragging={activeId === item.id.toString()}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  
                  <DroppableZone id="submenu-zone" level={1}>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-600 mb-2">📁 Zona de Submenus</h5>
                      <p className="text-xs text-gray-500">Arraste menus aqui para convertê-los em submenus</p>
                    </div>
                  </DroppableZone>
                </div>

                <DragOverlay>
                  {activeId && activeItem ? (
                    <div className="bg-white border border-purple-300 rounded-lg p-3 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{activeItem.title}</span>
                        <Badge variant="secondary">{activeItem.url}</Badge>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}