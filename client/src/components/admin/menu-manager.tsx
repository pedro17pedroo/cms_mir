import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMenuItemSchema, type MenuItem, type InsertMenuItem } from "@shared/schema";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Menu, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MenuManagerProps {}

export default function MenuManager({}: MenuManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const queryClient = useQueryClient();

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
      console.log("Sending menu item data:", data);
      const response = await fetch("/api/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.text();
        console.error("Menu item creation failed:", error);
        throw new Error(error);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Item de menu criado com sucesso!" });
    },
    onError: (error) => {
      console.error("Menu item creation error:", error);
      toast({ title: "Erro ao criar item de menu", variant: "destructive" });
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertMenuItem> }) => 
      fetch(`/api/menu-items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast({ title: "Item de menu atualizado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar item de menu", variant: "destructive" });
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: (id: number) => 
      fetch(`/api/menu-items/${id}`, {
        method: "DELETE",
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({ title: "Item de menu removido com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover item de menu", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertMenuItem) => {
    console.log("Form submitted with data:", data);
    console.log("Form errors:", form.formState.errors);
    
    // Clean up the data before submission
    const cleanData = {
      ...data,
      parentId: data.parentId === undefined ? null : data.parentId,
      icon: data.icon || null,
      order: data.order || 0
    };
    
    console.log("Clean data to submit:", cleanData);
    
    if (editingItem) {
      updateMenuItemMutation.mutate({ id: editingItem.id, data: cleanData });
    } else {
      createMenuItemMutation.mutate(cleanData);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
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
    form.reset();
    setIsDialogOpen(true);
  };

  const toggleActive = (item: MenuItem) => {
    updateMenuItemMutation.mutate({
      id: item.id,
      data: { isActive: !item.isActive }
    });
  };

  // Organize menu items into hierarchy
  const organizeMenuItems = (items: MenuItem[]) => {
    const parentItems = items.filter(item => !item.parentId);
    const childItems = items.filter(item => item.parentId);
    
    return parentItems.map(parent => ({
      ...parent,
      children: childItems.filter(child => child.parentId === parent.id)
    }));
  };

  const organizedMenuItems = organizeMenuItems(menuItems);
  const parentMenuItems = menuItems.filter(item => !item.parentId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Menus</CardTitle>
          <CardDescription>Carregando menus...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestão de Menus</CardTitle>
              <CardDescription>
                Crie e organize menus dinâmicos com suporte a submenus
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
                  </DialogHeader>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <nav className="space-y-2">
                      {organizedMenuItems.filter(item => item.isActive).map((item) => (
                        <div key={item.id} className="space-y-1">
                          <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
                            {item.icon && <span className="text-gray-600">{item.icon}</span>}
                            <span className="font-medium">{item.title}</span>
                          </div>
                          {item.children && item.children.filter(child => child.isActive).length > 0 && (
                            <div className="ml-6 space-y-1">
                              {item.children.filter(child => child.isActive).map((child) => (
                                <div key={child.id} className="flex items-center gap-2 p-1 text-sm hover:bg-gray-100 rounded">
                                  {child.icon && <span className="text-gray-500">{child.icon}</span>}
                                  <span>{child.title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </nav>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleNewItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {editingItem ? "Editar Item de Menu" : "Novo Item de Menu"}
                    </DialogTitle>
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
                              <Input placeholder="Nome do menu" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma página ou digite URL" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="/">/inicio</SelectItem>
                                  <SelectItem value="/sobre">/sobre</SelectItem>
                                  <SelectItem value="/servicos">/servicos</SelectItem>
                                  <SelectItem value="/ensinos">/ensinos</SelectItem>
                                  <SelectItem value="/eventos">/eventos</SelectItem>
                                  <SelectItem value="/blog">/blog</SelectItem>
                                  <SelectItem value="/videos">/videos</SelectItem>
                                  <SelectItem value="/doacoes">/doacoes</SelectItem>
                                  <SelectItem value="/contato">/contato</SelectItem>
                                  {pages.map((page: any) => (
                                    <SelectItem key={page.id} value={`/${page.slug}`}>
                                      /{page.slug} - {page.title}
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
                        name="parentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Menu Pai (para submenu)</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={(value) => field.onChange(value === "none" ? undefined : parseInt(value))}
                                value={field.value?.toString() || "none"}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um menu pai (opcional)" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Nenhum (Menu principal)</SelectItem>
                                  {parentMenuItems.map((item) => (
                                    <SelectItem key={item.id} value={item.id.toString()}>
                                      {item.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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
                                  placeholder="0" 
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  value={field.value || 0}
                                />
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
                              <FormLabel>Ícone (opcional)</FormLabel>
                              <FormControl>
                                <Input placeholder="nome-do-icone" {...field} value={field.value || ""} />
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
                          <FormItem className="flex items-center gap-2">
                            <FormLabel>Ativo</FormLabel>
                            <FormControl>
                              <Switch
                                checked={Boolean(field.value)}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2">
                        <Button 
                          type="submit" 
                          disabled={createMenuItemMutation.isPending || updateMenuItemMutation.isPending}
                        >
                          {editingItem ? "Atualizar" : "Criar"} Item
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancelar
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
          <div className="space-y-2">
            {organizedMenuItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Menu className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum menu encontrado. Crie o primeiro menu.</p>
              </div>
            ) : (
              organizedMenuItems.map((item) => (
                <div key={item.id} className="space-y-2">
                  {/* Parent Menu Item */}
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <Menu className="h-4 w-4 text-gray-600" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{item.title}</h3>
                          {item.isActive ? (
                            <Badge variant="default" className="text-xs">Ativo</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Inativo</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{item.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(item)}
                      >
                        {item.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMenuItemMutation.mutate(item.id)}
                        disabled={deleteMenuItemMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Child Menu Items */}
                  {item.children && item.children.length > 0 && (
                    <div className="ml-8 space-y-2">
                      {item.children.map((child) => (
                        <div key={child.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                            <ChevronRight className="h-4 w-4 text-gray-600" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm">{child.title}</h4>
                                {child.isActive ? (
                                  <Badge variant="default" className="text-xs">Ativo</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">Inativo</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{child.url}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleActive(child)}
                            >
                              {child.isActive ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(child)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteMenuItemMutation.mutate(child.id)}
                              disabled={deleteMenuItemMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}