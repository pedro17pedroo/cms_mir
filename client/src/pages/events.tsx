import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MapPin, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import EventRegistration from "@/components/forms/event-registration";
import type { Event } from "@shared/schema";

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: events = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/events"],
  });

  const categories = ["all", "conference", "worship", "youth", "community"];

  const filteredEvents = selectedCategory === "all" 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  const formatDate = (date: string, time: string) => {
    const dateTime = new Date(`${date} ${time}`);
    return dateTime.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'conference':
        return 'bg-[hsl(262,83%,58%)]';
      case 'worship':
        return 'bg-[hsl(43,96%,56%)]';
      case 'youth':
        return 'bg-[hsl(25,95%,53%)]';
      case 'community':
        return 'bg-green-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[hsl(262,83%,58%)] mb-4">
            Eventos da Igreja
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Participe dos nossos eventos e faça parte desta família de fé
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-[hsl(262,83%,58%)]" : ""}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[hsl(262,83%,58%)] mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando eventos...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="relative">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&w=400&h=300&auto=format&fit=crop';
                      }}
                    />
                    <Badge 
                      className={`absolute top-2 right-2 ${getCategoryColor(event.category)} text-white`}
                    >
                      {event.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-[hsl(262,83%,58%)]">
                    {event.title}
                  </CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-[hsl(43,96%,56%)]" />
                      {formatDate(event.date, event.time)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-[hsl(43,96%,56%)]" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-[hsl(43,96%,56%)]" />
                      {event.location}
                    </div>
                    {event.maxAttendees && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-[hsl(43,96%,56%)]" />
                        {event.currentAttendees || 0} / {event.maxAttendees} participantes
                      </div>
                    )}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full mt-4 bg-[hsl(43,96%,56%)] hover:bg-[hsl(43,96%,46%)]">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Inscrever-se
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <EventRegistration event={event} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredEvents.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">
              Nenhum evento encontrado nesta categoria
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}