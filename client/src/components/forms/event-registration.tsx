import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { Event } from "@shared/schema";

interface EventRegistrationProps {
  event: Event;
  onSuccess?: () => void;
}

export default function EventRegistration({ event, onSuccess }: EventRegistrationProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const registrationMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/event-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          ...data
        })
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Inscrição realizada!",
        description: `Você foi inscrito no evento "${event.title}".`,
      });
      setFormData({ name: "", email: "", phone: "", notes: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/event-registrations", event.id] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro na inscrição",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registrationMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  // Verificar se o evento ainda está aberto para inscrições
  const eventDate = new Date(`${event.date} ${event.time}`);
  const isEventPast = eventDate < new Date();
  const registrationDeadline = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000); // 1 dia antes
  const isRegistrationClosed = new Date() > registrationDeadline;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-600 rounded-full">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900">
            Inscrever-se no Evento
          </CardTitle>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(`${event.date} ${event.time}`).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            
            {event.location && (
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isEventPast ? (
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Evento Encerrado
              </h3>
              <p className="text-gray-500">
                Este evento já aconteceu. Fique atento aos próximos eventos!
              </p>
            </div>
          ) : isRegistrationClosed ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Inscrições Encerradas
              </h3>
              <p className="text-gray-500">
                As inscrições para este evento foram encerradas.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange("phone")}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={handleInputChange("notes")}
                  placeholder="Alguma informação adicional ou necessidade especial..."
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Informações do Evento:
                </h4>
                <p className="text-blue-800 text-sm mb-2">
                  <strong>{event.title}</strong>
                </p>
                <p className="text-blue-700 text-sm">
                  {event.description}
                </p>
              </div>

              <Button
                type="submit"
                disabled={registrationMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
              >
                {registrationMutation.isPending ? (
                  "Processando inscrição..."
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Confirmar Inscrição
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Ao se inscrever, você concorda em receber informações sobre este evento.
                As inscrições encerram 24 horas antes do evento.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}