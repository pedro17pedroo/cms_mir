import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Users, MessageCircle, Send, Calendar, Clock, Video, Share2 } from "lucide-react";

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
}

interface LiveStream {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  isLive: boolean;
  viewers: number;
  scheduledTime?: string;
  thumbnail: string;
}

export default function LiveStreaming() {
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: "Maria Silva",
      message: "Que benção esse culto!",
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: "2", 
      user: "João Santos",
      message: "Amém! Deus é fiel",
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: "3",
      user: "Ana Costa",
      message: "Orando por todos vocês 🙏",
      timestamp: new Date()
    }
  ]);

  const { data: events } = useQuery({
    queryKey: ["/api/events"],
  });

  // Sample live stream data - in production this would come from YouTube API
  const currentStream: LiveStream = {
    id: "live-1",
    title: "Culto de Domingo - Transformação através da Fé",
    description: "Junte-se a nós para um momento especial de adoração e reflexão",
    youtubeId: "dQw4w9WgXcQ", // Sample YouTube ID
    isLive: true,
    viewers: 247,
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
  };

  const upcomingStreams = [
    {
      id: "upcoming-1",
      title: "Estudo Bíblico - Quarta-feira",
      scheduledTime: "2025-06-30T19:30:00",
      description: "Explorando as Parábolas de Jesus"
    },
    {
      id: "upcoming-2", 
      title: "Culto de Oração - Sexta-feira",
      scheduledTime: "2025-07-02T20:00:00",
      description: "Momento de intercessão e comunhão"
    }
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: "Você",
        message: chatMessage,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage("");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Transmissão ao Vivo</h1>
          <p className="text-lg md:text-xl opacity-90">
            Participe dos nossos cultos e eventos online
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Stream Video */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl">
              <CardContent className="p-0">
                {currentStream.isLive ? (
                  <div className="relative">
                    {/* Video Player */}
                    <div className="aspect-video bg-black rounded-t-lg relative">
                      <iframe
                        className="w-full h-full rounded-t-lg"
                        src={`https://www.youtube.com/embed/${currentStream.youtubeId}?autoplay=1&modestbranding=1`}
                        title={currentStream.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <Badge className="absolute top-4 left-4 bg-red-600 text-white animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                        AO VIVO
                      </Badge>
                      <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{currentStream.viewers}</span>
                      </div>
                    </div>
                    
                    {/* Stream Info */}
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-purple-800 mb-2">
                        {currentStream.title}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {currentStream.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button className="bg-red-600 hover:bg-red-700">
                          <Video className="h-4 w-4 mr-2" />
                          Assistir no YouTube
                        </Button>
                        <Button variant="outline">
                          <Share2 className="h-4 w-4 mr-2" />
                          Compartilhar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Não estamos transmitindo agora
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Confira os próximos eventos abaixo
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat and Info Sidebar */}
          <div className="space-y-6">
            {/* Live Chat */}
            {currentStream.isLive && (
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                    <span>Chat ao Vivo</span>
                    <Badge variant="outline">{chatMessages.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="flex space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-purple-100 text-purple-600">
                              {msg.user.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-purple-800">
                                {msg.user}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button size="sm" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Streams */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span>Próximas Transmissões</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingStreams.map((stream) => (
                  <div key={stream.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h4 className="font-semibold text-purple-800 mb-1">
                      {stream.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {stream.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(stream.scheduledTime).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Acompanhe nas Redes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://youtube.com', '_blank')}
                >
                  <Video className="h-4 w-4 mr-2 text-red-600" />
                  YouTube
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://facebook.com', '_blank')}
                >
                  <div className="w-4 h-4 mr-2 bg-blue-600 rounded"></div>
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://instagram.com', '_blank')}
                >
                  <div className="w-4 h-4 mr-2 bg-pink-600 rounded"></div>
                  Instagram
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Streams */}
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-8 text-center">
            Transmissões Anteriores
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample previous streams */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-200 rounded-t-lg relative">
                    <img 
                      src={`https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`}
                      alt={`Transmissão ${i}`}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                      45:30
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-purple-800 mb-2">
                      Culto de Domingo - Semana {i}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Mensagem sobre fé e esperança em tempos difíceis
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>há {i} semana{i > 1 ? 's' : ''}</span>
                      <span>1.2k visualizações</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}