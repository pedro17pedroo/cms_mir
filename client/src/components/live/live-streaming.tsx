import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Users, 
  MessageCircle,
  Heart,
  Share2,
  Calendar,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

interface LiveStreamProps {
  isLive?: boolean;
  streamUrl?: string;
  title?: string;
  description?: string;
  scheduledTime?: string;
  viewerCount?: number;
  className?: string;
}

export default function LiveStreaming({
  isLive = false,
  streamUrl = "https://www.youtube.com/embed/live_stream?channel=UC_x5XG1OV2P6uZZ5FSM9Ttw",
  title = "Culto Dominical - Vivendo em Fé",
  description = "Junte-se a nós para um momento especial de adoração, oração e reflexão na Palavra de Deus.",
  scheduledTime = "2025-06-29T10:00:00",
  viewerCount = 847,
  className = ""
}: LiveStreamProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: number; user: string; message: string; timestamp: Date }>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [likes, setLikes] = useState(156);
  const [hasLiked, setHasLiked] = useState(false);
  const { toast } = useToast();
  const videoRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Simular mensagens do chat em tempo real
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const messages = [
        { user: "Maria Silva", message: "Que bênção essa palavra! 🙏" },
        { user: "João Santos", message: "Glória a Deus! Aleluia!" },
        { user: "Ana Costa", message: "Orando por todos os irmãos ❤️" },
        { user: "Pedro Lima", message: "Deus abençoe nossa igreja!" },
        { user: "Sofia Oliveira", message: "Palavra poderosa pastor!" },
        { user: "Carlos Mendes", message: "Amém! Que o Senhor nos abençoe" }
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setChatMessages(prev => [...prev.slice(-19), {
        id: Date.now(),
        user: randomMessage.user,
        message: randomMessage.message,
        timestamp: new Date()
      }]);
    }, 3000 + Math.random() * 7000); // 3-10 segundos

    return () => clearInterval(interval);
  }, [isLive]);

  // Auto-scroll do chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Transmissão pausada" : "Transmissão iniciada",
      description: isPlaying ? "Você pode retomar a qualquer momento" : "Aproveitando a transmissão ao vivo"
    });
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement && videoRef.current) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
      toast({
        title: "Obrigado por curtir!",
        description: "Sua interação é importante para nós"
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado!",
        description: "Compartilhe com seus amigos e familiares"
      });
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev.slice(-19), {
        id: Date.now(),
        user: "Você",
        message: newMessage,
        timestamp: new Date()
      }]);
      setNewMessage("");
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`w-full max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Status da Transmissão */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          {isLive ? (
            <Badge className="bg-red-500 text-white animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
              AO VIVO
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-blue-500 text-white">
              <Calendar className="w-3 h-3 mr-1" />
              AGENDADO
            </Badge>
          )}
          
          {isLive && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{viewerCount.toLocaleString()} assistindo</span>
            </div>
          )}
        </div>

        {!isLive && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Inicia às {formatTime(scheduledTime)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Player de Vídeo */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardContent className="p-0">
              <div 
                ref={videoRef}
                className="relative bg-black aspect-video rounded-lg overflow-hidden group"
              >
                {isLive ? (
                  <iframe
                    src={`${streamUrl}&autoplay=1&mute=${isMuted ? 1 : 0}`}
                    title="Live Stream"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-900 to-blue-900">
                    <div className="text-center text-white">
                      <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Transmissão Agendada</h3>
                      <p className="text-gray-300">
                        Inicia em {formatTime(scheduledTime)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Controles do Player */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handlePlayPause}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleMute}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Transmissão */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                  <p className="text-gray-600">{description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant={hasLiked ? "default" : "outline"}
                    onClick={handleLike}
                    className="flex items-center gap-2"
                  >
                    <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                    {likes}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                  </Button>

                  <div className="flex items-center gap-2 text-sm text-gray-600 ml-auto">
                    <Users className="h-4 w-4" />
                    <span>{viewerCount.toLocaleString()} visualizações</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Ao Vivo */}
        <div className="lg:col-span-1">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5" />
                Chat ao Vivo
                {isLive && (
                  <Badge variant="secondary" className="ml-auto">
                    {chatMessages.length} mensagens
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-4 space-y-4">
              {/* Mensagens do Chat */}
              <div 
                ref={chatRef}
                className="flex-1 overflow-y-auto space-y-3 pr-2"
                style={{ maxHeight: "400px" }}
              >
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {isLive ? "Seja o primeiro a comentar!" : "Chat iniciará com a transmissão"}
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                          {msg.user.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-900">{msg.user}</span>
                            <span className="text-xs text-gray-500">
                              {msg.timestamp.toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 break-words">{msg.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Input de Mensagem */}
              {isLive && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength={200}
                  />
                  <Button
                    size="sm"
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                  >
                    Enviar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}