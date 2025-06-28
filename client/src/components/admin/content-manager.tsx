import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit, 
  Trash2, 
  Plus, 
  Save,
  X,
  Eye,
  Calendar,
  Users,
  MessageSquare,
  Settings,
  BarChart
} from "lucide-react";
import { motion } from "framer-motion";

interface ContentItem {
  id: number;
  type: 'blog' | 'event' | 'video' | 'hero' | 'about';
  title: string;
  description?: string;
  status: 'published' | 'draft' | 'scheduled';
  lastModified: string;
  author?: string;
  views?: number;
  engagement?: number;
}

export default function ContentManager() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [showStats, setShowStats] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Simular dados de conteúdo - em produção viria das APIs reais
  const { data: contentItems = [], isLoading } = useQuery<ContentItem[]>({
    queryKey: ["/api/admin/content", selectedType],
    queryFn: async () => {
      // Combinar dados de diferentes APIs
      const [blogPosts, events, videos, heroSlides] = await Promise.all([
        fetch("/api/blog-posts").then(r => r.json()),
        fetch("/api/events").then(r => r.json()),
        fetch("/api/videos").then(r => r.json()),
        fetch("/api/hero-slides").then(r => r.json())
      ]);

      const items: ContentItem[] = [
        ...blogPosts.map((post: any) => ({
          id: post.id,
          type: 'blog' as const,
          title: post.title,
          description: post.excerpt,
          status: post.isPublished ? 'published' : 'draft',
          lastModified: post.updatedAt || post.createdAt,
          author: post.author,
          views: post.viewCount || 0,
          engagement: Math.floor(Math.random() * 100)
        })),
        ...events.map((event: any) => ({
          id: event.id,
          type: 'event' as const,
          title: event.title,
          description: event.description,
          status: new Date(event.date) > new Date() ? 'scheduled' : 'published',
          lastModified: event.updatedAt || event.createdAt,
          views: event.currentAttendees || 0,
          engagement: Math.floor(Math.random() * 100)
        })),
        ...videos.map((video: any) => ({
          id: video.id,
          type: 'video' as const,
          title: video.title,
          description: video.description,
          status: 'published',
          lastModified: video.createdAt,
          author: video.speaker,
          views: video.viewCount || 0,
          engagement: Math.floor(Math.random() * 100)
        })),
        ...heroSlides.map((slide: any) => ({
          id: slide.id,
          type: 'hero' as const,
          title: slide.title,
          description: slide.description,
          status: slide.isActive ? 'published' : 'draft',
          lastModified: new Date().toISOString(),
          views: Math.floor(Math.random() * 1000),
          engagement: Math.floor(Math.random() * 100)
        }))
      ];

      return selectedType === 'all' 
        ? items 
        : items.filter(item => item.type === selectedType);
    }
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ item, data }: { item: ContentItem, data: any }) => {
      const endpoint = {
        blog: `/api/blog-posts/${item.id}`,
        event: `/api/events/${item.id}`,
        video: `/api/videos/${item.id}`,
        hero: `/api/hero-slides/${item.id}`,
        about: `/api/about-content/${item.id}`
      }[item.type];

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Falha ao atualizar conteúdo');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Conteúdo atualizado com sucesso!" });
      setEditingItem(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content"] });
    },
    onError: () => {
      toast({ 
        title: "Erro ao atualizar conteúdo", 
        variant: "destructive" 
      });
    }
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (item: ContentItem) => {
      const endpoint = {
        blog: `/api/blog-posts/${item.id}`,
        event: `/api/events/${item.id}`,
        video: `/api/videos/${item.id}`,
        hero: `/api/hero-slides/${item.id}`,
        about: `/api/about-content/${item.id}`
      }[item.type];

      const response = await fetch(endpoint, { method: 'DELETE' });
      if (!response.ok) throw new Error('Falha ao deletar conteúdo');
    },
    onSuccess: () => {
      toast({ title: "Conteúdo removido com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content"] });
    },
    onError: () => {
      toast({ 
        title: "Erro ao remover conteúdo", 
        variant: "destructive" 
      });
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return <MessageSquare className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'video': return <Eye className="h-4 w-4" />;
      case 'hero': return <Settings className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const contentTypes = [
    { value: 'all', label: 'Todos', count: contentItems.length },
    { value: 'blog', label: 'Blog', count: contentItems.filter(i => i.type === 'blog').length },
    { value: 'event', label: 'Eventos', count: contentItems.filter(i => i.type === 'event').length },
    { value: 'video', label: 'Vídeos', count: contentItems.filter(i => i.type === 'video').length },
    { value: 'hero', label: 'Hero Slides', count: contentItems.filter(i => i.type === 'hero').length }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header com estatísticas */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciador de Conteúdo</h2>
          <p className="text-gray-600">Gerencie todo o conteúdo do site em um só lugar</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2"
          >
            <BarChart className="h-4 w-4" />
            {showStats ? 'Ocultar' : 'Mostrar'} Estatísticas
          </Button>
          
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Conteúdo
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Visualizações</p>
                  <p className="text-2xl font-bold">
                    {contentItems.reduce((sum, item) => sum + (item.views || 0), 0).toLocaleString()}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conteúdo Publicado</p>
                  <p className="text-2xl font-bold">
                    {contentItems.filter(i => i.status === 'published').length}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rascunhos</p>
                  <p className="text-2xl font-bold">
                    {contentItems.filter(i => i.status === 'draft').length}
                  </p>
                </div>
                <Edit className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Agendados</p>
                  <p className="text-2xl font-bold">
                    {contentItems.filter(i => i.status === 'scheduled').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {contentTypes.map(type => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? "default" : "outline"}
            onClick={() => setSelectedType(type.value)}
            className="flex items-center gap-2"
          >
            {getTypeIcon(type.value)}
            {type.label}
            <Badge variant="secondary" className="ml-1">
              {type.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Lista de conteúdo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <Badge className={`${getStatusColor(item.status)} text-white`}>
                      {item.status}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteContentMutation.mutate(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <CardTitle className="text-lg line-clamp-2">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {item.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {new Date(item.lastModified).toLocaleDateString('pt-BR')}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    {item.views !== undefined && (
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.views}
                      </span>
                    )}
                    
                    {item.author && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {item.author}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {contentItems.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Nenhum conteúdo encontrado
          </h3>
          <p className="text-gray-500">
            Comece criando seu primeiro conteúdo
          </p>
        </div>
      )}

      {/* Modal de edição */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Editar: {editingItem.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingItem(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  defaultValue={editingItem.title}
                  placeholder="Título do conteúdo"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  defaultValue={editingItem.description}
                  placeholder="Descrição do conteúdo"
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    // Implementar atualização
                    updateContentMutation.mutate({
                      item: editingItem,
                      data: {
                        title: (document.getElementById('title') as HTMLInputElement)?.value,
                        description: (document.getElementById('description') as HTMLTextAreaElement)?.value
                      }
                    });
                  }}
                  disabled={updateContentMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateContentMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}