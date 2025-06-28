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
import { Video, Play, Calendar, Users, Settings, Plus, Edit, Trash2, Eye, Clock } from "lucide-react";

interface StreamSchedule {
  id: string;
  title: string;
  description: string;
  scheduledTime: string;
  youtubeId?: string;
  isLive: boolean;
  maxViewers: number;
  currentViewers: number;
}

export default function StreamingManager() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newStream, setNewStream] = useState({
    title: "",
    description: "",
    scheduledTime: "",
    youtubeId: ""
  });

  // Sample streaming data - in production this would come from database and YouTube API
  const streamSchedules: StreamSchedule[] = [
    {
      id: "1",
      title: "Culto de Domingo - Transformação",
      description: "Mensagem especial sobre transformação através da fé",
      scheduledTime: "2025-06-29T10:00:00",
      youtubeId: "dQw4w9WgXcQ",
      isLive: false,
      maxViewers: 500,
      currentViewers: 0
    },
    {
      id: "2", 
      title: "Estudo Bíblico - Quarta-feira",
      description: "Explorando as Parábolas de Jesus - Capítulo 3",
      scheduledTime: "2025-06-30T19:30:00",
      isLive: false,
      maxViewers: 200,
      currentViewers: 0
    },
    {
      id: "3",
      title: "Vigília de Oração",
      description: "Momento especial de intercessão e oração",
      scheduledTime: "2025-07-01T21:00:00",
      isLive: true,
      maxViewers: 300,
      currentViewers: 127
    }
  ];

  const streamingStats = {
    totalStreams: 45,
    totalViewers: 12350,
    avgViewers: 275,
    totalWatchTime: "2,450h",
    subscribers: 890,
    growthRate: 15.2
  };

  const handleCreateStream = () => {
    if (!newStream.title || !newStream.scheduledTime) {
      toast({
        title: "Erro",
        description: "Título e horário são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // In production, this would create a new stream in the database
    toast({ title: "Transmissão agendada com sucesso!" });
    setIsCreateDialogOpen(false);
    setNewStream({ title: "", description: "", scheduledTime: "", youtubeId: "" });
  };

  const handleGoLive = (streamId: string) => {
    // In production, this would start the live stream
    toast({ title: "Transmissão iniciada!" });
  };

  const handleEndStream = (streamId: string) => {
    // In production, this would end the live stream
    toast({ title: "Transmissão finalizada!" });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-purple-800">Gestão de Streaming</h2>
          <p className="text-gray-600">Configure e monitore transmissões ao vivo</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Transmissão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar Nova Transmissão</DialogTitle>
              <DialogDescription>
                Configure os detalhes da sua próxima transmissão ao vivo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stream-title">Título *</Label>
                <Input
                  id="stream-title"
                  placeholder="Ex: Culto de Domingo"
                  value={newStream.title}
                  onChange={(e) => setNewStream(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stream-desc">Descrição</Label>
                <Textarea
                  id="stream-desc"
                  placeholder="Descreva o conteúdo da transmissão..."
                  value={newStream.description}
                  onChange={(e) => setNewStream(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stream-time">Data e Hora *</Label>
                <Input
                  id="stream-time"
                  type="datetime-local"
                  value={newStream.scheduledTime}
                  onChange={(e) => setNewStream(prev => ({ ...prev, scheduledTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stream-youtube">ID do Vídeo YouTube (opcional)</Label>
                <Input
                  id="stream-youtube"
                  placeholder="dQw4w9WgXcQ"
                  value={newStream.youtubeId}
                  onChange={(e) => setNewStream(prev => ({ ...prev, youtubeId: e.target.value }))}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleCreateStream} className="flex-1">
                  Agendar
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Agenda</TabsTrigger>
          <TabsTrigger value="live">Ao Vivo</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid gap-4">
            {streamSchedules.map((stream) => (
              <Card key={stream.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg text-purple-800">{stream.title}</h3>
                        <Badge 
                          variant={stream.isLive ? "default" : "secondary"}
                          className={stream.isLive ? "bg-red-600 animate-pulse" : ""}
                        >
                          {stream.isLive ? "AO VIVO" : "AGENDADO"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{stream.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateTime(stream.scheduledTime)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{stream.currentViewers}/{stream.maxViewers} visualizadores</span>
                        </div>
                        {stream.youtubeId && (
                          <div className="flex items-center space-x-1">
                            <Video className="h-4 w-4" />
                            <span>YouTube ID: {stream.youtubeId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {stream.isLive ? (
                        <>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Monitor
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleEndStream(stream.id)}
                          >
                            Finalizar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            size="sm"
                            onClick={() => handleGoLive(stream.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Iniciar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          {streamSchedules.filter(s => s.isLive).length > 0 ? (
            <div className="space-y-6">
              {streamSchedules.filter(s => s.isLive).map((stream) => (
                <Card key={stream.id} className="border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                      <span>Transmissão Ativa</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{stream.title}</h3>
                        <p className="text-gray-600 mb-4">{stream.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Visualizadores atuais:</span>
                            <Badge>{stream.currentViewers}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Duração:</span>
                            <span>1h 23min</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Qualidade:</span>
                            <Badge variant="outline">1080p</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Controles de Transmissão</h4>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full">
                            <Settings className="h-4 w-4 mr-2" />
                            Configurações de Vídeo
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Users className="h-4 w-4 mr-2" />
                            Moderar Chat
                          </Button>
                          <Button variant="destructive" className="w-full">
                            Finalizar Transmissão
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Nenhuma transmissão ativa
                </h3>
                <p className="text-gray-500 mb-6">
                  Inicie uma transmissão da agenda ou crie uma nova
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Transmissão
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Streams</CardTitle>
                <Video className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{streamingStats.totalStreams}</div>
                <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Visualizadores</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{streamingStats.totalViewers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+{streamingStats.growthRate}% crescimento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média de Visualizadores</CardTitle>
                <Eye className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{streamingStats.avgViewers}</div>
                <p className="text-xs text-muted-foreground">Por transmissão</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{streamingStats.totalWatchTime}</div>
                <p className="text-xs text-muted-foreground">Tempo assistido</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas da Semana</CardTitle>
              <CardDescription>Visualizadores por dia da semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, index) => {
                  const viewers = [45, 32, 180, 67, 89, 156, 420][index];
                  const percentage = (viewers / 420) * 100;
                  return (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-20">{day}</span>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-right">{viewers} views</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do YouTube</CardTitle>
                <CardDescription>Configure a integração com o YouTube Live</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="yt-api-key">API Key do YouTube</Label>
                  <Input
                    id="yt-api-key"
                    type="password"
                    placeholder="••••••••••••••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yt-channel-id">ID do Canal</Label>
                  <Input
                    id="yt-channel-id"
                    placeholder="UCxxxxxxxxxxxxxxxxxx"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-record" defaultChecked />
                  <Label htmlFor="auto-record">Gravar automaticamente</Label>
                </div>
                <Button>Salvar Configurações</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Transmissão</CardTitle>
                <CardDescription>Ajustes gerais para as transmissões</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-quality">Qualidade Padrão</Label>
                  <select 
                    id="default-quality" 
                    className="w-full p-2 border rounded-md"
                    defaultValue="1080p"
                  >
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                    <option value="4k">4K</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-viewers">Limite de Visualizadores</Label>
                  <Input
                    id="max-viewers"
                    type="number"
                    defaultValue="500"
                    placeholder="500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="chat-enabled" defaultChecked />
                  <Label htmlFor="chat-enabled">Chat habilitado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" defaultChecked />
                  <Label htmlFor="notifications">Notificações automáticas</Label>
                </div>
                <Button>Salvar Configurações</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}