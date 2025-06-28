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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Facebook, Instagram, Youtube, MessageCircle, Plus, Settings, BarChart3, Calendar, Users } from "lucide-react";

export default function SocialMediaManager() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Sample data for social media metrics
  const socialStats = {
    facebook: {
      followers: 2850,
      engagement: 68.5,
      posts: 145,
      reach: 12400
    },
    instagram: {
      followers: 1920,
      engagement: 72.3,
      posts: 98,
      reach: 8600
    },
    youtube: {
      subscribers: 950,
      views: 45200,
      videos: 32,
      watchTime: 1250
    },
    whatsapp: {
      groups: 8,
      members: 485,
      messages: 2840,
      active: 6
    }
  };

  const [newPost, setNewPost] = useState({
    platform: "",
    content: "",
    mediaUrl: "",
    scheduledTime: ""
  });

  const handleCreatePost = () => {
    if (!newPost.platform || !newPost.content) {
      toast({
        title: "Erro",
        description: "Plataforma e conteúdo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Simulate post creation
    toast({ title: "Post agendado com sucesso!" });
    setIsPostDialogOpen(false);
    setNewPost({ platform: "", content: "", mediaUrl: "", scheduledTime: "" });
  };

  const recentPosts = [
    {
      id: "1",
      platform: "facebook",
      content: "Hoje celebramos a fé e a união em nosso culto dominical! 🙏",
      timestamp: "2025-06-27T10:00:00",
      likes: 45,
      comments: 12,
      shares: 8,
      status: "published"
    },
    {
      id: "2",
      platform: "instagram",
      content: "Momentos especiais do nosso culto de oração desta semana ✨",
      timestamp: "2025-06-25T19:30:00",
      likes: 78,
      comments: 15,
      shares: 0,
      status: "published"
    },
    {
      id: "3",
      platform: "youtube",
      content: "Nova mensagem: 'Caminhando em Fé' - Pastor João",
      timestamp: "2025-06-28T15:00:00",
      likes: 32,
      comments: 6,
      shares: 12,
      status: "scheduled"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-purple-800">Gestão de Redes Sociais</h2>
          <p className="text-gray-600">Gerencie todas as suas redes sociais em um só lugar</p>
        </div>
        <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Post</DialogTitle>
              <DialogDescription>
                Publique ou agende conteúdo para suas redes sociais
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="post-platform">Plataforma *</Label>
                <select
                  id="post-platform"
                  className="w-full p-2 border rounded-md"
                  value={newPost.platform}
                  onChange={(e) => setNewPost(prev => ({ ...prev, platform: e.target.value }))}
                >
                  <option value="">Selecione uma plataforma</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-content">Conteúdo *</Label>
                <Textarea
                  id="post-content"
                  placeholder="Digite o conteúdo do post..."
                  rows={4}
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-media">URL da Mídia (opcional)</Label>
                <Input
                  id="post-media"
                  placeholder="https://..."
                  value={newPost.mediaUrl}
                  onChange={(e) => setNewPost(prev => ({ ...prev, mediaUrl: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-schedule">Agendar (opcional)</Label>
                <Input
                  id="post-schedule"
                  type="datetime-local"
                  value={newPost.scheduledTime}
                  onChange={(e) => setNewPost(prev => ({ ...prev, scheduledTime: e.target.value }))}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleCreatePost} className="flex-1">
                  {newPost.scheduledTime ? "Agendar Post" : "Publicar Agora"}
                </Button>
                <Button variant="outline" onClick={() => setIsPostDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Platform Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Facebook</CardTitle>
                <Facebook className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialStats.facebook.followers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">seguidores</p>
                <div className="mt-2 text-sm">
                  <span className="text-green-600">↗ {socialStats.facebook.engagement}%</span> engajamento
                </div>
              </CardContent>
            </Card>

            <Card className="border-pink-200 bg-pink-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Instagram</CardTitle>
                <Instagram className="h-4 w-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialStats.instagram.followers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">seguidores</p>
                <div className="mt-2 text-sm">
                  <span className="text-green-600">↗ {socialStats.instagram.engagement}%</span> engajamento
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">YouTube</CardTitle>
                <Youtube className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialStats.youtube.subscribers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">inscritos</p>
                <div className="mt-2 text-sm">
                  <span className="text-green-600">↗ {socialStats.youtube.views.toLocaleString()}</span> visualizações
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
                <MessageCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialStats.whatsapp.members}</div>
                <p className="text-xs text-muted-foreground">membros</p>
                <div className="mt-2 text-sm">
                  <span className="text-blue-600">{socialStats.whatsapp.groups}</span> grupos ativos
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Gerencie suas redes sociais rapidamente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span>Agendar Posts</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Ver Analytics</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Gerenciar Grupos</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {post.platform === 'facebook' && <Facebook className="h-4 w-4 text-blue-600" />}
                        {post.platform === 'instagram' && <Instagram className="h-4 w-4 text-pink-600" />}
                        {post.platform === 'youtube' && <Youtube className="h-4 w-4 text-red-600" />}
                        <span className="font-medium capitalize">{post.platform}</span>
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                          {post.status === "published" ? "Publicado" : "Agendado"}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{post.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{new Date(post.timestamp).toLocaleString('pt-BR')}</span>
                        {post.status === "published" && (
                          <>
                            <span>❤️ {post.likes}</span>
                            <span>💬 {post.comments}</span>
                            {post.shares > 0 && <span>🔄 {post.shares}</span>}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      {post.status === "scheduled" && (
                        <Button variant="outline" size="sm">
                          Publicar Agora
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engajamento por Plataforma</CardTitle>
                <CardDescription>Taxa de engajamento nos últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { platform: "Instagram", rate: 72.3, color: "bg-pink-500" },
                    { platform: "Facebook", rate: 68.5, color: "bg-blue-500" },
                    { platform: "YouTube", rate: 45.2, color: "bg-red-500" },
                    { platform: "WhatsApp", rate: 89.1, color: "bg-green-500" }
                  ].map((item) => (
                    <div key={item.platform} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-20">{item.platform}</span>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full`}
                            style={{ width: `${(item.rate / 100) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-right">{item.rate}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Seguidores</CardTitle>
                <CardDescription>Novos seguidores por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'].map((month, index) => {
                    const growth = [125, 89, 156, 203, 178, 234][index];
                    const percentage = (growth / 234) * 100;
                    return (
                      <div key={month} className="flex items-center justify-between">
                        <span className="text-sm font-medium w-20">{month}</span>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-gray-600 w-16 text-right">+{growth}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Melhores Horários para Postar</CardTitle>
              <CardDescription>Baseado no engajamento histórico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">09:00</div>
                  <p className="text-sm text-gray-600">Facebook</p>
                  <p className="text-xs text-gray-500">Maior engajamento</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-pink-600">18:30</div>
                  <p className="text-sm text-gray-600">Instagram</p>
                  <p className="text-xs text-gray-500">Horário ideal</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">15:00</div>
                  <p className="text-sm text-gray-600">YouTube</p>
                  <p className="text-xs text-gray-500">Melhor alcance</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">20:00</div>
                  <p className="text-sm text-gray-600">WhatsApp</p>
                  <p className="text-xs text-gray-500">Mais ativo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações das Plataformas</CardTitle>
              <CardDescription>Configure as integrações com suas redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { platform: "Facebook", connected: true, icon: Facebook, color: "text-blue-600" },
                { platform: "Instagram", connected: true, icon: Instagram, color: "text-pink-600" },
                { platform: "YouTube", connected: false, icon: Youtube, color: "text-red-600" },
                { platform: "WhatsApp", connected: true, icon: MessageCircle, color: "text-green-600" }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.platform} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-6 w-6 ${item.color}`} />
                      <div>
                        <div className="font-medium">{item.platform}</div>
                        <div className="text-sm text-gray-500">
                          {item.connected ? "Conectado" : "Não conectado"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Switch checked={item.connected} />
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Configurar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Postagem</CardTitle>
              <CardDescription>Defina preferências para suas publicações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-hashtags</div>
                  <div className="text-sm text-gray-500">Adicionar hashtags automaticamente</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Moderação de comentários</div>
                  <div className="text-sm text-gray-500">Revisar comentários antes da publicação</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Notificações de engajamento</div>
                  <div className="text-sm text-gray-500">Receber alertas sobre interações</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}