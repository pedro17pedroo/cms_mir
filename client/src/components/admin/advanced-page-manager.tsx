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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPageSchema, type Page, type InsertPage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  GripVertical, 
  Paintbrush,
  Layout,
  FileText,
  Settings,
  Save,
  Download,
  Upload,
  Copy,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AdvancedPageManagerProps {}

type ViewMode = 'list' | 'builder' | 'preview';

export default function AdvancedPageManager({}: AdvancedPageManagerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery<Page[]>({
    queryKey: ["/api/pages"],
  });

  const form = useForm<InsertPage>({
    resolver: zodResolver(insertPageSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      isPublished: false,
      isTemplate: false,
      order: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPage) => {
      const response = await apiRequest("POST", "/api/pages", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Página criada",
        description: "A página foi criada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar a página.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertPage> }) => {
      const response = await apiRequest("PUT", `/api/pages/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      setIsDialogOpen(false);
      setEditingPage(null);
      form.reset();
      toast({
        title: "Página atualizada",
        description: "A página foi atualizada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar a página.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({
        title: "Página excluída",
        description: "A página foi excluída com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao excluir a página.",
        variant: "destructive",
      });
    },
  });

  const openDialog = (page?: Page) => {
    if (page) {
      setEditingPage(page);
      form.reset({
        title: page.title,
        slug: page.slug,
        content: page.content || "",
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
        isPublished: page.isPublished || false,
        isTemplate: page.isTemplate || false,
        order: page.order || 0,
      });
    } else {
      setEditingPage(null);
      form.reset();
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (data: InsertPage) => {
    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta página?")) {
      deleteMutation.mutate(id);
    }
  };

  const openPageBuilder = (page: Page) => {
    setSelectedPageId(page.id.toString());
    setViewMode('builder');
  };

  const savePageContent = (elements: any[]) => {
    if (selectedPageId) {
      const pageId = parseInt(selectedPageId);
      const content = JSON.stringify({ elements });
      updateMutation.mutate({ 
        id: pageId, 
        data: { content } 
      });
    }
  };

  const previewPage = () => {
    setViewMode('preview');
  };

  const getDeviceStyles = () => {
    switch (previewDevice) {
      case 'mobile':
        return { maxWidth: '375px', height: '667px' };
      case 'tablet':
        return { maxWidth: '768px', height: '1024px' };
      default:
        return { maxWidth: '100%', height: '100%' };
    }
  };

  if (viewMode === 'builder') {
    const selectedPage = pages.find(p => p.id.toString() === selectedPageId);
    if (!selectedPage) {
      setViewMode('list');
      return null;
    }

    return (
      <div className="h-screen bg-gray-50">
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setViewMode('list')}>
                ← Voltar
              </Button>
              <h1 className="text-xl font-semibold">
                Editando: {selectedPage.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={previewPage}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={() => savePageContent([])}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>

        {/* Simplified Page Builder Interface */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Sidebar with widgets */}
          <div className="w-80 bg-white border-r">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Elementos</h3>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Básicos</TabsTrigger>
                  <TabsTrigger value="church">Igreja</TabsTrigger>
                  <TabsTrigger value="advanced">Avançado</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-2 mt-4">
                  <WidgetButton icon={FileText} label="Título" />
                  <WidgetButton icon={FileText} label="Texto" />
                  <WidgetButton icon={Layout} label="Botão" />
                  <WidgetButton icon={Layout} label="Imagem" />
                  <WidgetButton icon={Layout} label="Vídeo" />
                  <WidgetButton icon={Layout} label="Colunas" />
                  <WidgetButton icon={Layout} label="Espaçador" />
                </TabsContent>

                <TabsContent value="church" className="space-y-2 mt-4">
                  <WidgetButton icon={FileText} label="Horários Cultos" />
                  <WidgetButton icon={FileText} label="Mensagem Pastor" />
                  <WidgetButton icon={FileText} label="Lista Eventos" />
                  <WidgetButton icon={FileText} label="Testemunhos" />
                  <WidgetButton icon={FileText} label="Doações" />
                  <WidgetButton icon={FileText} label="Versículo" />
                  <WidgetButton icon={FileText} label="Transmissão" />
                </TabsContent>

                <TabsContent value="advanced" className="space-y-2 mt-4">
                  <WidgetButton icon={Layout} label="Formulário" />
                  <WidgetButton icon={Layout} label="Mapa" />
                  <WidgetButton icon={Layout} label="Galeria" />
                  <WidgetButton icon={Layout} label="Carousel" />
                  <WidgetButton icon={Layout} label="Countdown" />
                  <WidgetButton icon={Layout} label="Feed Social" />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Canvas area */}
          <div className="flex-1 p-8 bg-gray-100">
            <div className="max-w-4xl mx-auto bg-white min-h-[800px] shadow-lg rounded-lg">
              <div className="p-8">
                <div className="text-center py-16 text-gray-500">
                  <Layout className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Canvas de Construção</h3>
                  <p>Arraste elementos da barra lateral para construir sua página</p>
                </div>
              </div>
            </div>
          </div>

          {/* Properties panel */}
          <div className="w-80 bg-white border-l">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Propriedades</h3>
              <div className="text-center text-gray-500 py-8">
                <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Selecione um elemento para configurar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'preview') {
    return (
      <div className="h-screen bg-gray-100">
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setViewMode('list')}>
                ← Voltar
              </Button>
              <h1 className="text-xl font-semibold">Preview da Página</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewDevice('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewDevice('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewDevice('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center p-8">
          <div 
            className="bg-white shadow-lg border mx-auto transition-all duration-300"
            style={getDeviceStyles()}
          >
            <div className="p-8 h-full overflow-auto">
              <h1 className="text-3xl font-bold mb-6">Página de Exemplo</h1>
              <p className="text-gray-600 mb-4">
                Esta é uma pré-visualização da página. O conteúdo real será renderizado 
                baseado nos elementos construídos no editor visual.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Páginas Avançada</h2>
          <p className="text-gray-600 mt-1">
            Crie e gerencie páginas com o construtor visual avançado
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da página" {...field} />
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
                          <Input placeholder="Título para SEO" {...field} value={field.value || ''} />
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
                            value={field.value || ''} 
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
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
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-6">
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch 
                            checked={field.value || false} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <FormLabel>Publicada</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isTemplate"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch 
                            checked={field.value || false} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <FormLabel>Template</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingPage ? "Atualizar" : "Criar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pages list */}
      <Card>
        <CardHeader>
          <CardTitle>Páginas ({pages.length})</CardTitle>
          <CardDescription>
            Gerencie todas as páginas do seu site
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Carregando páginas...</div>
            </div>
          ) : pages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma página encontrada
              </h3>
              <p className="text-gray-500 mb-4">
                Comece criando sua primeira página personalizada.
              </p>
              <Button onClick={() => openDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Página
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{page.title}</h3>
                        {page.isPublished ? (
                          <Badge variant="default">Publicada</Badge>
                        ) : (
                          <Badge variant="secondary">Rascunho</Badge>
                        )}
                        {page.isTemplate && (
                          <Badge variant="outline">Template</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">/{page.slug}</p>
                      {page.metaDescription && (
                        <p className="text-xs text-gray-400 mt-1">
                          {page.metaDescription.slice(0, 100)}...
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPageBuilder(page)}
                    >
                      <Paintbrush className="w-4 h-4 mr-1" />
                      Editor Visual
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDialog(page)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function WidgetButton({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <Button 
      variant="outline" 
      className="w-full justify-start h-auto p-3"
      onClick={() => {
        // Add widget to canvas logic here
        console.log(`Adding ${label} widget`);
      }}
    >
      <Icon className="w-5 h-5 mr-3" />
      <div className="text-left">
        <div className="font-medium">{label}</div>
      </div>
    </Button>
  );
}