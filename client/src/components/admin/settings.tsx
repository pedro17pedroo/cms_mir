import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Settings, Globe, Mail, Shield, Database, Palette, Bell } from "lucide-react";
import type { SiteSettings, HeaderConfig, FooterConfig } from "@shared/schema";

export default function SettingsPanel() {
  const { toast } = useToast();
  
  const { data: siteSettings } = useQuery<SiteSettings[]>({
    queryKey: ["/api/site-settings"],
  });

  const { data: headerConfig } = useQuery<HeaderConfig>({
    queryKey: ["/api/header-config"],
  });

  const { data: footerConfig } = useQuery<FooterConfig>({
    queryKey: ["/api/footer-config"],
  });

  const [generalSettings, setGeneralSettings] = useState({
    siteName: siteSettings?.find(s => s.key === 'site_name')?.value || '',
    siteDescription: siteSettings?.find(s => s.key === 'site_description')?.value || '',
    contactEmail: siteSettings?.find(s => s.key === 'contact_email')?.value || '',
    contactPhone: siteSettings?.find(s => s.key === 'contact_phone')?.value || '',
    address: siteSettings?.find(s => s.key === 'address')?.value || '',
    timezone: siteSettings?.find(s => s.key === 'timezone')?.value || 'Europe/Lisbon',
    language: siteSettings?.find(s => s.key === 'language')?.value || 'pt',
    maintenanceMode: siteSettings?.find(s => s.key === 'maintenance_mode')?.value === 'true',
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: siteSettings?.find(s => s.key === 'smtp_host')?.value || '',
    smtpPort: siteSettings?.find(s => s.key === 'smtp_port')?.value || '587',
    smtpUser: siteSettings?.find(s => s.key === 'smtp_user')?.value || '',
    smtpPassword: siteSettings?.find(s => s.key === 'smtp_password')?.value || '',
    fromEmail: siteSettings?.find(s => s.key === 'from_email')?.value || '',
    fromName: siteSettings?.find(s => s.key === 'from_name')?.value || '',
  });

  const [socialSettings, setSocialSettings] = useState({
    facebookUrl: siteSettings?.find(s => s.key === 'facebook_url')?.value || '',
    instagramUrl: siteSettings?.find(s => s.key === 'instagram_url')?.value || '',
    youtubeUrl: siteSettings?.find(s => s.key === 'youtube_url')?.value || '',
    whatsappNumber: siteSettings?.find(s => s.key === 'whatsapp_number')?.value || '',
    twitterUrl: siteSettings?.find(s => s.key === 'twitter_url')?.value || '',
  });

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: siteSettings?.find(s => s.key === 'meta_title')?.value || '',
    metaDescription: siteSettings?.find(s => s.key === 'meta_description')?.value || '',
    metaKeywords: siteSettings?.find(s => s.key === 'meta_keywords')?.value || '',
    googleAnalyticsId: siteSettings?.find(s => s.key === 'google_analytics_id')?.value || '',
    googleSiteVerification: siteSettings?.find(s => s.key === 'google_site_verification')?.value || '',
    facebookPixelId: siteSettings?.find(s => s.key === 'facebook_pixel_id')?.value || '',
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Record<string, string>) => {
      const promises = Object.entries(settings).map(([key, value]) =>
        apiRequest("PUT", `/api/site-settings/${key}`, { value })
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({
        title: "Configurações atualizadas",
        description: "As configurações foram salvas com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar configurações",
        variant: "destructive",
      });
    },
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = {
      site_name: generalSettings.siteName,
      site_description: generalSettings.siteDescription,
      contact_email: generalSettings.contactEmail,
      contact_phone: generalSettings.contactPhone,
      address: generalSettings.address,
      timezone: generalSettings.timezone,
      language: generalSettings.language,
      maintenance_mode: generalSettings.maintenanceMode.toString(),
    };
    updateSettingsMutation.mutate(settings);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = {
      smtp_host: emailSettings.smtpHost,
      smtp_port: emailSettings.smtpPort,
      smtp_user: emailSettings.smtpUser,
      smtp_password: emailSettings.smtpPassword,
      from_email: emailSettings.fromEmail,
      from_name: emailSettings.fromName,
    };
    updateSettingsMutation.mutate(settings);
  };

  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = {
      facebook_url: socialSettings.facebookUrl,
      instagram_url: socialSettings.instagramUrl,
      youtube_url: socialSettings.youtubeUrl,
      whatsapp_number: socialSettings.whatsappNumber,
      twitter_url: socialSettings.twitterUrl,
    };
    updateSettingsMutation.mutate(settings);
  };

  const handleSeoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = {
      meta_title: seoSettings.metaTitle,
      meta_description: seoSettings.metaDescription,
      meta_keywords: seoSettings.metaKeywords,
      google_analytics_id: seoSettings.googleAnalyticsId,
      google_site_verification: seoSettings.googleSiteVerification,
      facebook_pixel_id: seoSettings.facebookPixelId,
    };
    updateSettingsMutation.mutate(settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6 text-[hsl(43,96%,56%)]" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h2>
          <p className="text-gray-600">Gerencie as configurações globais do website</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure informações básicas do website e dados de contato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneralSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Nome do Site</Label>
                    <Input
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                      placeholder="Nome da sua igreja"
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <Select value={generalSettings.language} onValueChange={(value) => setGeneralSettings({ ...generalSettings, language: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt">Português</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="siteDescription">Descrição do Site</Label>
                  <Textarea
                    id="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                    placeholder="Breve descrição da sua igreja"
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Email de Contato</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                      placeholder="contato@igrejia.pt"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Telefone de Contato</Label>
                    <Input
                      id="contactPhone"
                      value={generalSettings.contactPhone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
                      placeholder="+351 912 345 678"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Textarea
                    id="address"
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                    placeholder="Rua da Igreja, 123, Lisboa, Portugal"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o fuso horário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Lisbon">Europa/Lisboa</SelectItem>
                        <SelectItem value="Europe/Madrid">Europa/Madrid</SelectItem>
                        <SelectItem value="America/Sao_Paulo">América/São Paulo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="maintenanceMode"
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, maintenanceMode: checked })}
                    />
                    <Label htmlFor="maintenanceMode">Modo de Manutenção</Label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={updateSettingsMutation.isPending}
                  className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]"
                >
                  {updateSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Email</CardTitle>
              <CardDescription>
                Configure o servidor SMTP para envio de emails automáticos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">Servidor SMTP</Label>
                    <Input
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">Porta SMTP</Label>
                    <Input
                      id="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                      placeholder="587"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpUser">Usuário SMTP</Label>
                    <Input
                      id="smtpUser"
                      value={emailSettings.smtpUser}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                      placeholder="seu-email@gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">Senha SMTP</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                      placeholder="Senha da aplicação"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromEmail">Email Remetente</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                      placeholder="noreply@igrejia.pt"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromName">Nome Remetente</Label>
                    <Input
                      id="fromName"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                      placeholder="Igreja Milagre"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={updateSettingsMutation.isPending}
                  className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]"
                >
                  {updateSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações de Email"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>
                Configure os links das redes sociais da igreja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSocialSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facebookUrl">Facebook URL</Label>
                    <Input
                      id="facebookUrl"
                      value={socialSettings.facebookUrl}
                      onChange={(e) => setSocialSettings({ ...socialSettings, facebookUrl: e.target.value })}
                      placeholder="https://facebook.com/suaigreja"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagramUrl">Instagram URL</Label>
                    <Input
                      id="instagramUrl"
                      value={socialSettings.instagramUrl}
                      onChange={(e) => setSocialSettings({ ...socialSettings, instagramUrl: e.target.value })}
                      placeholder="https://instagram.com/suaigreja"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="youtubeUrl">YouTube URL</Label>
                    <Input
                      id="youtubeUrl"
                      value={socialSettings.youtubeUrl}
                      onChange={(e) => setSocialSettings({ ...socialSettings, youtubeUrl: e.target.value })}
                      placeholder="https://youtube.com/@suaigreja"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsappNumber">WhatsApp Número</Label>
                    <Input
                      id="whatsappNumber"
                      value={socialSettings.whatsappNumber}
                      onChange={(e) => setSocialSettings({ ...socialSettings, whatsappNumber: e.target.value })}
                      placeholder="+351912345678"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="twitterUrl">Twitter/X URL</Label>
                  <Input
                    id="twitterUrl"
                    value={socialSettings.twitterUrl}
                    onChange={(e) => setSocialSettings({ ...socialSettings, twitterUrl: e.target.value })}
                    placeholder="https://twitter.com/suaigreja"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={updateSettingsMutation.isPending}
                  className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]"
                >
                  {updateSettingsMutation.isPending ? "Salvando..." : "Salvar Redes Sociais"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações SEO</CardTitle>
              <CardDescription>
                Configure meta tags e integrações de analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSeoSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Título Meta Padrão</Label>
                  <Input
                    id="metaTitle"
                    value={seoSettings.metaTitle}
                    onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                    placeholder="Igreja Milagre - Fé, Esperança e Amor"
                  />
                </div>

                <div>
                  <Label htmlFor="metaDescription">Descrição Meta Padrão</Label>
                  <Textarea
                    id="metaDescription"
                    value={seoSettings.metaDescription}
                    onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                    placeholder="Venha conhecer nossa comunidade de fé..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="metaKeywords">Palavras-chave Meta</Label>
                  <Input
                    id="metaKeywords"
                    value={seoSettings.metaKeywords}
                    onChange={(e) => setSeoSettings({ ...seoSettings, metaKeywords: e.target.value })}
                    placeholder="igreja, fé, comunidade, cultos, orações"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                    <Input
                      id="googleAnalyticsId"
                      value={seoSettings.googleAnalyticsId}
                      onChange={(e) => setSeoSettings({ ...seoSettings, googleAnalyticsId: e.target.value })}
                      placeholder="GA4-XXXXXXXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="googleSiteVerification">Google Site Verification</Label>
                    <Input
                      id="googleSiteVerification"
                      value={seoSettings.googleSiteVerification}
                      onChange={(e) => setSeoSettings({ ...seoSettings, googleSiteVerification: e.target.value })}
                      placeholder="Meta tag de verificação"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                  <Input
                    id="facebookPixelId"
                    value={seoSettings.facebookPixelId}
                    onChange={(e) => setSeoSettings({ ...seoSettings, facebookPixelId: e.target.value })}
                    placeholder="Pixel ID do Facebook"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={updateSettingsMutation.isPending}
                  className="bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]"
                >
                  {updateSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações SEO"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Gerencie configurações de segurança e acesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Autenticação de Dois Fatores</div>
                  <div className="text-sm text-gray-500">Adicione uma camada extra de segurança</div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Login com Captcha</div>
                  <div className="text-sm text-gray-500">Proteja contra ataques automatizados</div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Log de Auditoria</div>
                  <div className="text-sm text-gray-500">Registre todas as ações dos administradores</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Backup Automático</div>
                  <div className="text-sm text-gray-500">Backup diário automático do banco de dados</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Configure quando e como receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Novos Comentários</div>
                  <div className="text-sm text-gray-500">Notificar quando há novos comentários</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Novos Registros de Eventos</div>
                  <div className="text-sm text-gray-500">Notificar sobre inscrições em eventos</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Doações Recebidas</div>
                  <div className="text-sm text-gray-500">Notificar sobre novas doações</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Atualizações do Sistema</div>
                  <div className="text-sm text-gray-500">Notificar sobre atualizações disponíveis</div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Relatório Semanal</div>
                  <div className="text-sm text-gray-500">Receber resumo semanal por email</div>
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