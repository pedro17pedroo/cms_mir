import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { type Event } from "@shared/schema";

export default function EventsSection() {
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Próximos Eventos</h2>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Filtrar apenas eventos futuros e ativos
  const upcomingEvents = events
    .filter((event: Event) => {
      const eventDate = new Date(event.date);
      const today = new Date();
      return eventDate >= today;
    })
    .slice(0, 3); // Mostrar apenas os próximos 3 eventos

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Próximos Eventos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Junte-se a nós em nossos próximos eventos e experiências especiais na igreja
          </p>
        </div>

        {/* Events Grid */}
        {upcomingEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {upcomingEvents.map((event: Event) => (
              <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <div className="relative">
                  {event.imageUrl && (
                    <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                      {format(new Date(event.date), "dd MMM", { locale: ptBR })}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarDays className="h-4 w-4 mr-2 text-orange-500" />
                    {format(new Date(event.date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-orange-500" />
                    {event.time}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                    {event.location}
                  </div>
                  
                  {event.maxAttendees && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-orange-500" />
                      Vagas: {event.maxAttendees}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum evento agendado</h3>
            <p className="text-gray-500">Novos eventos serão anunciados em breve!</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/events">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
              Ver Todos os Eventos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}