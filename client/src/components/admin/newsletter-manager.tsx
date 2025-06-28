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
import { Mail, Send, Users, Plus, Edit, Trash2, Calendar, TrendingUp, Download } from "lucide-react";

export default function NewsletterManager() {
  const [activeTab, setActiveTab] = useState("subscribers");
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscribers, isLoading } = useQuery({
    queryKey: ["/api/newsletter-subscribers"],
  });

  const [newNewsletter, setNewNewsletter] = useState({
    subject: "",
    content: "",
    scheduledTime: ""
  });

  const sendNewsletterMutation = useMutation({
    mutationFn: (newsletter: typeof newNewsletter) => 
      apiRequest("/api/newsletter/send", "POST", newsletter),
    onSuccess: () => {
      toast({ title: "Newsletter enviada com sucesso!" });
      setIsComposeDialogOpen(false);
      setNewNewsletter({ subject: "", content: "", scheduledTime: "" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao enviar newsletter", 
        description: "Tente novamente em alguns instantes.",
        variant: "destructive" 
      });
    }
  });

  const unsubscribeMutation = useMutation({
    mutationFn: (email: string) => 
      apiRequest("/api/newsletter-unsubscribe", "POST", { email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter-subscribers"] });
      toast({ title: "Assinante removido com sucesso!" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao remover assinante",
        variant: "destructive" 
      });
    }
  });

  const handleSendNewsletter = () => {
    if (!newNewsletter.subject || !newNewsletter.content) {
      toast({
        title: "Erro",
        description: "Assunto e conteúdo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    sendNewsletterMutation.mutate(newNewsletter);
  };

  const handleUnsubscribe = (email: string) => {
    if (confirm(`Deseja remover ${email} da lista?`)) {
      unsubscribeMutation.mutate(email);
    }
  };

  // Sample newsletter campaigns data
  const campaigns = [
    {
      id: "1",
      subject: "Evento Especial - Conferência de Fé",
      sentDate: "2025-06-25",
      recipients: 245,
      openRate: 68.5,
      clickRate: 12.3,
      status: "sent"
    },
    {
      id: "2",
      subject: "Novidades da Semana - Igreja",
      sentDate: "2025-06-20",
      recipients: 230,
      openRate: 72.1,
      clickRate: 15.8,
      status: "sent"
    },
    {
      id: "3",
      subject: "Convite para Culto de Oração",
      sentDate: "2025-06-30",
      recipients: 250,
      openRate: 0,
      clickRate: 0,
      status: "scheduled"
    }
  ];

  const newsletterStats = {
    totalSubscribers: Array.isArray(subscribers) ? subscribers.length : 0,
    growthRate: 15.2,
    avgOpenRate: 70.2,
    avgClickRate: 14.1,
    totalCampaigns: campaigns.length,
    lastCampaign: "2 dias atrás"
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-purple-800">Gestão de Newsletter</h2>
          <p className="text-gray-600">Gerencie assinantes e campanhas de email</p>
        </div>
        <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Newsletter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compor Nova Newsletter</DialogTitle>
              <DialogDescription>
                Crie e envie uma nova newsletter para seus assinantes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newsletter-subject">Assunto *</Label>
                <Input
                  id="newsletter-subject"
                  placeholder="Ex: Novidades da Semana"
                  value={newNewsletter.subject}
                  onChange={(e) => setNewNewsletter(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter-content">Conteúdo *</Label>
                <Textarea
                  id="newsletter-content"
                  placeholder="Digite o conteúdo da newsletter..."
                  rows={10}
                  value={newNewsletter.content}
                  onChange={(e) => setNewNewsletter(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter-schedule">Agendar Envio (opcional)</Label>
                <Input
                  id="newsletter-schedule"
                  type="datetime-local"
                  value={newNewsletter.scheduledTime}
                  onChange={(e) => setNewNewsletter(prev => ({ ...prev, scheduledTime: e.target.value }))}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSendNewsletter} 
                  className="flex-1"
                  disabled={sendNewsletterMutation.isPending}
                >
                  {sendNewsletterMutation.isPending ? "Enviando..." : "Enviar Newsletter"}
                </Button>
                <Button variant="outline" onClick={() => setIsComposeDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Assinantes</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsletterStats.totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">+{newsletterStats.growthRate}% este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Abertura</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsletterStats.avgOpenRate}%</div>
            <p className="text-xs text-muted-foreground">Média das últimas campanhas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Cliques</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsletterStats.avgClickRate}%</div>
            <p className="text-xs text-muted-foreground">Engajamento médio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Enviadas</CardTitle>
            <Send className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsletterStats.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">Última: {newsletterStats.lastCampaign}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subscribers">Assinantes</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Lista de Assinantes ({newsletterStats.totalSubscribers})</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(subscribers) && subscribers.length > 0 ? (
                  subscribers.map((subscriber: any) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{subscriber.name}</div>
                        <div className="text-sm text-gray-500">{subscriber.email}</div>
                        <div className="text-xs text-gray-400">
                          Inscrito em: {new Date(subscriber.subscribedAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                          {subscriber.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUnsubscribe(subscriber.email)}
                          disabled={unsubscribeMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Nenhum assinante encontrado
                    </h3>
                    <p className="text-gray-500">
                      Os assinantes aparecerão aqui quando se inscreverem na newsletter
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{campaign.subject}</h3>
                        <Badge 
                          variant={campaign.status === "sent" ? "default" : "secondary"}
                        >
                          {campaign.status === "sent" ? "Enviada" : "Agendada"}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Data:</span> {new Date(campaign.sentDate).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <span className="font-medium">Destinatários:</span> {campaign.recipients}
                        </div>
                        <div>
                          <span className="font-medium">Taxa de Abertura:</span> {campaign.openRate}%
                        </div>
                        <div>
                          <span className="font-medium">Taxa de Cliques:</span> {campaign.clickRate}%
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {campaign.status === "scheduled" && (
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4" />
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
                <CardTitle>Crescimento de Assinantes</CardTitle>
                <CardDescription>Novos assinantes por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'].map((month, index) => {
                    const subscribers = [25, 32, 18, 45, 38, 52][index];
                    const percentage = (subscribers / 52) * 100;
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
                        <span className="text-sm text-gray-600 w-16 text-right">+{subscribers}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance das Campanhas</CardTitle>
                <CardDescription>Métricas das últimas newsletters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Taxa de abertura média</span>
                    <span className="font-semibold">{newsletterStats.avgOpenRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Taxa de cliques média</span>
                    <span className="font-semibold">{newsletterStats.avgClickRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Taxa de descadastro</span>
                    <span className="font-semibold">0.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Melhor dia para envio</span>
                    <span className="font-semibold">Quarta-feira</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Melhor horário</span>
                    <span className="font-semibold">10:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Segmentação de Assinantes</CardTitle>
              <CardDescription>Como os assinantes interagem com o conteúdo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">65%</div>
                  <p className="text-sm text-gray-600">Assinantes Ativos</p>
                  <p className="text-xs text-gray-500">Abrem regularmente</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">25%</div>
                  <p className="text-sm text-gray-600">Ocasionais</p>
                  <p className="text-xs text-gray-500">Abrem esporadicamente</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">10%</div>
                  <p className="text-sm text-gray-600">Inativos</p>
                  <p className="text-xs text-gray-500">Não abrem há meses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}