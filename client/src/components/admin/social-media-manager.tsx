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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Facebook, Instagram, Youtube, MessageCircle, Share2, Eye, Heart, Users, Settings } from "lucide-react";

export default function SocialMediaManager() {
  const [activeTab, setActiveTab] = useState("settings");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: siteSettings } = useQuery({
    queryKey: ["/api/site-settings"],
  });

  const [socialSettings, setSocialSettings] = useState({
    facebook: {
      pageUrl: "",
      accessToken: "",
      autoPost: false,
      enabled: true
    },
    instagram: {
      username: "",
      accessToken: "",
      autoPost: false,
      enabled: true
    },
    youtube: {
      channelId: "",
      apiKey: "",
      autoEmbed: true,
      enabled: true
    },
    whatsapp: {
      phoneNumber: "",
      groupLink: "",
      enabled: true
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => 
      apiRequest(`/api/site-settings/${key}`, "PUT", { value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({ title: "Configurações atualizadas com sucesso!" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao atualizar", 
        description: "Tente novamente em alguns instantes.",
        variant: "destructive" 
      });
    }
  });

  const handleSaveSocialSettings = (platform: string, settings: any) => {
    const settingsJson = JSON.stringify(settings);
    updateSettingMutation.mutate({ 
      key: `social_${platform}`, 
      value: settingsJson 
    });
  };

  const socialMetrics = {
    facebook: { followers: 1250, reach: 5420, engagement: 8.5 },
    instagram: { followers: 890, reach: 2340, engagement: 12.3 },
    youtube: { subscribers: 430, views: 15600, watchTime: "1.2h" },
    whatsapp: { members: 180, messages: 45, active: 89 }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-purple-800">Gestão de Redes Sociais</h2>
          <p className="text-gray-600">Configure e monitore as integrações com redes sociais</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="automation">Automação</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Facebook Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <span>Facebook</span>
                  <Switch 
                    checked={socialSettings.facebook.enabled}
                    onCheckedChange={(checked) => 
                      setSocialSettings(prev => ({
                        ...prev,
                        facebook: { ...prev.facebook, enabled: checked }
                      }))
                    }
                  />
                </CardTitle>
                <CardDescription>Configure a integração com o Facebook</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fb-page">URL da Página</Label>
                  <Input
                    id="fb-page"
                    placeholder="https://facebook.com/suaigreja"
                    value={socialSettings.facebook.pageUrl}
                    onChange={(e) => setSocialSettings(prev => ({
                      ...prev,
                      facebook: { ...prev.facebook, pageUrl: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fb-token">Access Token</Label>
                  <Input
                    id="fb-token"
                    type="password"
                    placeholder="••••••••••••••••"
                    value={socialSettings.facebook.accessToken}
                    onChange={(e) => setSocialSettings(prev => ({
                      ...prev,
                      facebook: { ...prev.facebook, accessToken: e.target.value }
                    }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="fb-auto"
                    checked={socialSettings.facebook.autoPost}
                    onCheckedChange={(checked) => 
                      setSocialSettings(prev => ({
                        ...prev,
                        facebook: { ...prev.facebook, autoPost: checked }
                      }))
                    }
                  />
                  <Label htmlFor="fb-auto">Publicação automática</Label>
                </div>
                <Button 
                  onClick={() => handleSaveSocialSettings('facebook', socialSettings.facebook)}
                  disabled={updateSettingMutation.isPending}
                >
                  Salvar Facebook
                </Button>
              </CardContent>
            </Card>

            {/* Instagram Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <span>Instagram</span>
                  <Switch 
                    checked={socialSettings.instagram.enabled}
                    onCheckedChange={(checked) => 
                      setSocialSettings(prev => ({
                        ...prev,
                        instagram: { ...prev.instagram, enabled: checked }
                      }))
                    }
                  />
                </CardTitle>
                <CardDescription>Configure a integração com o Instagram</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ig-username">Username</Label>
                  <Input
                    id="ig-username"
                    placeholder="@suaigreja"
                    value={socialSettings.instagram.username}
                    onChange={(e) => setSocialSettings(prev => ({
                      ...prev,
                      instagram: { ...prev.instagram, username: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ig-token">Access Token</Label>
                  <Input
                    id="ig-token"
                    type="password"
                    placeholder="••••••••••••••••"
                    value={socialSettings.instagram.accessToken}
                    onChange={(e) => setSocialSettings(prev => ({
                      ...prev,
                      instagram: { ...prev.instagram, accessToken: e.target.value }
                    }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ig-auto"
                    checked={socialSettings.instagram.autoPost}
                    onCheckedChange={(checked) => 
                      setSocialSettings(prev => ({
                        ...prev,
                        instagram: { ...prev.instagram, autoPost: checked }
                      }))
                    }
                  />
                  <Label htmlFor="ig-auto">Publicação automática</Label>
                </div>
                <Button 
                  onClick={() => handleSaveSocialSettings('instagram', socialSettings.instagram)}
                  disabled={updateSettingMutation.isPending}
                >
                  Salvar Instagram
                </Button>
              </CardContent>
            </Card>

            {/* YouTube Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Youtube className="h-5 w-5 text-red-600" />
                  <span>YouTube</span>
                  <Switch 
                    checked={socialSettings.youtube.enabled}
                    onCheckedChange={(checked) => 
                      setSocialSettings(prev => ({
                        ...prev,
                        youtube: { ...prev.youtube, enabled: checked }
                      }))
                    }
                  />
                </CardTitle>
                <CardDescription>Configure a integração com o YouTube</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="yt-channel">ID do Canal</Label>
                  <Input
                    id="yt-channel"
                    placeholder="UCxxxxxxxxxxxxxxxxxx"
                    value={socialSettings.youtube.channelId}
                    onChange={(e) => setSocialSettings(prev => ({
                      ...prev,
                      youtube: { ...prev.youtube, channelId: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yt-api">API Key</Label>
                  <Input
                    id="yt-api"
                    type="password"
                    placeholder="••••••••••••••••"
                    value={socialSettings.youtube.apiKey}
                    onChange={(e) => setSocialSettings(prev => ({
                      ...prev,
                      youtube: { ...prev.youtube, apiKey: e.target.value }
                    }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="yt-auto"
                    checked={socialSettings.youtube.autoEmbed}
                    onCheckedChange={(checked) => 
                      setSocialSettings(prev => ({
                        ...prev,
                        youtube: { ...prev.youtube, autoEmbed: checked }
                      }))
                    }
                  />
                  <Label htmlFor="yt-auto">Incorporação automática</Label>
                </div>
                <Button 
                  onClick={() => handleSaveSocialSettings('youtube', socialSettings.youtube)}
                  disabled={updateSettingMutation.isPending}
                >
                  Salvar YouTube
                </Button>
              </CardContent>
            </Card>

            {/* WhatsApp Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <span>WhatsApp</span>
                  <Switch 
                    checked={socialSettings.whatsapp.enabled}
                    onCheckedChange={(checked) => 
                      setSocialSettings(prev => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, enabled: checked }
                      }))
                    }
                  />
                </CardTitle>
                <CardDescription>Configure os links do WhatsApp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wa-phone">Número de Telefone</Label>
                  <Input
                    id="wa-phone"
                    placeholder="5511999999999"
                    value={socialSettings.whatsapp.phoneNumber}
                    onChange={(e) => setSocialSettings(prev => ({
                      ...prev,
                      whatsapp: { ...prev.whatsapp, phoneNumber: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wa-group">Link do Grupo</Label>
                  <Input
                    id="wa-group"
                    placeholder="https://chat.whatsapp.com/..."
                    value={socialSettings.whatsapp.groupLink}
                    onChange={(e) => setSocialSettings(prev => ({
                      ...prev,
                      whatsapp: { ...prev.whatsapp, groupLink: e.target.value }
                    }))}
                  />
                </div>
                <Button 
                  onClick={() => handleSaveSocialSettings('whatsapp', socialSettings.whatsapp)}
                  disabled={updateSettingMutation.isPending}
                >
                  Salvar WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Facebook</CardTitle>
                <Facebook className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialMetrics.facebook.followers}</div>
                <p className="text-xs text-muted-foreground">
                  {socialMetrics.facebook.reach} alcance | {socialMetrics.facebook.engagement}% engajamento
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Instagram</CardTitle>
                <Instagram className="h-4 w-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialMetrics.instagram.followers}</div>
                <p className="text-xs text-muted-foreground">
                  {socialMetrics.instagram.reach} alcance | {socialMetrics.instagram.engagement}% engajamento
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">YouTube</CardTitle>
                <Youtube className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialMetrics.youtube.subscribers}</div>
                <p className="text-xs text-muted-foreground">
                  {socialMetrics.youtube.views} views | {socialMetrics.youtube.watchTime} tempo médio
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
                <MessageCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialMetrics.whatsapp.members}</div>
                <p className="text-xs text-muted-foreground">
                  {socialMetrics.whatsapp.messages} mensagens | {socialMetrics.whatsapp.active}% ativos
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compartilhamento de Conteúdo</CardTitle>
              <CardDescription>Gerencie como o conteúdo é compartilhado nas redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Mensagens do Blog</h4>
                    <p className="text-sm text-gray-600">Compartilhar automaticamente novos posts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Eventos</h4>
                    <p className="text-sm text-gray-600">Publicar eventos nas redes sociais</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Vídeos</h4>
                    <p className="text-sm text-gray-600">Incorporar vídeos do YouTube automaticamente</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Automação</CardTitle>
              <CardDescription>Configure quando e como o conteúdo é publicado automaticamente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Horários de Publicação</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Melhor horário Facebook</Label>
                      <Input defaultValue="19:00" type="time" />
                    </div>
                    <div>
                      <Label>Melhor horário Instagram</Label>
                      <Input defaultValue="20:00" type="time" />
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Hashtags Padrão</h4>
                  <Textarea 
                    placeholder="#igreja #fé #esperança #comunidade #deus"
                    defaultValue="#igreja #fé #esperança #comunidade #deus"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}