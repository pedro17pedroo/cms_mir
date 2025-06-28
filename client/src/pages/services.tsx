import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, Calendar, Play, Heart, BookOpen, Music } from "lucide-react";

export default function Services() {
  const { data: serviceSchedules, isLoading } = useQuery({
    queryKey: ["/api/service-schedules"],
  });

  const { data: events } = useQuery({
    queryKey: ["/api/events"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'music': return <Music className="h-8 w-8 text-purple-600" />;
      case 'heart': return <Heart className="h-8 w-8 text-purple-600" />;
      case 'book': return <BookOpen className="h-8 w-8 text-purple-600" />;
      case 'users': return <Users className="h-8 w-8 text-purple-600" />;
      default: return <Calendar className="h-8 w-8 text-purple-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Nossos Serviços</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Momentos de adoração, comunhão e crescimento espiritual
          </p>
        </div>
      </section>

      {/* Service Schedules */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              Horários dos Cultos
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(serviceSchedules) && serviceSchedules.map((schedule: any) => (
              <Card key={schedule.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {getIcon(schedule.icon)}
                  </div>
                  <CardTitle className="text-xl text-purple-800">
                    {schedule.title}
                  </CardTitle>
                  <Badge variant="outline" className="w-fit mx-auto text-purple-600 border-purple-300">
                    {schedule.day}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold text-lg">{schedule.time}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {schedule.description}
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Play className="h-4 w-4 mr-2" />
                    Participar Online
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              O Que Esperar
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Louvor</h3>
              <p className="text-gray-600">Momentos inspiradores de adoração e música</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-gold-600" />
              </div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Ensino</h3>
              <p className="text-gray-600">Mensagens práticas baseadas na Bíblia</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Comunhão</h3>
              <p className="text-gray-600">Conexão genuína com outras pessoas</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Acolhimento</h3>
              <p className="text-gray-600">Ambiente caloroso e acolhedor para todos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Services */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              Próximos Eventos
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events?.slice(0, 3).map((event: any) => (
              <Card key={event.id} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-purple-800 mb-2">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {event.description}
                      </CardDescription>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">
                      {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    {event.maxAttendees && (
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{event.currentAttendees || 0}/{event.maxAttendees} participantes</span>
                      </div>
                    )}
                  </div>
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                    Mais Informações
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Streaming */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Assista Online
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Não pode vir pessoalmente? Participe dos nossos cultos ao vivo online
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              <Play className="h-5 w-5 mr-2" />
              YouTube Live
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-800">
              <Calendar className="h-5 w-5 mr-2" />
              Ver Cronograma
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              Como Chegar
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-purple-800 mb-6">
                Informações de Localização
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-purple-800">Endereço</h4>
                    <p className="text-gray-600">Rua da Igreja, 123<br />Centro, Cidade - Estado</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-purple-800">Horário de Funcionamento</h4>
                    <p className="text-gray-600">Segunda a Sábado: 9h às 18h<br />Domingo: 8h às 20h</p>
                  </div>
                </div>
              </div>
              <Button className="mt-6 bg-purple-600 hover:bg-purple-700">
                Ver no Mapa
              </Button>
            </div>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Mapa da localização</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}