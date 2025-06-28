import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Play, 
  Users, 
  Calendar, 
  Clock,
  Radio,
  Eye,
  Share2
} from "lucide-react";
import SocialMedia from "./social-media";

interface LiveStream {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  isLive: boolean;
  scheduledAt: string | null;
  viewerCount?: number;
  speaker: string;
  category: string;
}

export default function LiveStreaming() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simular dados de streaming ao vivo - em produção viria da API
  const { data: liveStream, isLoading } = useQuery<LiveStream>({
    queryKey: ["/api/live-stream"],
    queryFn: async () => {
      // Simular chamada à API - substituir por dados reais
      return {
        id: "live-1",
        title: "Culto Ao Vivo - Domingo de Bênçãos",
        description: "Junte-se a nós para um momento especial de adoração, louvor e palavra transformadora. Transmissão ao vivo direto do nosso templo.",
        youtubeId: "dQw4w9WgXcQ", // Em produção, usar ID real do YouTube
        isLive: new Date().getHours() >= 9 && new Date().getHours() <= 11 && new Date().getDay() === 0,
        scheduledAt: getNextSunday(),
        viewerCount: 245,
        speaker: "Pastor João Silva",
        category: "Culto"
      };
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function getNextSunday() {
    const today = new Date();
    const nextSunday = new Date();
    nextSunday.setDate(today.getDate() + (7 - today.getDay()));
    nextSunday.setHours(9, 0, 0, 0);
    return nextSunday.toISOString();
  }

  function formatTimeUntilStream(scheduledTime: string) {
    const now = currentTime.getTime();
    const scheduled = new Date(scheduledTime).getTime();
    const diff = scheduled - now;

    if (diff <= 0) return "Ao vivo agora!";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4"></div>
            <div className="aspect-video bg-white/20 rounded-lg mb-6"></div>
            <div className="h-6 bg-white/20 rounded w-full mb-2"></div>
            <div className="h-6 bg-white/20 rounded w-3/4"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!liveStream) return null;

  const shareUrl = `${window.location.origin}`;
  const shareTitle = `${liveStream.title} - Assista ao vivo!`;

  return (
    <section className="py-16 bg-gray-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-600/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-red-600 rounded-full">
              <Radio className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transmissão Ao Vivo
          </h2>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Participe dos nossos cultos e eventos especiais transmitidos ao vivo. 
            Conecte-se conosco de onde estiver.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-600 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {liveStream.isLive ? (
                      <Badge className="bg-red-500 text-white animate-pulse">
                        <Radio className="h-3 w-3 mr-1" />
                        AO VIVO
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-600 text-white">
                        <Calendar className="h-3 w-3 mr-1" />
                        AGENDADO
                      </Badge>
                    )}
                    
                    {liveStream.viewerCount && liveStream.isLive && (
                      <div className="flex items-center text-white/90">
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-sm">{liveStream.viewerCount.toLocaleString()} assistindo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <SocialMedia 
                      showShareButtons={true} 
                      title={shareTitle}
                      url={shareUrl}
                    />
                  </div>
                </div>
                
                <CardTitle className="text-xl mt-3">
                  {liveStream.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {/* Player de vídeo */}
                <div className="aspect-video bg-black relative">
                  {liveStream.isLive || liveStream.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${liveStream.youtubeId}${liveStream.isLive ? '?autoplay=1' : ''}`}
                      title={liveStream.title}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="text-center">
                        <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Transmissão Programada
                        </h3>
                        <p className="text-gray-400">
                          A transmissão começará em breve
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Informações do stream */}
                <div className="p-6 bg-gray-800">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Sobre esta transmissão
                      </h3>
                      <p className="text-gray-300 mb-4">
                        {liveStream.description}
                      </p>
                      
                      <div className="flex items-center text-gray-400 text-sm mb-2">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{liveStream.speaker}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{liveStream.category}</span>
                      </div>
                    </div>

                    <div className="text-center md:text-right">
                      {liveStream.isLive ? (
                        <div className="bg-red-600 text-white p-4 rounded-lg">
                          <Radio className="h-8 w-8 mx-auto mb-2" />
                          <p className="font-semibold">Transmitindo Ao Vivo</p>
                          <p className="text-red-100 text-sm">
                            Junte-se a nós agora!
                          </p>
                        </div>
                      ) : liveStream.scheduledAt ? (
                        <div className="bg-purple-600 text-white p-4 rounded-lg">
                          <Clock className="h-8 w-8 mx-auto mb-2" />
                          <p className="font-semibold">Próxima Transmissão</p>
                          <p className="text-purple-100 text-sm mb-2">
                            {new Date(liveStream.scheduledAt).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-purple-200 text-xs">
                            Começa em: {formatTimeUntilStream(liveStream.scheduledAt)}
                          </p>
                        </div>
                      ) : null}

                      <Button 
                        className="w-full mt-4 bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)] text-black font-semibold"
                        onClick={() => window.open(`https://youtube.com/channel/UCexample`, '_blank')}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Inscrever-se no Canal
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Programação de transmissões */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <h3 className="text-2xl font-bold text-center mb-6">
              Programação Semanal
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { day: 'Domingo', time: '09:00', event: 'Culto de Celebração' },
                { day: 'Quarta', time: '19:30', event: 'Estudo Bíblico' },
                { day: 'Sexta', time: '19:00', event: 'Reunião de Oração' }
              ].map((schedule, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-white">{schedule.day}</h4>
                    <p className="text-[hsl(43,96%,56%)] font-bold">{schedule.time}</p>
                    <p className="text-gray-300 text-sm">{schedule.event}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}