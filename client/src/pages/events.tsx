import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Event } from "@shared/schema";

export default function Events() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando eventos...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Eventos da Igreja
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Participe dos nossos eventos e fortaleça sua fé em comunidade
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Eventos Agendados
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Users className="w-4 h-4 mr-2" />
                Inscrições Abertas
              </Badge>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Próximos Eventos
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Não perca os eventos especiais da nossa comunidade
              </p>
            </div>

            {events && events.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-orange-100 relative">
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="w-16 h-16 text-purple-400" />
                        </div>
                      )}
                      <Badge className="absolute top-4 left-4 bg-purple-600">
                        {event.category}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 line-clamp-2">
                        {event.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                          {new Date(event.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-purple-600" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                          {event.location}
                        </div>
                        {event.maxAttendees && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2 text-purple-600" />
                            {event.currentAttendees || 0}/{event.maxAttendees} inscritos
                          </div>
                        )}
                      </div>

                      <div className="pt-4">
                        {event.registrationLink ? (
                          <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                              Inscrever-se
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full">
                            Ver Detalhes
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum evento agendado
                </h3>
                <p className="text-gray-600">
                  Fique atento! Novos eventos serão publicados em breve.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-orange-500 to-gold-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Quer organizar um evento?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Entre em contato conosco para propor ou organizar eventos na nossa igreja
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">
                Entre em Contato
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}