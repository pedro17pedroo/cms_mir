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
import { 
  Video, 
  Plus, 
  Settings, 
  BarChart3, 
  Calendar, 
  Users, 
  Play, 
  Pause, 
  Square,
  Eye,
  Clock,
  MessageCircle,
  Share2
} from "lucide-react";

export default function StreamingManager() {
  const [activeTab, setActiveTab] = useState("live");
  const [isStreamDialogOpen, setIsStreamDialogOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newStream, setNewStream] = useState({
    title: "",
    description: "",
    scheduledTime: "",
    platform: "youtube"
  });

  // Sample streaming data
  const streamingStats = {
    currentViewers: 127,
    totalViews: 2450,
    peakViewers: 189,
    streamDuration: "1h 23m",
    chatMessages: 342,
    likes: 78,
    shares: 12
  };

  const scheduledStreams = [
    {
      id: "1",
      title: "Culto Dominical - Manhã",
      description: "Culto de domingo pela manhã com louvor e palavra",
      scheduledTime: "2025-06-29T09:00:00",
      platform: "youtube",
      status: "scheduled",
      estimatedViewers: 150
    },
    {
      id: "2", 
      title: "Estudo Bíblico - Quarta",
      description: "Estudo da palavra com Pastor João",
      scheduledTime: "2025-07-02T19:30:00",
      platform: "facebook",
      status: "scheduled",
      estimatedViewers: 85
    },
    {
      id: "3",
      title: "Culto de Oração",
      description: "Momento especial de oração e intercessão",
      scheduledTime: "2025-07-01T20:00:00",
      platform: "youtube",
      status: "scheduled",
      estimatedViewers: 120
    }
  ];

  const recentStreams = [
    {
      id: "1",
      title: "Culto Dominical - 23/06",
      views: 245,
      duration: "1h 45m",
      date: "2025-06-23",
      platform: "youtube",
      engagement: 78.5
    },
    {
      id: "2",
      title: "Estudo Bíblico - 19/06", 
      views: 156,
      duration: "1h 15m",
      date: "2025-06-19",
      platform: "facebook",
      engagement: 82.1
    },
    {
      id: "3",
      title: "Culto de Oração - 17/06",
      views: 189,
      duration: "1h 30m", 
      date: "2025-06-17",
      platform: "youtube",
      engagement: 75.3
    }
  ];

  const handleCreateStream = () => {
    if (!newStream.title || !newStream.scheduledTime) {
      toast({
        title: "Erro",
        description: "Título e horário são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    toast({ title: "Stream agendada com sucesso!" });
    setIsStreamDialogOpen(false);
    setNewStream({ title: "", description: "", scheduledTime: "", platform: "youtube" });
  };

  const handleStartStream = () => {
    setIsLive(true);
    toast({ title: "Stream iniciada!" });
  };

  const handleStopStream = () => {
    setIsLive(false);
    toast({ title: "Stream finalizada!" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-purple-800">Gestão de Streaming</h2>
          <p className="text-gray-600">Controle suas transmissões ao vivo</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isStreamDialogOpen} onOpenChange={setIsStreamDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Agendar Stream
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agendar Nova Stream</DialogTitle>
                <DialogDescription>
                  Configure uma nova transmissão ao vivo
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stream-title">Título *</Label>
                  <Input
                    id="stream-title"
                    placeholder="Ex: Culto Dominical"
                    value={newStream.title}
                    onChange={(e) => setNewStream(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream-desc">Descrição</Label>
                  <Textarea
                    id="stream-desc"
                    placeholder="Descreva a transmissão..."
                    value={newStream.description}
                    onChange={(e) => setNewStream(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stream-time">Horário *</Label>
                    <Input
                      id="stream-time"
                      type="datetime-local"
                      value={newStream.scheduledTime}
                      onChange={(e) => setNewStream(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stream-platform">Plataforma *</Label>
                    <select
                      id="stream-platform"
                      className="w-full p-2 border rounded-md"
                      value={newStream.platform}
                      onChange={(e) => setNewStream(prev => ({ ...prev, platform: e.target.value }))}
                    >
                      <option value="youtube">YouTube</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleCreateStream} className="flex-1">
                    Agendar Stream
                  </Button>
                  <Button variant="outline" onClick={() => setIsStreamDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {!isLive ? (
            <Button onClick={handleStartStream} className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-2" />
              Iniciar Live
            </Button>
          ) : (
            <Button onClick={handleStopStream} variant="destructive">
              <Square className="h-4 w-4 mr-2" />
              Finalizar Live
            </Button>
          )}
        </div>
      </div>

      {/* Live Status */}
      {isLive && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-semibold text-red-800">AO VIVO</h3>
                  <p className="text-sm text-red-600">Transmitindo agora no YouTube</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-700">{streamingStats.currentViewers}</div>
                  <p className="text-xs text-red-600">Visualizações</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-700">{streamingStats.streamDuration}</div>
                  <p className="text-xs text-red-600">Duração</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-700">{streamingStats.chatMessages}</div>
                  <p className="text-xs text-red-600">Mensagens</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live">Ao Vivo</TabsTrigger>
          <TabsTrigger value="scheduled">Agendadas</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-6">
          {/* Live Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visualizações Atuais</CardTitle>
                <Eye className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{streamingStats.currentViewers}</div>
                <p className="text-xs text-muted-foreground">
                  Pico: {streamingStats.peakViewers}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Duração</CardTitle>
                <Clock className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{streamingStats.streamDuration}</div>
                <p className="text-xs text-muted-foreground">Tempo no ar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chat</CardTitle>
                <MessageCircle className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{streamingStats.chatMessages}</div>
                <p className="text-xs text-muted-foreground">mensagens</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engajamento</CardTitle>
                <Share2 className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{streamingStats.likes + streamingStats.shares}</div>
                <p className="text-xs text-muted-foreground">curtidas + compartilhamentos</p>
              </CardContent>
            </Card>
          </div>

          {/* Live Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Controles da Transmissão</CardTitle>
              <CardDescription>Gerencie sua stream ao vivo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Settings className="h-6 w-6" />
                  <span>Configurações</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <MessageCircle className="h-6 w-6" />
                  <span>Moderar Chat</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Share2 className="h-6 w-6" />
                  <span>Compartilhar</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Estatísticas</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stream Quality */}
          <Card>
            <CardHeader>
              <CardTitle>Qualidade da Stream</CardTitle>
              <CardDescription>Monitore a qualidade da transmissão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Qualidade de Vídeo</span>
                  <Badge variant="default">1080p</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Taxa de Bits</span>
                  <span className="font-medium">4500 kbps</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>FPS</span>
                  <span className="font-medium">30 fps</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estabilidade</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-600">Estável</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <div className="space-y-4">
            {scheduledStreams.map((stream) => (
              <Card key={stream.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{stream.title}</h3>
                        <Badge variant="secondary">
                          {stream.platform === 'youtube' ? 'YouTube' : 
                           stream.platform === 'facebook' ? 'Facebook' : 'Instagram'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{stream.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(stream.scheduledTime).toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>~{stream.estimatedViewers} visualizações esperadas</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Play className="h-4 w-4 mr-1" />
                        Iniciar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="space-y-4">
            {recentStreams.map((stream) => (
              <Card key={stream.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{stream.title}</h3>
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Data:</span>
                          <div className="font-medium">{new Date(stream.date).toLocaleDateString('pt-BR')}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Visualizações:</span>
                          <div className="font-medium">{stream.views}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Duração:</span>
                          <div className="font-medium">{stream.duration}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Engajamento:</span>
                          <div className="font-medium">{stream.engagement}%</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                      <Button variant="outline" size="sm">
                        Repetir Stream
                      </Button>
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
                <CardTitle>Visualizações por Mês</CardTitle>
                <CardDescription>Audiência das transmissões</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'].map((month, index) => {
                    const views = [1250, 1890, 1456, 2045, 1878, 2234][index];
                    const percentage = (views / 2234) * 100;
                    return (
                      <div key={month} className="flex items-center justify-between">
                        <span className="text-sm font-medium w-20">{month}</span>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-gray-600 w-20 text-right">{views}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horários de Maior Audiência</CardTitle>
                <CardDescription>Quando sua audiência está online</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Domingo - 09:00</span>
                    <span className="font-semibold">245 visualizações médias</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quarta - 19:30</span>
                    <span className="font-semibold">156 visualizações médias</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sexta - 20:00</span>
                    <span className="font-semibold">189 visualizações médias</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Domingo - 19:00</span>
                    <span className="font-semibold">198 visualizações médias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas Gerais</CardTitle>
              <CardDescription>Resumo das suas transmissões</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <p className="text-sm text-gray-600">Streams este mês</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">2.1h</div>
                  <p className="text-sm text-gray-600">Duração média</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">167</div>
                  <p className="text-sm text-gray-600">Visualizações médias</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">78.5%</div>
                  <p className="text-sm text-gray-600">Taxa de retenção</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}