import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPageSchema, type Page, type InsertPage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, GripVertical, Paintbrush } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PageBuilder, { type PageElement } from "@/components/page-builder/page-builder";

interface PageManagerProps {}

export default function PageManager({}: PageManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["/api/pages"],
  });

  const form = useForm<InsertPage>({
    resolver: zodResolver(insertPageSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: JSON.stringify({
        blocks: [
          {
            type: "text",
            content: "<h1>Nova Página</h1><p>Comece editando o conteúdo aqui...</p>",
            id: "block-1"
          }
        ]
      }),
      isPublished: false,
      isDefault: false,
      metaTitle: "",
      metaDescription: "",
      order: 0,
    },
  });

  const createPageMutation = useMutation({
    mutationFn: (data: InsertPage) => apiRequest("/api/pages", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Página criada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar página", variant: "destructive" });
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertPage> }) => 
      apiRequest(`/api/pages/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      setIsDialogOpen(false);
      setEditingPage(null);
      form.reset();
      toast({ title: "Página atualizada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar página", variant: "destructive" });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/pages/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({ title: "Página removida com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover página", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertPage) => {
    // Generate slug from title if not provided
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }

    if (editingPage) {
      updatePageMutation.mutate({ id: editingPage.id, data });
    } else {
      createPageMutation.mutate(data);
    }
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    form.reset({
      title: page.title,
      slug: page.slug,
      content: page.content,
      isPublished: page.isPublished,
      isDefault: page.isDefault,
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
      order: page.order,
    });
    setIsDialogOpen(true);
  };

  const handleNewPage = () => {
    setEditingPage(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const togglePublished = (page: Page) => {
    updatePageMutation.mutate({
      id: page.id,
      data: { isPublished: !page.isPublished }
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Páginas</CardTitle>
          <CardDescription>Carregando páginas...</CardDescription>
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
              <CardTitle>Gestão de Páginas</CardTitle>
              <CardDescription>
                Crie e gerencie páginas personalizadas com editor visual drag-and-drop
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewPage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Página
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPage ? "Editar Página" : "Nova Página"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                              <Input placeholder="Título da página" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL Slug</FormLabel>
                            <FormControl>
                              <Input placeholder="url-da-pagina" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Título (SEO)</FormLabel>
                            <FormControl>
                              <Input placeholder="Título para SEO" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Descrição (SEO)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descrição da página para motores de busca" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conteúdo (JSON)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder='{"blocks": [{"type": "text", "content": "<h1>Título</h1>", "id": "block-1"}]}'
                              rows={8}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center gap-4">
                      <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormLabel>Publicada</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isDefault"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormLabel>Página Padrão</FormLabel>
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

                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={createPageMutation.isPending || updatePageMutation.isPending}
                      >
                        {editingPage ? "Atualizar" : "Criar"} Página
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
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pages.map((page: Page) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{page.title}</h3>
                      {page.isDefault && (
                        <Badge variant="secondary">Padrão</Badge>
                      )}
                      {page.isPublished ? (
                        <Badge variant="default">Publicada</Badge>
                      ) : (
                        <Badge variant="outline">Rascunho</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">/{page.slug}</p>
                    {page.metaDescription && (
                      <p className="text-xs text-gray-500 mt-1">
                        {page.metaDescription}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublished(page)}
                  >
                    {page.isPublished ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/${page.slug}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(page)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!page.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePageMutation.mutate(page.id)}
                      disabled={deletePageMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}