import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContentBlockSchema, type ContentBlock, type InsertContentBlock } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Eye, EyeOff, Copy, Layout, Image, Type, Video } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BlocksLibraryProps {}

export default function BlocksLibrary({}: BlocksLibraryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data: blocks = [], isLoading } = useQuery({
    queryKey: ["/api/content-blocks"],
  });

  const form = useForm<InsertContentBlock>({
    resolver: zodResolver(insertContentBlockSchema),
    defaultValues: {
      name: "",
      blockType: "header",
      content: JSON.stringify({
        html: "<div>Conteúdo do bloco</div>",
        css: ".custom-block { padding: 20px; }",
        settings: {
          backgroundColor: "#ffffff",
          textColor: "#000000",
          padding: "20px",
          margin: "10px"
        }
      }),
      thumbnail: "",
      isActive: true,
    },
  });

  const createBlockMutation = useMutation({
    mutationFn: (data: InsertContentBlock) => apiRequest("/api/content-blocks", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-blocks"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Bloco criado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar bloco", variant: "destructive" });
    },
  });

  const updateBlockMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertContentBlock> }) => 
      apiRequest(`/api/content-blocks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-blocks"] });
      setIsDialogOpen(false);
      setEditingBlock(null);
      form.reset();
      toast({ title: "Bloco atualizado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar bloco", variant: "destructive" });
    },
  });

  const deleteBlockMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/content-blocks/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-blocks"] });
      toast({ title: "Bloco removido com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover bloco", variant: "destructive" });
    },
  });

  const duplicateBlockMutation = useMutation({
    mutationFn: (block: ContentBlock) => {
      const duplicatedBlock = {
        name: `${block.name} (Cópia)`,
        blockType: block.blockType,
        content: block.content,
        thumbnail: block.thumbnail,
        isActive: false,
      };
      return apiRequest("/api/content-blocks", {
        method: "POST",
        body: JSON.stringify(duplicatedBlock),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-blocks"] });
      toast({ title: "Bloco duplicado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao duplicar bloco", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertContentBlock) => {
    if (editingBlock) {
      updateBlockMutation.mutate({ id: editingBlock.id, data });
    } else {
      createBlockMutation.mutate(data);
    }
  };

  const handleEdit = (block: ContentBlock) => {
    setEditingBlock(block);
    form.reset({
      name: block.name,
      blockType: block.blockType,
      content: block.content,
      thumbnail: block.thumbnail || "",
      isActive: block.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleNewBlock = () => {
    setEditingBlock(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const toggleActive = (block: ContentBlock) => {
    updateBlockMutation.mutate({
      id: block.id,
      data: { isActive: !block.isActive }
    });
  };

  const getBlockIcon = (blockType: string) => {
    switch (blockType) {
      case "header":
      case "footer":
        return <Layout className="h-4 w-4" />;
      case "image":
      case "gallery":
        return <Image className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  const blockTypes = [
    { value: "header", label: "Cabeçalho" },
    { value: "footer", label: "Rodapé" },
    { value: "hero", label: "Hero/Banner" },
    { value: "testimonial", label: "Testemunho" },
    { value: "gallery", label: "Galeria" },
    { value: "text", label: "Texto" },
    { value: "image", label: "Imagem" },
    { value: "video", label: "Vídeo" },
    { value: "form", label: "Formulário" },
    { value: "button", label: "Botão" },
    { value: "divider", label: "Separador" },
    { value: "custom", label: "Personalizado" },
  ];

  const filteredBlocks = selectedCategory === "all" 
    ? blocks 
    : (blocks as ContentBlock[]).filter(block => block.blockType === selectedCategory);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Blocos</CardTitle>
          <CardDescription>Carregando blocos...</CardDescription>
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
              <CardTitle>Biblioteca de Blocos Reutilizáveis</CardTitle>
              <CardDescription>
                Crie e gerencie blocos de conteúdo reutilizáveis para suas páginas
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewBlock}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Bloco
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingBlock ? "Editar Bloco" : "Novo Bloco"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do Bloco</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome descritivo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="blockType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Bloco</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {blockTypes.map((type) => (
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
                    </div>

                    <FormField
                      control={form.control}
                      name="thumbnail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL da Miniatura (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://exemplo.com/preview.jpg" {...field} />
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
                          <FormLabel>Conteúdo do Bloco (JSON)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder='{"html": "<div>Conteúdo</div>", "css": ".block { padding: 20px; }", "settings": {"backgroundColor": "#fff"}}'
                              rows={8}
                              {...field} 
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
                        <FormItem className="flex items-center gap-2">
                          <FormLabel>Ativo</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={createBlockMutation.isPending || updateBlockMutation.isPending}
                      >
                        {editingBlock ? "Atualizar" : "Criar"} Bloco
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
          {/* Filter by category */}
          <div className="mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Blocos</SelectItem>
                {blockTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Blocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(filteredBlocks as ContentBlock[]).map((block) => (
              <Card key={block.id} className="border-2 hover:border-purple-300 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getBlockIcon(block.blockType)}
                      <h3 className="font-medium text-sm">{block.name}</h3>
                    </div>
                    {block.isActive ? (
                      <Badge variant="default" className="text-xs">Ativo</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Inativo</Badge>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs w-fit">
                    {blockTypes.find(t => t.value === block.blockType)?.label}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  {block.thumbnail && (
                    <div className="mb-3">
                      <img 
                        src={block.thumbnail} 
                        alt={block.name}
                        className="w-full h-24 object-cover rounded border"
                      />
                    </div>
                  )}
                  <div className="flex gap-1 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(block)}
                    >
                      {block.isActive ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateBlockMutation.mutate(block)}
                      disabled={duplicateBlockMutation.isPending}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(block)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteBlockMutation.mutate(block.id)}
                      disabled={deleteBlockMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBlocks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum bloco encontrado para esta categoria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}