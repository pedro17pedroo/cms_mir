import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BookOpen, Plus, Edit, Trash2, Eye, Calendar, User, Tag, Search, Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBlogPostSchema, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import RichTextEditor from "@/components/ui/rich-text-editor";
import BlogContentViewer from "@/components/blog/blog-content-viewer";

const categories = [
  "Mensagem Pastoral",
  "Ensino Bíblico", 
  "Reflexão Espiritual",
  "Testemunho",
  "Notícias da Igreja",
  "Eventos Especiais",
  "Devocionais",
  "Oração",
  "Família Cristã",
  "Jovens"
];

export default function BlogManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertBlogPost) => apiRequest("/api/blog-posts", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      setIsDialogOpen(false);
      setEditingPost(null);
      toast({ title: "Artigo criado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar artigo", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: InsertBlogPost & { id: number }) =>
      apiRequest(`/api/blog-posts/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      setIsDialogOpen(false);
      setEditingPost(null);
      toast({ title: "Artigo atualizado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar artigo", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/blog-posts/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ title: "Artigo removido com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover artigo", variant: "destructive" });
    },
  });

  const form = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      author: "",
      category: "",
      tags: [],
      imageUrl: "",
      isPublished: false,
    },
  });

  const handleSubmit = (data: InsertBlogPost) => {
    // Generate slug from title if empty
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }
    
    // Set publishedAt if publishing
    if (data.isPublished && !editingPost) {
      data.publishedAt = new Date();
    }

    if (editingPost) {
      updateMutation.mutate({ ...data, id: editingPost.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    form.reset({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      category: post.category,
      tags: post.tags || [],
      imageUrl: post.imageUrl,
      isPublished: post.isPublished,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleAddNew = () => {
    setEditingPost(null);
    form.reset({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      author: "",
      category: "",
      tags: [],
      imageUrl: "",
      isPublished: false,
    });
    setIsDialogOpen(true);
  };

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || post.category === filterCategory;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "published" && post.isPublished) ||
                         (filterStatus === "draft" && !post.isPublished);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestor de Blog</h2>
          <p className="text-gray-600">Gerencie artigos, mensagens e conteúdo do blog</p>
        </div>
        <Button onClick={handleAddNew} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Artigo
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Artigos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{blogPosts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Publicados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {blogPosts.filter(p => p.isPublished).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rascunhos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {blogPosts.filter(p => !p.isPublished).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Visualizações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {blogPosts.reduce((acc, post) => acc + (post.viewCount || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar por título, autor ou conteúdo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category-filter">Categoria</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger id="category-filter" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="status-filter" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="draft">Rascunhos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts List */}
      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <Badge variant={post.isPublished ? "default" : "secondary"}>
                      {post.isPublished ? "Publicado" : "Rascunho"}
                    </Badge>
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(post.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.publishedAt ? 
                    new Date(post.publishedAt).toLocaleDateString('pt-BR') : 
                    'Não publicado'
                  }
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.viewCount || 0} visualizações
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {post.tags.slice(0, 2).join(", ")}
                    {post.tags.length > 2 && ` +${post.tags.length - 2}`}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                ? "Tente ajustar os filtros de busca."
                : "Comece criando seu primeiro artigo para o blog."}
            </p>
            {(!searchTerm && filterCategory === "all" && filterStatus === "all") && (
              <Button onClick={handleAddNew} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Artigo
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Editar Artigo" : "Novo Artigo"}
            </DialogTitle>
            <DialogDescription>
              {editingPost ? "Edite as informações do artigo" : "Crie um novo artigo para o blog"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Conteúdo</TabsTrigger>
                  <TabsTrigger value="details">Detalhes</TabsTrigger>
                  <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
                  <TabsTrigger value="publish">Publicação</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título *</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o título do artigo" {...field} />
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
                        <FormLabel>URL (Slug)</FormLabel>
                        <FormControl>
                          <Input placeholder="url-do-artigo (deixe vazio para gerar automaticamente)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resumo *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Breve resumo do artigo (será exibido nas listagens)"
                            rows={3}
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
                        <FormLabel>Conteúdo *</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Escreva o conteúdo completo do artigo..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Autor *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do autor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Imagem</FormLabel>
                        <FormControl>
                          <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Digite as tags separadas por vírgula"
                            value={field.value?.join(", ") || ""}
                            onChange={(e) => {
                              const tags = e.target.value.split(",").map(tag => tag.trim()).filter(Boolean);
                              field.onChange(tags);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="space-y-4">
                  <div className="border rounded-lg p-6 bg-white">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Pré-visualização do Artigo</h3>
                    
                    {form.watch("title") && (
                      <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                          {form.watch("title")}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {form.watch("author") || "Autor não informado"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date().toLocaleDateString('pt-BR')}
                          </span>
                          {form.watch("category") && (
                            <Badge variant="outline">{form.watch("category")}</Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {form.watch("excerpt") && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 font-medium italic">
                          {form.watch("excerpt")}
                        </p>
                      </div>
                    )}
                    
                    {form.watch("imageUrl") && (
                      <div className="mb-6">
                        <img 
                          src={form.watch("imageUrl")} 
                          alt={form.watch("title") || "Imagem do artigo"}
                          className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    {form.watch("content") ? (
                      <BlogContentViewer content={form.watch("content")} />
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Adicione conteúdo para ver a pré-visualização</p>
                      </div>
                    )}
                    
                    {form.watch("tags") && form.watch("tags").length > 0 && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Tags:</h4>
                        <div className="flex flex-wrap gap-2">
                          {form.watch("tags").map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="publish" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Publicar Artigo</FormLabel>
                          <div className="text-sm text-gray-600">
                            O artigo ficará visível no site quando publicado
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {createMutation.isPending || updateMutation.isPending ? "Salvando..." : 
                   editingPost ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}