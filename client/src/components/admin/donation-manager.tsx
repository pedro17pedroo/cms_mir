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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DollarSign, Plus, Edit, Trash2, Calendar, TrendingUp, Download, Target, Users, CreditCard } from "lucide-react";
import { insertDonationCampaignSchema } from "@shared/schema";

export default function DonationManager() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ["/api/donation-campaigns"],
  });

  const { data: donations, isLoading: donationsLoading } = useQuery({
    queryKey: ["/api/donations"],
  });

  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    goal: "",
    startDate: "",
    endDate: "",
    imageUrl: ""
  });

  const createCampaignMutation = useMutation({
    mutationFn: (campaign: any) => apiRequest("/api/donation-campaigns", "POST", campaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donation-campaigns"] });
      toast({ title: "Campanha criada com sucesso!" });
      setIsCampaignDialogOpen(false);
      setNewCampaign({ title: "", description: "", goal: "", startDate: "", endDate: "", imageUrl: "" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao criar campanha", 
        description: "Tente novamente em alguns instantes.",
        variant: "destructive" 
      });
    }
  });

  const updateDonationStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      apiRequest(`/api/donations/${id}/status`, "PUT", { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      toast({ title: "Status atualizado com sucesso!" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao atualizar status",
        variant: "destructive" 
      });
    }
  });

  const handleCreateCampaign = () => {
    try {
      const campaignData = {
        ...newCampaign,
        goal: parseFloat(newCampaign.goal),
        isActive: true
      };

      // Validate with schema
      insertDonationCampaignSchema.parse(campaignData);
      createCampaignMutation.mutate(campaignData);
    } catch (error) {
      toast({
        title: "Dados inválidos",
        description: "Verifique os campos obrigatórios",
        variant: "destructive"
      });
    }
  };

  const calculateTotalDonations = () => {
    if (!Array.isArray(donations)) return 0;
    return donations.reduce((sum: number, donation: any) => {
      if (donation.status === 'completed') {
        return sum + parseFloat(donation.amount || 0);
      }
      return sum;
    }, 0);
  };

  const calculateCampaignProgress = (campaign: any) => {
    const raised = parseFloat(campaign.raised || 0);
    const goal = parseFloat(campaign.goal || 1);
    return Math.min((raised / goal) * 100, 100);
  };

  const totalDonations = calculateTotalDonations();
  const completedDonations = Array.isArray(donations) 
    ? donations.filter((d: any) => d.status === 'completed').length 
    : 0;
  const pendingDonations = Array.isArray(donations) 
    ? donations.filter((d: any) => d.status === 'pending').length 
    : 0;

  if (campaignsLoading || donationsLoading) {
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
          <h2 className="text-2xl font-bold text-purple-800">Gestão de Doações</h2>
          <p className="text-gray-600">Gerencie campanhas e doações da igreja</p>
        </div>
        <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Campanha</DialogTitle>
              <DialogDescription>
                Configure uma nova campanha de arrecadação
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-title">Título *</Label>
                <Input
                  id="campaign-title"
                  placeholder="Ex: Reforma do Templo"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-desc">Descrição *</Label>
                <Textarea
                  id="campaign-desc"
                  placeholder="Descreva o objetivo da campanha..."
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-goal">Meta (R$) *</Label>
                  <Input
                    id="campaign-goal"
                    type="number"
                    placeholder="50000"
                    value={newCampaign.goal}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, goal: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-image">URL da Imagem</Label>
                  <Input
                    id="campaign-image"
                    placeholder="https://..."
                    value={newCampaign.imageUrl}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, imageUrl: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-start">Data de Início *</Label>
                  <Input
                    id="campaign-start"
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-end">Data de Término *</Label>
                  <Input
                    id="campaign-end"
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleCreateCampaign} 
                  className="flex-1"
                  disabled={createCampaignMutation.isPending}
                >
                  {createCampaignMutation.isPending ? "Criando..." : "Criar Campanha"}
                </Button>
                <Button variant="outline" onClick={() => setIsCampaignDialogOpen(false)}>
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
            <CardTitle className="text-sm font-medium">Total Arrecadado</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalDonations.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+12% este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doações Completadas</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedDonations}</div>
            <p className="text-xs text-muted-foreground">{pendingDonations} pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(campaigns) ? campaigns.filter((c: any) => c.isActive).length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {Array.isArray(campaigns) ? campaigns.length : 0} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doação Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {completedDonations > 0 ? (totalDonations / completedDonations).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Por doação</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="donations">Doações</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(campaigns) && campaigns.map((campaign: any) => {
              const progress = calculateCampaignProgress(campaign);
              const raised = parseFloat(campaign.raised || 0);
              const goal = parseFloat(campaign.goal || 0);
              
              return (
                <Card key={campaign.id} className="border-none shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-purple-800 mb-2">
                          {campaign.title}
                        </CardTitle>
                        <Badge variant={campaign.isActive ? "default" : "secondary"}>
                          {campaign.isActive ? "Ativa" : "Finalizada"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {campaign.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progresso</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>R$ {raised.toFixed(2)}</span>
                        <span>Meta: R$ {goal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(campaign.startDate).toLocaleDateString('pt-BR')} - {new Date(campaign.endDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {(!Array.isArray(campaigns) || campaigns.length === 0) && (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Nenhuma campanha encontrada
                </h3>
                <p className="text-gray-500 mb-6">
                  Crie sua primeira campanha de arrecadação
                </p>
                <Button onClick={() => setIsCampaignDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Campanha
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="donations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Histórico de Doações</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(donations) && donations.length > 0 ? (
                  donations.map((donation: any) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="font-medium">{donation.donorName}</div>
                            <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">R$ {parseFloat(donation.amount).toFixed(2)}</span>
                          {donation.type === 'recurring' && <span className="ml-2 text-purple-600">(Recorrente)</span>}
                          {donation.notes && <span className="ml-2 italic">- {donation.notes}</span>}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(donation.createdAt).toLocaleDateString('pt-BR')} via {donation.paymentMethod}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={
                            donation.status === 'completed' ? 'default' :
                            donation.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {donation.status === 'completed' ? 'Concluída' :
                           donation.status === 'pending' ? 'Pendente' : 'Falhou'}
                        </Badge>
                        {donation.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateDonationStatusMutation.mutate({ 
                              id: donation.id, 
                              status: 'completed' 
                            })}
                            disabled={updateDonationStatusMutation.isPending}
                          >
                            Confirmar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Nenhuma doação encontrada
                    </h3>
                    <p className="text-gray-500">
                      As doações aparecerão aqui quando forem realizadas
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Doações por Mês</CardTitle>
                <CardDescription>Histórico de arrecadação mensal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'].map((month, index) => {
                    const amount = [2500, 3200, 1800, 4500, 3800, 5200][index];
                    const percentage = (amount / 5200) * 100;
                    return (
                      <div key={month} className="flex items-center justify-between">
                        <span className="text-sm font-medium w-20">{month}</span>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-gray-600 w-20 text-right">R$ {amount}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>Como as pessoas preferem doar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>PIX</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cartão de Crédito</span>
                    <span className="font-semibold">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Transferência</span>
                    <span className="font-semibold">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dinheiro</span>
                    <span className="font-semibold">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas Gerais</CardTitle>
              <CardDescription>Resumo do comportamento dos doadores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">R$ {(totalDonations / 12).toFixed(2)}</div>
                  <p className="text-sm text-gray-600">Média Mensal</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {completedDonations > 0 ? Math.round(totalDonations / completedDonations) : 0}
                  </div>
                  <p className="text-sm text-gray-600">Ticket Médio</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Array.isArray(donations) ? new Set(donations.map((d: any) => d.donorEmail)).size : 0}
                  </div>
                  <p className="text-sm text-gray-600">Doadores Únicos</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Array.isArray(donations) ? donations.filter((d: any) => d.type === 'recurring').length : 0}
                  </div>
                  <p className="text-sm text-gray-600">Doações Recorrentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}